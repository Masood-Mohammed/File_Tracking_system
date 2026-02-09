from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'collector', 'secretary', 'cc'

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role
        }

class File(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    source = db.Column(db.String(20)) # 'hand', 'whatsapp', 'gmail'
    grievance_summary = db.Column(db.Text)
    category = db.Column(db.String(50))
    priority = db.Column(db.String(20)) # 'Low', 'Medium', 'High'
    department = db.Column(db.String(50))
    status = db.Column(db.String(20), default='Pending') # 'Pending', 'In Progress', 'Completed'
    outcome = db.Column(db.String(50), nullable=True) # 'Approved', 'Rejected'
    closing_remarks = db.Column(db.Text, nullable=True)
    current_officer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Nullable if unassigned? Should be assigned to Secretary by default.
    file_path = db.Column(db.String(255), nullable=True) # Path to uploaded file
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    current_officer = db.relationship('User', backref='current_files')

    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source,
            "grievance_summary": self.grievance_summary,
            "category": self.category,
            "priority": self.priority,
            "department": self.department,
            "status": self.status,
            "outcome": self.outcome,
            "closing_remarks": self.closing_remarks,
            "current_officer": self.current_officer.username if self.current_officer else None,
            "file_path": self.file_path,
            "created_at": self.created_at.isoformat()
        }

class FileMovement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_id = db.Column(db.Integer, db.ForeignKey('file.id'), nullable=False)
    from_officer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    to_officer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    remarks = db.Column(db.Text)

    from_officer = db.relationship('User', foreign_keys=[from_officer_id])
    to_officer = db.relationship('User', foreign_keys=[to_officer_id])

    def to_dict(self):
        return {
            "id": self.id,
            "file_id": self.file_id,
            "from_officer": self.from_officer.username if self.from_officer else "System",
            "to_officer": self.to_officer.username,
            "timestamp": self.timestamp.isoformat(),
            "remarks": self.remarks
        }

class DeletedFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_file_id = db.Column(db.Integer, nullable=False) # Keep ID for reference
    source = db.Column(db.String(20))
    grievance_summary = db.Column(db.Text)
    category = db.Column(db.String(50))
    priority = db.Column(db.String(20))
    department = db.Column(db.String(50))
    file_path = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime) # Original creation time
    deleted_at = db.Column(db.DateTime, default=datetime.utcnow)
    deletion_reason = db.Column(db.Text, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "original_file_id": self.original_file_id,
            "source": self.source,
            "grievance_summary": self.grievance_summary,
            "category": self.category,
            "priority": self.priority,
            "department": self.department,
            "file_path": self.file_path,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "deleted_at": self.deleted_at.isoformat(),
            "deletion_reason": self.deletion_reason
        }
