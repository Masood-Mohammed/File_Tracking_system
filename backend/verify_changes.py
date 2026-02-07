import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000/api"

def test_analytics():
    print("Testing Analytics Endpoint...")
    try:
        res = requests.get(f"{BASE_URL}/files/analytics")
        if res.status_code == 200:
            data = res.json()
            if 'day' in data and 'week' in data and 'month' in data and 'year' in data and 'category' in data:
                print("SUCCESS: Analytics Keys found.")
                print(f"Sample Category Data: {data['category']}")
            else:
                print("FAILURE: Missing analytics keys.")
        else:
            print(f"FAILURE: Status {res.status_code}")
    except Exception as e:
        print(f"FAILURE: {e}")

def test_completion_constraint(file_id, user_id):
    print(f"\nTesting Completion Constraint for File {file_id}...")
    
    # 1. Try without remarks
    try:
        res = requests.post(f"{BASE_URL}/files/{file_id}/complete", json={
            "user_id": user_id,
            "outcome": "Completed Successfully",
            "remarks": "" 
        })
        if res.status_code == 400:
            print("SUCCESS: Blocked completion without remarks.")
        else:
            print(f"FAILURE: Allowed completion without remarks (Status {res.status_code})")
    except Exception as e:
        print(f"FAILURE: {e}")
    
    # 2. Try with remarks
    try:
        res = requests.post(f"{BASE_URL}/files/{file_id}/complete", json={
            "user_id": user_id,
            "outcome": "Completed Successfully",
            "remarks": "Valid remarks" 
        })
        if res.status_code == 200:
            print("SUCCESS: Allowed completion with remarks.")
        else:
            print(f"FAILURE: Failed completion with remarks (Status {res.status_code})")
    except Exception as e:
        print(f"FAILURE: {e}")

def test_deletion_constraint(file_id):
    print(f"\nTesting Deletion Constraint for File {file_id}...")

    # 1. Try without reason
    try:
        res = requests.delete(f"{BASE_URL}/files/{file_id}", json={})
        if res.status_code == 400:
            print("SUCCESS: Blocked deletion without reason.")
        else:
            print(f"FAILURE: Allowed deletion without reason (Status {res.status_code})")
    except Exception as e:
        print(f"FAILURE: {e}")

    # 2. Try with reason (Actually deletes it, so be careful or create a dummy first)
    # Let's assume we can delete if it exists
    try:
        res = requests.delete(f"{BASE_URL}/files/{file_id}", json={"reason": "Test Deletion"})
        if res.status_code == 200:
            print("SUCCESS: Allowed deletion with reason.")
        else:
            print(f"FAILURE: Failed deletion with reason (Status {res.status_code})")
    except Exception as e:
        print(f"FAILURE: {e}")

def setup_dummy_file():
    # Simple direct DB insert or intake call would be better
    # Let's use intake
    try:
        res = requests.post(f"{BASE_URL}/files/intake", json={
            "source": "Test",
            "description": "Test Grievance for Verification"
        })
        if res.status_code == 201:
            return res.json()['id']
    except:
        pass
    return None

if __name__ == "__main__":
    # Ensure server is running (User's responsibility usually, but I'll assume it is or I can't test)
    # I'll create 2 dummy files
    id1 = setup_dummy_file()
    id2 = setup_dummy_file()
    
    if id1 and id2:
        print(f"Created dummy files: {id1}, {id2}")
        test_analytics()
        # Need a user ID for completion, let's assume 1 (admin/sec usually)
        test_completion_constraint(id1, 1) 
        test_deletion_constraint(id2)
    else:
        print("Could not create dummy files. Is the server running?")
