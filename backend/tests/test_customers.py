import unittest
from app import create_app
from config import db

class TestCustomers(unittest.TestCase):
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

    def test_customers_requires_auth(self):
        resp = self.client.get('/api/customers')
        self.assertEqual(resp.status_code, 401)

if __name__ == '__main__':
    unittest.main()
