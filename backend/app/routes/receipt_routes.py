import random
from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.receipt import Receipt

receipt_bp = Blueprint('receipts', __name__, url_prefix='/api/receipts')

def generate_receipt_no():
    # Generates a 5-digit formatted receipt number like '04698'
    last_receipt = Receipt.query.order_by(Receipt.id.desc()).first()
    if last_receipt and last_receipt.receipt_no.isdigit():
        next_num = int(last_receipt.receipt_no) + 1
    else:
        next_num = 4698
    return f"{next_num:05d}"

@receipt_bp.route('', methods=['GET'])
def get_receipts():
    search = request.args.get('search', '').strip()
    from_date = request.args.get('from_date', '').strip()
    to_date = request.args.get('to_date', '').strip()

    query = Receipt.query

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Receipt.customer_name.ilike(search_filter)) |
            (Receipt.receipt_no.ilike(search_filter)) |
            (Receipt.account_code.ilike(search_filter)) |
            (Receipt.payment_type.ilike(search_filter)) |
            (Receipt.note.ilike(search_filter))
        )

    if from_date:
        query = query.filter(Receipt.receipt_date >= from_date)
    if to_date:
        query = query.filter(Receipt.receipt_date <= to_date)

    receipts = query.order_by(Receipt.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [r.to_dict() for r in receipts],
        'total': len(receipts)
    }), 200

@receipt_bp.route('/<int:receipt_id>', methods=['GET'])
def get_receipt(receipt_id):
    receipt = Receipt.query.get_or_404(receipt_id)
    return jsonify({
        'success': True,
        'data': receipt.to_dict()
    }), 200

@receipt_bp.route('', methods=['POST'])
def create_receipt():
    data = request.get_json() or {}
    customer_name = data.get('customer_name', '').strip()
    amount = data.get('amount')
    payment_type = data.get('payment_type', 'CASH').strip()
    receipt_date = data.get('receipt_date', '12-08-2026').strip()
    account_code = data.get('account_code', '').strip()
    note = data.get('note', '').strip()

    if not customer_name:
        return jsonify({'success': False, 'message': 'Customer Name is required'}), 400

    try:
        amount_val = float(amount) if amount is not None else 0.0
    except (ValueError, TypeError):
        return jsonify({'success': False, 'message': 'Invalid amount value'}), 400

    receipt_no = data.get('receipt_no') or generate_receipt_no()

    receipt = Receipt(
        receipt_no=receipt_no,
        account_code=account_code,
        customer_name=customer_name,
        receipt_date=receipt_date,
        amount=amount_val,
        payment_type=payment_type,
        note=note,
        status='active'
    )

    db.session.add(receipt)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': receipt.to_dict(),
        'message': 'Receipt created successfully'
    }), 201

@receipt_bp.route('/<int:receipt_id>', methods=['DELETE'])
def delete_receipt(receipt_id):
    receipt = Receipt.query.get_or_404(receipt_id)
    db.session.delete(receipt)
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Receipt deleted successfully'
    }), 200
