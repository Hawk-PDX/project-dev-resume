import requests

API_URL = "https://portfolio-backend-skva.onrender.com/api"

certificates = [
    {
        'entity': 'Scrimba',
        'course': 'Learn React',
        'issue_date': '2025-07-26',
        'credential_url': 'https://scrimba.com/learn-react-c0e',
        'order': 5
    },
    {
        'entity': 'Scrimba',
        'course': 'Advanced React',
        'issue_date': '2025-10-13',
        'credential_url': 'https://scrimba.com/advanced-react-c02h',
        'order': 4
    },
    {
        'entity': 'Scrimba',
        'course': 'JavaScript Deep Dive',
        'issue_date': '2025-07-26',
        'credential_url': 'https://scrimba.com/javascript-deep-dive-c0a',
        'order': 3
    },
    {
        'entity': 'Scrimba',
        'course': 'Fullstack Developer Path',
        'issue_date': '2025-12-29',
        'credential_url': 'https://scrimba.com/fullstack-path-c0fullstack',
        'order': 2
    },
    {
        'entity': 'Scrimba',
        'course': 'Data Structures and Algorithms',
        'issue_date': '2026-01-08',
        'credential_url': 'https://scrimba.com/data-structures-and-algorithms-c0shn6ckdm',
        'order': 1
    }
]

print("Adding certificates to production database...")

for cert in certificates:
    try:
        response = requests.post(f"{API_URL}/resume/certificates", json=cert, timeout=30)
        if response.status_code == 201:
            print(f"✓ Added: {cert['course']}")
        else:
            print(f"✗ Failed: {cert['course']} - {response.json()}")
    except Exception as e:
        print(f"✗ Error adding {cert['course']}: {str(e)}")

print("\nDone - check your site at https://rosecitydev.tech")
