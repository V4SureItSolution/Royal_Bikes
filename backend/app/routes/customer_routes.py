from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config import db
from app.models.customer import Customer

customer_bp = Blueprint('customers', __name__, url_prefix='/api/customers')

@customer_bp.route('', methods=['GET'])
@jwt_required()
def get_customers():
    search = request.args.get('search')
    status = request.args.get('status')

    query = Customer.query
    if status:
        query = query.filter_by(status=status)
    if search:
        query = query.filter(
            (Customer.name.ilike(f"%{search}%")) |
            (Customer.email.ilike(f"%{search}%")) |
            (Customer.phone.ilike(f"%{search}%"))
        )

    customers = query.order_by(Customer.created_at.desc()).all()
    return jsonify({'success': True, 'data': [c.to_dict() for c in customers], 'message': 'Customers fetched successfully'}), 200


@customer_bp.route('/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'success': False, 'message': 'Customer not found'}), 404
    return jsonify({'success': True, 'data': customer.to_dict(), 'message': 'Customer details fetched'}), 200


@customer_bp.route('', methods=['POST'])
@jwt_required()
def create_customer():
    data = request.get_json() or {}
    if not data.get('name') or not data.get('phone'):
        return jsonify({'success': False, 'message': 'Name and phone are required'}), 400

    email = data.get('email', '').strip() or None
    if email and Customer.query.filter_by(email=email).first():
        return jsonify({'success': False, 'message': 'Customer with this email already exists'}), 400

    customer = Customer(
        name=data.get('name', '').strip(),
        email=email,
        phone=data.get('phone', '').strip(),
        address=data.get('address', '').strip(),
        notes=data.get('notes', '').strip(),
        status=data.get('status', 'active')
    )
    db.session.add(customer)
    db.session.commit()

    return jsonify({'success': True, 'data': customer.to_dict(), 'message': 'Customer created successfully'}), 201


@customer_bp.route('/<int:customer_id>', methods=['PUT'])
@jwt_required()
def update_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'success': False, 'message': 'Customer not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        customer.name = data['name'].strip()
    if 'email' in data:
        customer.email = data['email'].strip() or None
    if 'phone' in data:
        customer.phone = data['phone'].strip()
    if 'address' in data:
        customer.address = data['address'].strip()
    if 'notes' in data:
        customer.notes = data['notes'].strip()
    if 'status' in data:
        customer.status = data['status']

    db.session.commit()
    return jsonify({'success': True, 'data': customer.to_dict(), 'message': 'Customer updated successfully'}), 200


@customer_bp.route('/<int:customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'success': False, 'message': 'Customer not found'}), 404

    db.session.delete(customer)
    db.session.commit()
    return jsonify({'success': True, 'data': None, 'message': 'Customer deleted successfully'}), 200
