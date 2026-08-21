import unittest
from app import create_app
from config import db

class TestAuth(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register_and_login(self):
        # Register User
        reg_resp = self.client.post('/api/auth/register', json={
            'username': 'testrider',
            'email': 'rider@royalbikes.com',
            'password': 'password123',
            'role': 'staff'
        })
        self.assertEqual(reg_resp.status_code, 201)
        self.assertTrue(reg_resp.json['success'])

        # Login User
        login_resp = self.client.post('/api/auth/login', json={
            'username': 'testrider',
            'password': 'password123'
        })
        self.assertEqual(login_resp.status_code, 200)
        self.assertIn('access_token', login_resp.json['data'])

if __name__ == '__main__':
    unittest.main()
