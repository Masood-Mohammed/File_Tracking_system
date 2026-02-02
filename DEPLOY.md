# Backend Deployment Guide

This guide explains how to deploy your Flask backend to popular cloud providers.

## 🐍 Deploying on PythonAnywhere

**PythonAnywhere** is a great choice as it gives you a persistent filesystem (so your SQLite database won't disappear on restart) and a console to manage files.

### 1. Account & Setup
1.  Create a strict Beginner (free) account at [PythonAnywhere](https://www.pythonanywhere.com/).
2.  Go to the **Consoles** tab and start a **Bash** console.

### 2. Get the Code
In the Bash console, run:
```bash
# Clone your repository
git clone https://github.com/Masood-Mohammed/File_Tracking_system.git

# Go into the backend directory
cd File_Tracking_system/backend
```

### 3. Virtual Environment
Create and activate a virtual environment:
```bash
# Create virtualenv (this might take a minute)
python3.10 -m venv venv

# Upgrade pip
./venv/bin/pip install --upgrade pip

# Install dependencies
./venv/bin/pip install -r requirements.txt
./venv/bin/pip install flask-sqlalchemy flask-cors flask-migrate python-dotenv google-generativeai gunicorn
```

### 4. Database Setup
Initialize the database:
```bash
# Set FLASK_APP
export FLASK_APP=app.py

# Run migrations (if you have them) or just init db
./venv/bin/flask db upgrade
# OR if starting fresh:
./venv/bin/python -c "from app import create_app, db; app=create_app(); app.app_context().push(); db.create_all()"
```

### 5. Web App Configuration
1.  Go to the **Web** tab on the PythonAnywhere dashboard.
2.  **Add a new web app**.
3.  Select **Manual Configuration** (NOT Flask directly, as we want to control the WSGI file).
4.  Select **Python 3.10** (or whatever version you used for the venv).

### 6. Configure WSGI File
1.  In the **Web** tab, scroll down to the "Code" section.
2.  Click the link next to **WSGI configuration file** (e.g., `/var/www/yourusername_pythonanywhere_com_wsgi.py`).
3.  **DELETE everything** in that file and replace it with this:

```python
import sys
import os

# Add your project directory to the sys.path
# REPLACE 'yourusername' with your actual PythonAnywhere username
project_home = '/home/yourusername/File_Tracking_system/backend'
if project_home not in sys.path:
    sys.path = [project_home] + sys.path

# Set environment variables (for .env)
# Ideally, use python-dotenv here explicitly if your app doesn't load it automatically on import
from dotenv import load_dotenv
load_dotenv(os.path.join(project_home, '.env'))

# Import flask app but need to call create_app
from app import create_app
application = create_app()
```
4.  **Save** the file.

### 7. Virtualenv Path
1.  Back in the **Web** tab, scroll to the "Virtualenv" section.
2.  Enter the path to your virtualenv:
    `/home/yourusername/File_Tracking_system/backend/venv`
    *(Replace `yourusername` with your actual username)*.

### 8. Environment Variables
1.  You can set environment variables in the WSGI file (as shown above with `load_dotenv`) OR create a `.env` file on the server.
2.  To create the `.env` file via console:
    ```bash
    nano /home/yourusername/File_Tracking_system/backend/.env
    ```
    Paste your secrets (SECRET_KEY, GEMINI_API_KEY, etc.) and save (Ctrl+O, Enter, Ctrl+X).

### 9. Reload
1.  Go to the **Web** tab.
2.  Click the big green **Reload** button.
3.  Visit your site at `https://yourusername.pythonanywhere.com`.

---

## ☁️ Deploying on Render (Alternative)

1.  **New Web Service**: Connect your GitHub repo on [Render](https://dashboard.render.com).
2.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn wsgi:app`
3.  **Environment Variables**: Add them in the Render dashboard.

*Note: Render Free Tier deletes SQLite data on restart. PythonAnywhere keeps it.*
