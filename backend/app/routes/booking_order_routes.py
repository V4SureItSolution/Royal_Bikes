from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.booking_order import BookingOrder
import random

booking_order_bp = Blueprint('booking_orders', __name__, url_prefix='/api/booking-orders')

@booking_order_bp.route('', methods=['GET'])
def get_all_booking_orders():
    try:
        search = request.args.get('search', '').strip()
        query = BookingOrder.query

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                (BookingOrder.booking_no.ilike(search_term)) |
                (BookingOrder.customer_name.ilike(search_term)) |
                (BookingOrder.contact_number.ilike(search_term)) |
                (BookingOrder.model_name.ilike(search_term)) |
                (BookingOrder.town_city.ilike(search_term))
            )

        orders = query.order_by(BookingOrder.id.desc()).all()
        return jsonify({
            'success': True,
            'count': len(orders),
            'data': [o.to_dict() for o in orders]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@booking_order_bp.route('/<int:id>', methods=['GET'])
def get_booking_order(id):
    try:
        order = BookingOrder.query.get_or_404(id)
        return jsonify({
            'success': True,
            'data': order.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 404

@booking_order_bp.route('', methods=['POST'])
def create_booking_order():
    try:
        data = request.get_json() or {}
        
        customer_name = data.get('customer_name')
        contact_number = data.get('contact_number')
        model_name = data.get('model_name') or 'Royal Enfield Classic 350'

        if not customer_name:
            return jsonify({'success': False, 'message': 'Customer Name is required'}), 400
        if not contact_number:
            return jsonify({'success': False, 'message': 'Contact Number is required'}), 400

        # Auto-generate Booking No if not given
        booking_no = data.get('booking_no')
        if not booking_no:
            count = BookingOrder.query.count() + 1
            rand_suffix = random.randint(100, 999)
            booking_no = f"BK-2026-{count:03d}"

        total_amount = float(data.get('total_amount') or 0.0)
        booking_amount = float(data.get('booking_amount') or 0.0)
        balance_amount = float(data.get('balance_amount') or max(0.0, total_amount - booking_amount))

        new_order = BookingOrder(
            booking_no=booking_no,
            booking_date=data.get('booking_date', '12-08-2026'),
            customer_name=customer_name.strip(),
            father_or_spouse_name=data.get('father_or_spouse_name', '').strip(),
            contact_number=contact_number.strip(),
            alt_contact_number=data.get('alt_contact_number', '').strip(),
            flat_house_no=data.get('flat_house_no', '').strip(),
            street_area=data.get('street_area', '').strip(),
            town_city=data.get('town_city', '').strip(),
            pincode=data.get('pincode', '').strip(),
            state=data.get('state', 'TAMIL NADU'),
            model_name=model_name.strip(),
            color=data.get('color', '').strip(),
            variant=data.get('variant', '').strip(),
            expected_delivery_date=data.get('expected_delivery_date', ''),
            total_amount=total_amount,
            booking_amount=booking_amount,
            balance_amount=balance_amount,
            payment_mode=data.get('payment_mode', 'CASH'),
            sales_executive=data.get('sales_executive', ''),
            notes=data.get('notes', ''),
            status=data.get('status', 'Confirmed')
        )

        db.session.add(new_order)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Booking Order registered successfully!',
            'data': new_order.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@booking_order_bp.route('/<int:id>', methods=['PUT'])
def update_booking_order(id):
    try:
        order = BookingOrder.query.get_or_404(id)
        data = request.get_json() or {}

        if 'customer_name' in data:
            order.customer_name = data['customer_name']
        if 'father_or_spouse_name' in data:
            order.father_or_spouse_name = data['father_or_spouse_name']
        if 'contact_number' in data:
            order.contact_number = data['contact_number']
        if 'alt_contact_number' in data:
            order.alt_contact_number = data['alt_contact_number']
        if 'flat_house_no' in data:
            order.flat_house_no = data['flat_house_no']
        if 'street_area' in data:
            order.street_area = data['street_area']
        if 'town_city' in data:
            order.town_city = data['town_city']
        if 'pincode' in data:
            order.pincode = data['pincode']
        if 'state' in data:
            order.state = data['state']
        if 'model_name' in data:
            order.model_name = data['model_name']
        if 'color' in data:
            order.color = data['color']
        if 'variant' in data:
            order.variant = data['variant']
        if 'expected_delivery_date' in data:
            order.expected_delivery_date = data['expected_delivery_date']
        if 'total_amount' in data:
            order.total_amount = float(data['total_amount'])
        if 'booking_amount' in data:
            order.booking_amount = float(data['booking_amount'])
        if 'balance_amount' in data:
            order.balance_amount = float(data['balance_amount'])
        if 'payment_mode' in data:
            order.payment_mode = data['payment_mode']
        if 'sales_executive' in data:
            order.sales_executive = data['sales_executive']
        if 'notes' in data:
            order.notes = data['notes']
        if 'status' in data:
            order.status = data['status']

        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Booking Order updated successfully!',
            'data': order.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@booking_order_bp.route('/<int:id>', methods=['DELETE'])
def delete_booking_order(id):
    try:
        order = BookingOrder.query.get_or_404(id)
        db.session.delete(order)
        db.session.commit()
        return jsonify({
            'success': True,
            'message': f'Booking Order #{order.booking_no} deleted successfully!'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
