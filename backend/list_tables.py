import sqlite3

try:
    conn = sqlite3.connect('instance/file_tracking.db')
    cursor = conn.cursor()
    
    print("Listing tables...")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables: {tables}")
            
    conn.close()

except Exception as e:
    print(f"Error: {e}")
