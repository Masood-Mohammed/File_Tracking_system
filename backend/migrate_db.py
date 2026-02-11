import sqlite3
import os

DB_PATH = 'instance/file_tracking.db'

def list_tables():
    if not os.path.exists(DB_PATH):
        print(f"Database {DB_PATH} not found.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if column exists
        cursor.execute("PRAGMA table_info(file)")
        columns = [info[1] for info in cursor.fetchall()]
        
        if 'is_edited' not in columns:
            print("Adding 'is_edited' column to 'file' table...")
            cursor.execute("ALTER TABLE file ADD COLUMN is_edited BOOLEAN DEFAULT 0")
            conn.commit()
            print("Column added successfully.")
        else:
            print("'is_edited' column already exists.")
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    list_tables()
