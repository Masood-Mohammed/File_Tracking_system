from app import create_app
from models import User, db
import hashlib
import os

print(f"Current CWD: {os.getcwd()}")
try:
    app = create_app()
    print(f"DB URI: {app.config['SQLALCHEMY_DATABASE_URI']}")

    with app.app_context():
        try:
            users = User.query.all()
            print(f"Total Users Found: {len(users)}")
            for u in users:
                print(f"User: {u.username}, Role: {u.role}")
        except Exception as e:
            print(f"Query Error: {e}")
except Exception as e:
    print(f"App Creation Error: {e}")
