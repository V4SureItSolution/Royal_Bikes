import os
import sys

# Ensure backend root directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from flask import Flask, jsonify
from config import config, db, jwt, bcrypt, cors, migrate
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.product_routes import product_bp
from app.routes.customer_routes import customer_bp

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config.get(config_name, config['default']))

    # Initialize Flask Extensions from root config
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(customer_bp)

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'success': False, 'message': 'API endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Internal server error'}), 500

    # Index Healthcheck
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'online',
            'app': 'RoyalBikes API',
            'version': '1.0.0'
        }), 200

    # Auto DB table initialization & seed data
    with app.app_context():
        db.create_all()
        seed_database()

    return app


def seed_database():
    from app.models.user import User
    from app.models.product import Product
    from app.models.customer import Customer

    # Seed Admin User
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', email='admin@royalbikes.com', role='admin')
        admin.set_password('Admin@123')
        db.session.add(admin)

    # Seed Default Royal Bikes Sample Catalog
    if Product.query.count() == 0:
        sample_bikes = [
            Product(
                name='Royal Enfield Classic 350',
                brand='Royal Enfield',
                category='Cruiser',
                price=193000.0,
                stock=12,
                description='Iconic retro cruiser with J-series 349cc engine and twin downbone frame.',
                image_url='https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
                is_available=True
            ),
            Product(
                name='Royal Enfield Hunter 350',
                brand='Royal Enfield',
                category='Roadster',
                price=149900.0,
                stock=8,
                description='Agile, compact roadster styled for modern urban street riding.',
                image_url='https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
                is_available=True
            ),
            Product(
                name='Royal Enfield Meteor 350',
                brand='Royal Enfield',
                category='Cruiser',
                price=205000.0,
                stock=15,
                description='Easy cruiser with Tripper navigation, relaxed posture, and highway power.',
                image_url='https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=800&q=80',
                is_available=True
            )
        ]
        db.session.bulk_save_objects(sample_bikes)

    # Seed Sample Customers
    if Customer.query.count() == 0:
        sample_customers = [
            Customer(
                name='Rajesh Kumar',
                email='rajesh.k@example.com',
                phone='+91 9876543210',
                address='102 Anna Salai, Chennai, TN',
                notes='Interested in Classic 350 Dark Stealth Black test drive.',
                status='lead'
            )
        ]
        db.session.bulk_save_objects(sample_customers)

    db.session.commit()
