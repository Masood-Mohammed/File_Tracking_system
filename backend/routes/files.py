from flask import Blueprint, request, jsonify, current_app, send_from_directory
from models import db, File, User, FileMovement
from services.gemini_service import analyze_grievance
from datetime import datetime
import os
import werkzeug

files_bp = Blueprint('files', __name__)
uploads_bp = Blueprint('uploads', __name__)

@uploads_bp.route('/<filename>')
def uploaded_file(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename)

@files_bp.route('/', methods=['GET'])
def get_files():
    role = request.args.get('role')
    user_id = request.args.get('user_id')
    status_filter = request.args.get('status') # 'Pending' or 'Completed'
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')

    query = File.query

    # Permissions:
    # Collector & Secretary: See ALL
    # CC: See Assigned OR Previously Assigned? Sticking to Currently Assigned for 'cc' role view.
    
    if role == 'cc':
        query = query.filter_by(current_officer_id=user_id)
    
    # Filter by status if provided
    if status_filter:
        query = query.filter_by(status=status_filter)

    # Date Filtering (for Registers)
    if start_date:
        try:
            start = datetime.strptime(start_date, '%Y-%m-%d')
            query = query.filter(File.created_at >= start)
        except ValueError:
            pass # Ignore invalid date format
            
    if end_date:
        try:
            # End date should be inclusive, so set time to 23:59:59 or add 1 day
            end = datetime.strptime(end_date, '%Y-%m-%d')
            end = end.replace(hour=23, minute=59, second=59)
            query = query.filter(File.created_at <= end)
        except ValueError:
            pass

    files = query.order_by(File.created_at.desc()).all()
    return jsonify([f.to_dict() for f in files])

@files_bp.route('/intake', methods=['POST'])
def intake_file():
    # Handle File Upload (Multipart) or JSON (Webhook)
    source = 'Hand' # Default for form upload
    content = ''
    file_path = None
    
    if 'file' in request.files:
        file = request.files['file']
        if file.filename != '':
            filename = werkzeug.utils.secure_filename(file.filename)
            # Make unique
            filename = f"{datetime.now().timestamp()}_{filename}"
            save_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(save_path)
            file_path = f"/uploads/{filename}"
            # For Gemini, we might want to pass the file path or extract text. 
            # For now, simplistic approach: if image/pdf, we assume Gemini can handle content if we read it? 
            # The current gemini_service expects text. Ideally we'd OCR here. 
            # But requirement says "Do NOT use traditional OCR... Use Gemini".
            # So we should send file to Gemini. For simplicity in this step, we'll pass a placeholder text if no description.
            content = request.form.get('description', '') 
            source = request.form.get('source', 'Hand')
    else:
        # JSON Webhook
        data = request.json
        source = data.get('source', 'Unknown')
        content = data.get('description') or data.get('content', '')
        save_path = None

    # AI Processing
    # Pass absolute path if available (save_path defined in if block scope? Python scope is function level, so yes if initialized)
    analysis_file_path = None
    if file_path:
        # Reconstruct absolute path from save logic above
        # Need to be careful about scope, let's just use the var if it was set
        if 'save_path' in locals():
            analysis_file_path = save_path

    analysis = analyze_grievance(content, analysis_file_path)

    # Auto-assign to Secretary
    secretary = User.query.filter_by(role='secretary').first()
    secretary_id = secretary.id if secretary else None

    new_file = File(
        source=source,
        grievance_summary=analysis.get('grievance_summary', 'No summary'),
        category=analysis.get('category', 'Other'),
        priority=analysis.get('priority', 'Medium'),
        department=analysis.get('department', 'General'),
        status='Pending',
        current_officer_id=secretary_id,
        file_path=file_path
    )

    db.session.add(new_file)
    db.session.commit()

    # Log movement (System -> Secretary)
    if secretary_id:
        move = FileMovement(
            file_id=new_file.id,
            from_officer_id=None, # System
            to_officer_id=secretary_id,
            remarks="Auto-assigned on intake"
        )
        db.session.add(move)
        db.session.commit()

    return jsonify(new_file.to_dict()), 201

@files_bp.route('/<int:file_id>/forward', methods=['POST'])
def forward_file(file_id):
    data = request.json
    from_user_id = data.get('from_user_id')
    to_user_id = data.get('to_user_id')
    remarks = data.get('remarks')

    file = File.query.get_or_404(file_id)

    # 1. Enforce Ownership: Only the current officer can forward the file.
    # We must cast IDs to int for safe comparison if strict typing isn't guaranteed, but usually they are ints.
    if file.current_officer_id is not None and int(file.current_officer_id) != int(from_user_id):
        return jsonify({"error": "Unauthorized: You do not currently possess this file."}), 403

    
    # Update file
    file.current_officer_id = to_user_id
    file.status = 'In Progress'
    
    # Log movement
    move = FileMovement(
        file_id=file.id,
        from_officer_id=from_user_id,
        to_officer_id=to_user_id,
        remarks=remarks
    )
    
    db.session.add(move)
    db.session.commit()
    return jsonify(file.to_dict())

@files_bp.route('/<int:file_id>/complete', methods=['POST'])
def complete_file(file_id):
    data = request.json
    user_id = data.get('user_id') 
    outcome = data.get('outcome', 'Completed Successfully') # 'Completed Successfully' or 'Rejected'
    remarks = data.get('remarks', '')
    
    full_remarks = f"COMPLETED: {outcome}"
    if remarks:
        full_remarks += f" - {remarks}"

    file = File.query.get_or_404(file_id)
    file.status = 'Completed'
    # Keep current owner or move to archive? 
    # Usually "Completed" means it's done. Owner stays same for record purposes or moves to "Record Room".
    # For now, owner stays same.
    
    move = FileMovement(
        file_id=file.id,
        from_officer_id=user_id,
        to_officer_id=user_id, 
        remarks=full_remarks
    )
    
    db.session.add(move)
    db.session.commit()
    return jsonify(file.to_dict())

@files_bp.route('/<int:file_id>/history', methods=['GET'])
def get_history(file_id):
    movements = FileMovement.query.filter_by(file_id=file_id).order_by(FileMovement.timestamp.asc()).all()
    return jsonify([m.to_dict() for m in movements])

@files_bp.route('/<int:file_id>', methods=['DELETE'])
def delete_file(file_id):
    file = File.query.get_or_404(file_id)
    
    # Delete associated movements first to avoid foreign key constraints if no cascade
    FileMovement.query.filter_by(file_id=file_id).delete()
    
    db.session.delete(file)
    db.session.commit()
    return jsonify({"message": "File deleted successfully"}), 200
