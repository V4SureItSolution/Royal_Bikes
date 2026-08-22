from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.voucher import Voucher

voucher_bp = Blueprint('vouchers', __name__, url_prefix='/api/vouchers')

def generate_voucher_no():
    # Generates a 5-digit formatted voucher number like '04889'
    last_voucher = Voucher.query.order_by(Voucher.id.desc()).first()
    if last_voucher and last_voucher.voucher_no.isdigit():
        next_num = int(last_voucher.voucher_no) + 1
    else:
        next_num = 4889
    return f"{next_num:05d}"

@voucher_bp.route('', methods=['GET'])
def get_vouchers():
    search = request.args.get('search', '').strip()
    from_date = request.args.get('from_date', '').strip()
    to_date = request.args.get('to_date', '').strip()

    query = Voucher.query

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Voucher.customer_name.ilike(search_filter)) |
            (Voucher.voucher_no.ilike(search_filter)) |
            (Voucher.account_code.ilike(search_filter)) |
            (Voucher.payment_type.ilike(search_filter)) |
            (Voucher.note.ilike(search_filter))
        )

    if from_date:
        query = query.filter(Voucher.voucher_date >= from_date)
    if to_date:
        query = query.filter(Voucher.voucher_date <= to_date)

    vouchers = query.order_by(Voucher.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [v.to_dict() for v in vouchers],
        'total': len(vouchers)
    }), 200

@voucher_bp.route('/<int:voucher_id>', methods=['GET'])
def get_voucher(voucher_id):
    voucher = Voucher.query.get_or_404(voucher_id)
    return jsonify({
        'success': True,
        'data': voucher.to_dict()
    }), 200

@voucher_bp.route('', methods=['POST'])
def create_voucher():
    data = request.get_json() or {}
    customer_name = data.get('customer_name', '').strip()
    amount = data.get('amount')
    payment_type = data.get('payment_type', 'CASH').strip()
    voucher_date = data.get('voucher_date', '12-08-2026').strip()
    account_code = data.get('account_code', '').strip()
    note = data.get('note', '').strip()

    if not customer_name:
        return jsonify({'success': False, 'message': 'Customer Name is required'}), 400

    try:
        amount_val = float(amount) if amount is not None else 0.0
    except (ValueError, TypeError):
        return jsonify({'success': False, 'message': 'Invalid amount value'}), 400

    voucher_no = data.get('voucher_no') or generate_voucher_no()

    voucher = Voucher(
        voucher_no=voucher_no,
        account_code=account_code,
        customer_name=customer_name,
        voucher_date=voucher_date,
        amount=amount_val,
        payment_type=payment_type,
        note=note,
        status='active'
    )

    db.session.add(voucher)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': voucher.to_dict(),
        'message': 'Voucher created successfully'
    }), 201

@voucher_bp.route('/<int:voucher_id>', methods=['DELETE'])
def delete_voucher(voucher_id):
    voucher = Voucher.query.get_or_404(voucher_id)
    db.session.delete(voucher)
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'Voucher deleted successfully'
    }), 200
