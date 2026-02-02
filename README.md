# File Tracking System

The **File Tracking System** is a robust digital solution designed to streamline the management and tracking of physical files within an organization. It replaces traditional manual registers with a digital interface, ensuring transparency, accountability, and efficiency in file movement.

## 🚀 Key Features

*   **Digital Inward & Outward Registers**: Automatically generate unique IDs (`INW-...`, `OUT-...`) and maintain accurate records of all incoming and outgoing files.
*   **Real-Time File Tracking**: Instantly locate any file, view its current holder, and trace its full movement history through the organization.
*   **Role-Based Access Control**:
    *   **Admin/Collector**: Full oversight, global search, and system management.
    *   **Officers**: Manage personal workspace, receive/forward files, and update status.
*   **Secure File Handover**: "Forwarding" mechanism ensures files are securely transferred between users, maintaining a chain of custody.
*   **Search & Filtering**: Comprehensive search functionality to find files by subject, file number, date, or applicant name.
*   **Status Management**: Mark files as 'Pending', 'Completed', or 'Rejected' with detailed remarks.

## 🛠️ Technology Stack

*   **Frontend**: React.js (Vite), CSS
*   **Backend**: Python, Flask
*   **Database**: SQLite (Development), PostgreSQL (Production ready)
*   **Authentication**: JWT-based secure login

## ⚙️ Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js & npm
*   Python 3.8+
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/Masood-Mohammed/File_Tracking_system.git
cd File_Tracking_system
```

### 2. Backend Setup
Navigate to the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Configuration**:
Create a `.env` file in the `backend` folder:
```env
SECRET_KEY=your_secret_key_here
# Optional: GEMINI_API_KEY=... (if using AI features)
```

**Initialize Database**:
```bash
flask db upgrade
```

**Run Server**:
```bash
flask run
```
The backend will start at `http://localhost:5000`.

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory.

```bash
cd frontend
npm install
```

**Run Client**:
```bash
npm run dev
```
The frontend will start at `http://localhost:5173`.

## 🚢 Deployment

This project is configured for easy deployment on platforms like Render, Heroku, or Railway.

*   **Backend**: Includes `Procfile`, `wsgi.py`, and `gunicorn` for production readiness.
*   **Database**: Compatible with PostgreSQL for production environments.

For detailed deployment instructions, please refer to [DEPLOY.md](DEPLOY.md).

## 🤝 Contributing

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.
