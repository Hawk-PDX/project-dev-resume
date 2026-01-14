from app import create_app, db
from app.models import Certificate
from datetime import datetime

def seed_certificates():
    app = create_app()
    
    with app.app_context():
        certificates_data = [
            {
                'entity': 'Scrimba',
                'course': 'Learn React',
                'issue_date': '2025-07-26',
                'credential_url': 'https://scrimba.com/learn-react-c0e',
                'photo_url': '/Learn_React_Cert.png',
                'order': 5
            },
            {
                'entity': 'Scrimba',
                'course': 'Advanced React',
                'issue_date': '2025-10-13',
                'credential_url': 'https://scrimba.com/advanced-react-c02h',
                'photo_url': '/Advanced_React_Cert.png',
                'order': 4
            },
            {
                'entity': 'Scrimba',
                'course': 'JavaScript Deep Dive',
                'issue_date': '2025-07-26',
                'credential_url': 'https://scrimba.com/javascript-deep-dive-c0a',
                'photo_url': '/JS_Deep_Dive_Cert.png',
                'order': 3
            },
            {
                'entity': 'Scrimba',
                'course': 'Fullstack Developer Path',
                'issue_date': '2025-12-29',
                'credential_url': 'https://scrimba.com/fullstack-path-c0fullstack',
                'photo_url': '/Fullstack_Path_Cert.png',
                'order': 2
            },
            {
                'entity': 'Scrimba',
                'course': 'Data Structures and Algorithms',
                'issue_date': '2026-01-08',
                'credential_url': 'https://scrimba.com/data-structures-and-algorithms-c0shn6ckdm',
                'photo_url': '/DSA_Cert.png',
                'order': 1
            }
        ]
        
        print("Adding certificates to database...")
        
        existing_count = Certificate.query.count()
        if existing_count > 0:
            print(f"Found {existing_count} existing certificates")
            response = input("Clear and re-add? (yes/no): ")
            if response.lower() == 'yes':
                Certificate.query.delete()
                db.session.commit()
                print("Cleared existing certificates")
        
        added_count = 0
        for cert_data in certificates_data:
            existing = Certificate.query.filter_by(
                entity=cert_data['entity'],
                course=cert_data['course']
            ).first()
            
            if not existing:
                issue_date = datetime.strptime(cert_data['issue_date'], '%Y-%m-%d').date()
                
                certificate = Certificate(
                    entity=cert_data['entity'],
                    course=cert_data['course'],
                    issue_date=issue_date,
                    credential_url=cert_data['credential_url'],
                    photo_url=cert_data['photo_url'],
                    order=cert_data['order']
                )
                
                db.session.add(certificate)
                added_count += 1
                print(f"Added: {cert_data['course']}")
            else:
                print(f"Skipped: {cert_data['course']} (already exists)")
        
        db.session.commit()
        
        print(f"\nDone - added {added_count} certificates")
        print(f"Total in database: {Certificate.query.count()}")

if __name__ == '__main__':
    seed_certificates()
