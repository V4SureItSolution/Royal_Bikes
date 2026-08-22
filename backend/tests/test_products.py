import unittest
from app import create_app
from app.extensions import db

class TestProducts(unittest.TestCase):
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

    def test_get_products(self):
        resp = self.client.get('/api/products')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue(resp.json['success'])
        self.assertIsInstance(resp.json['data'], list)

if __name__ == '__main__':
    unittest.main()
