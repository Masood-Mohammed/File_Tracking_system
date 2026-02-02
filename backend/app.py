import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from models import db
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///file_tracking.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')

    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    db.init_app(app)
    Migrate(app, db)
    CORS(app)

    # Import routes
    from routes.auth import auth_bp
    from routes.files import files_bp, uploads_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(files_bp, url_prefix='/api/files')
    app.register_blueprint(uploads_bp, url_prefix='/uploads')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=int(os.getenv('PORT', 5000)))
