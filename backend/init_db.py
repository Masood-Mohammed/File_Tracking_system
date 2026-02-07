from app import create_app, db

app = create_app()

with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully.")
        
        # Seed users
        from models import User
        import hashlib
        
        def hash_password(password):
            return hashlib.sha256(password.encode()).hexdigest()

        users = [
            {"username": "collector", "password": "password", "role": "collector"},
            {"username": "secretary", "password": "password", "role": "secretary"},
            {"username": "cc", "password": "password", "role": "cc"}
        ]
        
        for u in users:
            if not User.query.filter_by(username=u['username']).first():
                new_user = User(username=u['username'], password_hash=hash_password(u['password']), role=u['role'])
                db.session.add(new_user)
                print(f"Created user: {u['username']}")
        
        db.session.commit()
        print("Users seeded successfully.")

    except Exception as e:
        print(f"Error initializing DB: {e}")
