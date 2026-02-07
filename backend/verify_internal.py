import unittest
from app import create_app, db
from models import File, User, DeletedFile, FileMovement
from datetime import datetime

class TestFileTracking(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Use in-memory DB for speed/isolation
        self.client = self.app.test_client()
        
        with self.app.app_context():
            db.create_all()
            # Create dummy user
            user = User(username='test_user', password_hash='hash', role='secretary')
            db.session.add(user)
            db.session.commit()
            self.user_id = user.id

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_analytics_with_filter(self):
        with self.app.app_context():
            # Add files with different categories
            f1 = File(source='Hand', category='Plumbing', status='Pending', created_at=datetime.utcnow())
            f2 = File(source='Hand', category='Electrical', status='Pending', created_at=datetime.utcnow())
            db.session.add(f1)
            db.session.add(f2)
            db.session.commit()
        
        # 1. Test All Categories (Default)
        res = self.client.get('/api/files/analytics')
        self.assertEqual(res.status_code, 200)
        data = res.json
        self.assertIn('available_categories', data)
        self.assertIn('Plumbing', data['available_categories'])
        self.assertIn('Electrical', data['available_categories'])
        # Day count should be 2
        day_data = data['day']
        if day_data:
            self.assertEqual(day_data[0]['count'], 2)

        # 2. Test Filter 'Plumbing'
        res = self.client.get('/api/files/analytics?category=Plumbing')
        self.assertEqual(res.status_code, 200)
        data = res.json
        # Day count should be 1
        day_data = data['day']
        if day_data:
            self.assertEqual(day_data[0]['count'], 1)

    def test_deletion_constraint(self):
        with self.app.app_context():
            f1 = File(source='Hand', grievance_summary='To delete', category='Other')
            db.session.add(f1)
            db.session.commit()
            fid = f1.id

        # 1. No reason
        res = self.client.delete(f'/api/files/{fid}', json={})
        self.assertEqual(res.status_code, 400) # Should fail

        # 2. With reason
        res = self.client.delete(f'/api/files/{fid}', json={'reason': 'Test Reason'})
        self.assertEqual(res.status_code, 200)

        # 3. Check DeletedFile
        with self.app.app_context():
            deleted = DeletedFile.query.filter_by(original_file_id=fid).first()
            self.assertIsNotNone(deleted)
            self.assertEqual(deleted.deletion_reason, 'Test Reason')
            # Check File is gone
            f = File.query.get(fid)
            self.assertIsNone(f)

    def test_completion_constraint(self):
        with self.app.app_context():
            f1 = File(source='Hand', grievance_summary='To complete', status='Pending')
            db.session.add(f1)
            db.session.commit()
            fid = f1.id

        # 1. No remarks
        res = self.client.post(f'/api/files/{fid}/complete', json={'user_id': self.user_id, 'outcome': 'Done', 'remarks': ''})
        self.assertEqual(res.status_code, 400)

        # 2. With remarks
        res = self.client.post(f'/api/files/{fid}/complete', json={'user_id': self.user_id, 'outcome': 'Done', 'remarks': 'Done well'})
        self.assertEqual(res.status_code, 200)
        
        with self.app.app_context():
            f = File.query.get(fid)
            self.assertEqual(f.status, 'Completed')

if __name__ == '__main__':
    unittest.main()
