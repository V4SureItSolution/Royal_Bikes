import os
import sys

# Ensure backend root directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from flask import Flask, jsonify
from config import Config
from app.extensions import db, jwt, bcrypt, cors, migrate
from app.routes.auth_routes import auth_bp
from app.routes.user_routes import user_bp
from app.routes.product_routes import product_bp
from app.routes.customer_routes import customer_bp
from app.routes.receipt_routes import receipt_bp
from app.routes.voucher_routes import voucher_bp
from app.routes.rtn_payment_routes import rtn_payment_bp
from app.routes.delivery_challan_routes import delivery_challan_bp
from app.routes.report_routes import report_bp

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(Config)

    if config_name == 'testing':
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['JWT_SECRET_KEY'] = 'test-jwt-secret-key'

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
    app.register_blueprint(receipt_bp)
    app.register_blueprint(voucher_bp)
    app.register_blueprint(rtn_payment_bp)
    app.register_blueprint(delivery_challan_bp)
    app.register_blueprint(report_bp)

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

    # Seed Sample Receipt
    from app.models.receipt import Receipt
    if Receipt.query.count() == 0:
        sample_receipt = Receipt(
            receipt_no='04698',
            account_code='2917',
            customer_name='KEERTHANA',
            receipt_date='12-08-2026',
            amount=4000.0,
            payment_type='CASH',
            note='-',
            status='active'
        )
        db.session.add(sample_receipt)

    # Seed Sample Voucher Entry (matching screenshot)
    from app.models.voucher import Voucher
    if Voucher.query.count() == 0:
        sample_voucher = Voucher(
            voucher_no='04889',
            account_code='2852',
            customer_name='VP GI BOOMIKA',
            voucher_date='12-08-2026',
            amount=5741.0,
            payment_type='CASH',
            note='-',
            status='active'
        )
        db.session.add(sample_voucher)

    # Seed Sample RTN Payment Entry
    from app.models.rtn_payment import RtnPayment
    if RtnPayment.query.count() == 0:
        sample_rtn = RtnPayment(
            voucher_no='05102',
            account_code='3104',
            customer_name='SURESH KUMAR',
            rtn_date='12-08-2026',
            amount=2500.0,
            payment_type='CASH',
            note='-',
            status='active'
        )
        db.session.add(sample_rtn)

    # Seed Sample Delivery Challan
    from app.models.delivery_challan import DeliveryChallan
    if DeliveryChallan.query.count() == 0:
        sample_dc = DeliveryChallan(
            dc_number='DC-2026-001',
            order_date='12-08-2026',
            expected_shipment_date='12-08-2026',
            sales_type='GST',
            reference_no='REF-98120',
            customer_name='BALAJI PANNER SELVAM',
            customer_phone='9941220484',
            customer_address='CHENNAI',
            product_name='Royal Enfield Classic 350',
            quantity=1,
            engine_number='ENG-350-7712',
            chassis_number='CHS-RE-9941',
            color='Stealth Black',
            delivery_terms='Immediate delivery on payment confirmation.',
            notes='Sample Delivery Challan record.',
            status='Delivered'
        )
        db.session.add(sample_dc)

    db.session.commit()
