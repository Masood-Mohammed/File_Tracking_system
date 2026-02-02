from flask import Blueprint, request, jsonify
from models import db, User
import hashlib

auth_bp = Blueprint('auth', __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    
    if user and user.password_hash == hash_password(password):
        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "token": "dummy-token-for-demo" # simplistic token for demo
        }), 200
    
    return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/setup', methods=['POST'])
def setup_users():
    # Only for initial setup demo
    users = [
        {"username": "collector", "password": "password", "role": "collector"},
        {"username": "secretary", "password": "password", "role": "secretary"},
        {"username": "cc", "password": "password", "role": "cc"}
    ]
    
    created = []
    for u in users:
        if not User.query.filter_by(username=u['username']).first():
            new_user = User(username=u['username'], password_hash=hash_password(u['password']), role=u['role'])
            db.session.add(new_user)
            created.append(u['username'])
    
    db.session.commit()
    return jsonify({"message": "Users created", "users": created})

@auth_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])
