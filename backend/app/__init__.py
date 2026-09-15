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
from app.routes.booking_order_routes import booking_order_bp
from app.routes.report_routes import report_bp
from app.routes.direct_stock_routes import direct_stock_bp
from app.routes.vendor_routes import vendor_bp

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
    app.register_blueprint(booking_order_bp)
    app.register_blueprint(report_bp)
    app.register_blueprint(direct_stock_bp)
    app.register_blueprint(vendor_bp)

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
    from app.models.vendor import Vendor

    # Seed Admin User
    if not User.query.filter_by(username='admin').first():
        admin = User(username='admin', email='admin@royalbikes.com', role='admin')
        admin.set_password('Admin@123')
        db.session.add(admin)
        db.session.commit()

    # Seed Initial Vendors if table is empty or missing defaults
    default_vendors = [
        {
            'vendor_code': 'VEND-0001',
            'display_name': 'ROYAL ENFIELD DISTRIBUTORS',
            'contact_no': '9840112233',
            'email': 'contact@royalenfielddist.com',
            'gst': '33AABCR1234F1Z5',
            'status': 'Active',
            'payment_terms': 'Net 30',
            'website': 'https://royalenfield.com',
            'billing_address': 'No 45, Anna Salai, Guindy, Chennai - 600032',
            'shipping_address': 'No 45, Anna Salai, Guindy, Chennai - 600032',
            'bank_name': 'HDFC Bank',
            'account_number': '50200012345678',
            'ifsc_code': 'HDFC0001234',
            'branch': 'Guindy Chennai',
            'account_holder': 'Royal Enfield Distributors Ltd'
        },
        {
            'vendor_code': 'VEND-0002',
            'display_name': 'HARDEEP HONDA',
            'contact_no': '9841234567',
            'email': 'sales@hardeephonda.com',
            'gst': '33AAACH5678B1Z2',
            'status': 'Active',
            'payment_terms': 'Net 15',
            'website': 'https://hardeephonda.in',
            'billing_address': '12 Mount Road, Thousand Lights, Chennai - 600006',
            'shipping_address': '12 Mount Road, Thousand Lights, Chennai - 600006',
            'bank_name': 'State Bank of India',
            'account_number': '30012345678',
            'ifsc_code': 'SBIN0000842',
            'branch': 'Mount Road',
            'account_holder': 'Hardeep Honda Agencies'
        },
        {
            'vendor_code': 'VEND-0003',
            'display_name': 'HERO MOTOCORP DEALERS',
            'contact_no': '9940123890',
            'email': 'info@herodealers.com',
            'gst': '33AAACH9988G1Z9',
            'status': 'Active',
            'payment_terms': 'Immediate',
            'website': 'https://heromotocorp.com',
            'billing_address': '89 GST Road, Tambaram, Chennai - 600045',
            'shipping_address': '89 GST Road, Tambaram, Chennai - 600045',
            'bank_name': 'ICICI Bank',
            'account_number': '001205001234',
            'ifsc_code': 'ICIC0000012',
            'branch': 'Tambaram',
            'account_holder': 'Hero MotoCorp Chennai Hub'
        },
        {
            'vendor_code': 'VEND-0004',
            'display_name': 'SRI MOTORS',
            'contact_no': '9884567890',
            'email': 'contact@srimotors.com',
            'gst': '33AABCS8899K1Z4',
            'status': 'Active',
            'payment_terms': 'Net 30',
            'website': 'https://srimotors.in',
            'billing_address': '104 Jawaharlal Nehru Road, Vadapalani, Chennai - 600026',
            'shipping_address': '104 Jawaharlal Nehru Road, Vadapalani, Chennai - 600026',
            'bank_name': 'Axis Bank',
            'account_number': '918020033445566',
            'ifsc_code': 'UTIB0000456',
            'branch': 'Vadapalani',
            'account_holder': 'Sri Motors Private Limited'
        },
        {
            'vendor_code': 'VEND-0005',
            'display_name': 'MADRAS MOTORS',
            'contact_no': '9790112345',
            'email': 'sales@madrasmotors.com',
            'gst': '33AABCM4433P1Z1',
            'status': 'Active',
            'payment_terms': 'Net 45',
            'website': 'https://madrasmotors.com',
            'billing_address': '78 Poonamallee High Road, Kilpauk, Chennai - 600010',
            'shipping_address': '78 Poonamallee High Road, Kilpauk, Chennai - 600010',
            'bank_name': 'Kotak Mahindra Bank',
            'account_number': '4455667788',
            'ifsc_code': 'KKBK0000678',
            'branch': 'Kilpauk',
            'account_holder': 'Madras Motors Dist'
        },
        {
            'vendor_code': 'VEND-0006',
            'display_name': 'RNS MOTORS',
            'contact_no': '9840998877',
            'email': 'support@rnsmotors.com',
            'gst': '33AABCR7766R1Z8',
            'status': 'Active',
            'payment_terms': 'Net 15',
            'website': 'https://rnsmotors.in',
            'billing_address': '22 Velachery Bypass Rd, Velachery, Chennai - 600042',
            'shipping_address': '22 Velachery Bypass Rd, Velachery, Chennai - 600042',
            'bank_name': 'Indian Overseas Bank',
            'account_number': '012302000012345',
            'ifsc_code': 'IOBA0000123',
            'branch': 'Velachery',
            'account_holder': 'RNS Motors'
        }
    ]

    for v_data in default_vendors:
        if not Vendor.query.filter_by(display_name=v_data['display_name']).first():
            new_v = Vendor(**v_data)
            db.session.add(new_v)
    
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()
