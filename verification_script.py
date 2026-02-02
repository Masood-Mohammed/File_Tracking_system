import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000/api"

def print_step(msg):
    print(f"\n[STEP] {msg}")

def verify():
    # 1. Setup / Login
    print_step("Logging in as Secretary...")
    # Assuming user setup exists or we use simulating IDs if no auth token required for internal APIs?
    # Based on api.js, endpoints don't seem to require JWT header, just logic checks?
    # Checking auth.py... it uses sessions or tokens? 
    # Actually looks like simple logic for now based on app.py?
    # Let's check auth.py content if needed. But assuming IDs work.
    # We will fetch users to get IDs.
    
    users_res = requests.get(f"{BASE_URL}/auth/users")
    users = users_res.json()
    secretary = next(u for u in users if u['role'] == 'secretary')
    collector = next(u for u in users if u['role'] == 'collector')
    cc_officer = next((u for u in users if u['role'] == 'cc'), None)
    
    # Create CC if not exists (for tests)
    if not cc_officer:
        # Assuming we can't create users easily via API without setup. 
        # Using any other user or if only 2 users exist, we use collector as 2nd user.
        cc_officer = collector 

    print(f"Secretary ID: {secretary['id']}, Target ID: {cc_officer['id']}")

    # 2. n8n Compatibility (Intake)
    print_step("Verifying n8n Intake (JSON Webhook)...")
    payload = {
        "source": "n8n_webhook",
        "description": "Verification Test File",
        "category": "Test"
    }
    intake_res = requests.post(f"{BASE_URL}/files/intake", json=payload)
    if intake_res.status_code == 201:
        file_data = intake_res.json()
        file_id = file_data['id']
        print(f"File Created: ID {file_id}")
    else:
        print("Intake Failed", intake_res.text)
        return

    # 3. Inward Register
    print_step("Checking Inward Register (Day-wise filter)...")
    today = datetime.now().strftime('%Y-%m-%d')
    # Secretary checks inward
    reg_url = f"{BASE_URL}/files/?role=secretary&user_id={secretary['id']}&start_date={today}&end_date={today}"
    reg_res = requests.get(reg_url)
    inward_files = reg_res.json()
    
    found = any(f['id'] == file_id for f in inward_files)
    if found:
        print("PASS: File found in Inward Register.")
    else:
        print("FAIL: File not found in Inward Register.")

    # 4. Forwarding Constraint
    print_step("Testing Forwarding Constraint...")
    # Secretary forwards to CC
    fwd_payload = {
        "from_user_id": secretary['id'],
        "to_user_id": cc_officer['id'],
        "remarks": "Forwarding for action"
    }
    fwd_res = requests.post(f"{BASE_URL}/files/{file_id}/forward", json=fwd_payload)
    if fwd_res.status_code == 200:
        print("Forward successful.")
    else:
        print("Forward failed!", fwd_res.text)

    # NOW try to forward AGAIN as Secretary (Should Fail)
    print_step("Testing unauthorized forward (Secretary tries again)...")
    fail_payload = {
        "from_user_id": secretary['id'], # Still acting as Secretary
        "to_user_id": collector['id'],
        "remarks": "Illegal forward"
    }
    fail_res = requests.post(f"{BASE_URL}/files/{file_id}/forward", json=fail_payload)
    if fail_res.status_code == 403:
        print("PASS: Forward blocked as expected (403 Unauthorized).")
    else:
        print(f"FAIL: Forward should have been blocked. Status: {fail_res.status_code}")

    # 5. Outward Register (Completion)
    print_step("Testing Completion & Outward Register...")
    # CC completes the file
    comp_payload = {
        "user_id": cc_officer['id'],
        "outcome": "Completed Successfully",
        "remarks": "Done via script"
    }
    comp_res = requests.post(f"{BASE_URL}/files/{file_id}/complete", json=comp_payload)
    if comp_res.status_code == 200:
        print("Completion successful.")
    else:
        print("Completion failed", comp_res.text)
    
    # Check Outward Register (Completed status)
    # Using the get_files with status=Completed
    out_url = f"{BASE_URL}/files/?role=secretary&user_id={secretary['id']}&status=Completed&start_date={today}&end_date={today}"
    out_res = requests.get(out_url)
    out_files = out_res.json()
    
    found_out = any(f['id'] == file_id for f in out_files)
    if found_out:
        print("PASS: File found in Outward Register (Completed).")
    else:
        print("FAIL: File NOT found in Outward Register.")

if __name__ == "__main__":
    try:
        verify()
    except Exception as e:
        print(f"Verification Script Error: {e}")
