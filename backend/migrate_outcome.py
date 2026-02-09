import sqlite3
import os
from contextlib import closing

# Adjust this path if your database location on PythonAnywhere is different
# On PythonAnywhere, it's often in the same directory or specified in app config
DB_NAME = 'instance/file_tracking.db' 

def migrate():
    # Use a local variable to avoid UnboundLocalError with global
    db_path = DB_NAME

    # Ensure current directory is backend
    if not os.path.exists(db_path):
        # Try absolute path based on CWD if relative fails, or check common locations
        print(f"Database not found at {db_path}. Checking current directory...")
        if os.path.exists('file_tracking.db'):
            db_path = 'file_tracking.db'
        else:
            print("Could not locate database file. Please ensure you are in the 'backend' directory.")
            return

    print(f"Migrating database: {db_path}")
    
    with closing(sqlite3.connect(db_path)) as conn:
        with closing(conn.cursor()) as cursor:
            # Add outcome column
            try:
                cursor.execute("ALTER TABLE file ADD COLUMN outcome VARCHAR(50)")
                print("Added 'outcome' column.")
            except sqlite3.OperationalError:
                print("'outcome' column likely exists.")

            # Add closing_remarks column
            try:
                cursor.execute("ALTER TABLE file ADD COLUMN closing_remarks TEXT")
                print("Added 'closing_remarks' column.")
            except sqlite3.OperationalError:
                print("'closing_remarks' column likely exists.")
                
            conn.commit()
            print("Migration complete.")

if __name__ == "__main__":
    migrate()
