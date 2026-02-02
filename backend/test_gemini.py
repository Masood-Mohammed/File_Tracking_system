import requests

url = "http://127.0.0.1:5000/api/files/intake"
payload = {
    "description": "There is a severe water leakage in the main pipeline near the central park causing flooding.",
    "source": "Hand"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Summary: {data.get('grievance_summary')}")
    print(f"Category: {data.get('category')}")
    print(f"Department: {data.get('department')}")
except Exception as e:
    print(f"Error: {e}")
