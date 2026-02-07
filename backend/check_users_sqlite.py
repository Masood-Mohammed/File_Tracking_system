import hashlib
import sqlite3

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

try:
    conn = sqlite3.connect('instance/file_tracking.db')
    cursor = conn.cursor()
    
    print("Checking Users directly from SQLite...")
    cursor.execute("SELECT username, password_hash, role FROM user")
    rows = cursor.fetchall()
    
    if not rows:
        print("No users found in database!")
    
    for row in rows:
        username, p_hash, role = row
        print(f"User: {username}, Role: {role}")
        if p_hash == hash_password("password"):
            print("  -> Password 'password' MATCHES")
        else:
            print("  -> Password 'password' DOES NOT MATCH")
            
    conn.close()

except Exception as e:
    print(f"Error: {e}")
