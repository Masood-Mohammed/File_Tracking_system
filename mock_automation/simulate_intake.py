import requests
import json
import random

API_URL = "http://localhost:5000/api/files/intake"

grievances = [
    {
        "source": "WhatsApp",
        "content": "Sir, my old age pension has been pending for 6 months. I have submitted all documents. My Aadhaar is 1234-5678-9012. Please help. Village: Rampur."
    },
    {
        "source": "Gmail",
        "content": "Subject: Road Condition in Ward 5. \nRespected Collector, The road in Ward 5 near the school is completely damaged. It is causing accidents. Please repair it before monsoon."
    },
    {
        "source": "Hand",
        "content": "Application for land survey. Survey number 45/2. Dispute with neighbor regarding boundary."
    },
    {
        "source": "WhatsApp",
        "content": "Water supply is irregular in colony X for the last 10 days. We are buying tankers."
    }
]

def simulate():
    for g in grievances:
        print(f"Sending grievance from {g['source']}...")
        try:
            res = requests.post(API_URL, json=g)
            if res.status_code == 201:
                print("Success:", res.json())
            else:
                print("Failed:", res.status_code, res.text)
        except Exception as e:
            print("Error connecting to backend:", e)
        print("-" * 30)

if __name__ == "__main__":
    simulate()
