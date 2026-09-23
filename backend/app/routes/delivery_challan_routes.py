from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.delivery_challan import DeliveryChallan

delivery_challan_bp = Blueprint('delivery_challans', __name__, url_prefix='/api/delivery-challans')

def generate_dc_number():
    # Generates a DC number like 'DC-2026-001' or '05230'
    last_dc = DeliveryChallan.query.order_by(DeliveryChallan.id.desc()).first()
    if last_dc and last_dc.dc_number.startswith('DC-'):
        try:
            num = int(last_dc.dc_number.split('-')[-1]) + 1
            return f"DC-2026-{num:03d}"
        except ValueError:
            pass
    return "DC-2026-001"

@delivery_challan_bp.route('', methods=['GET'])
def get_delivery_challans():
    search = request.args.get('search', '').strip()
    from_date = request.args.get('from_date', '').strip()
    to_date = request.args.get('to_date', '').strip()

    query = DeliveryChallan.query

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (DeliveryChallan.customer_name.ilike(search_filter)) |
            (DeliveryChallan.dc_number.ilike(search_filter)) |
            (DeliveryChallan.product_name.ilike(search_filter)) |
            (DeliveryChallan.engine_number.ilike(search_filter)) |
            (DeliveryChallan.chassis_number.ilike(search_filter)) |
            (DeliveryChallan.status.ilike(search_filter))
        )

    if from_date:
        query = query.filter(DeliveryChallan.order_date >= from_date)
    if to_date:
        query = query.filter(DeliveryChallan.order_date <= to_date)

    challans = query.order_by(DeliveryChallan.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [dc.to_dict() for dc in challans],
        'total': len(challans)
    }), 200

@delivery_challan_bp.route('/<int:dc_id>', methods=['GET'])
def get_delivery_challan(dc_id):
    dc = DeliveryChallan.query.get_or_404(dc_id)
    return jsonify({
        'success': True,
        'data': dc.to_dict()
    }), 200

@delivery_challan_bp.route('', methods=['POST'])
def create_delivery_challan():
    data = request.get_json() or {}
    customer_name = data.get('customer_name', '').strip()

    if not customer_name:
        return jsonify({'success': False, 'message': 'Customer Name is required'}), 400

    dc_number = data.get('dc_number') or generate_dc_number()

    dc = DeliveryChallan(
        dc_number=dc_number,
        order_date=data.get('order_date', '12-08-2026').strip(),
        expected_shipment_date=data.get('expected_shipment_date', '12-08-2026').strip(),
        sales_type=data.get('sales_type', 'GST').strip(),
        reference_no=data.get('reference_no', '').strip(),
        customer_name=customer_name,
        customer_phone=data.get('customer_phone', '').strip(),
        customer_address=data.get('customer_address', '').strip(),
        product_name=data.get('product_name', 'Royal Enfield Classic 350').strip(),
        quantity=int(data.get('quantity', 1)),
        engine_number=data.get('engine_number', '').strip(),
        chassis_number=data.get('chassis_number', '').strip(),
        color=data.get('color', '').strip(),
        delivery_terms=data.get('delivery_terms', '').strip(),
        notes=data.get('notes', '').strip(),
        status=data.get('status', 'Delivered').strip()
    )

    db.session.add(dc)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': dc.to_dict(),
        'message': 'Delivery Challan created successfully'
    }), 201

@delivery_challan_bp.route('/<int:dc_id>', methods=['DELETE'])
def delete_delivery_challan(dc_id):
    dc = DeliveryChallan.query.get_or_404(dc_id)
    db.session.delete(dc)
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Delivery Challan deleted successfully'
    }), 200
