from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.rtn_payment import RtnPayment

rtn_payment_bp = Blueprint('rtn_payments', __name__, url_prefix='/api/rtn-payments')

def generate_voucher_no():
    # Generates a 5-digit formatted voucher number like '05102'
    last_rtn = RtnPayment.query.order_by(RtnPayment.id.desc()).first()
    if last_rtn and last_rtn.voucher_no.isdigit():
        next_num = int(last_rtn.voucher_no) + 1
    else:
        next_num = 5102
    return f"{next_num:05d}"

@rtn_payment_bp.route('', methods=['GET'])
def get_rtn_payments():
    search = request.args.get('search', '').strip()
    from_date = request.args.get('from_date', '').strip()
    to_date = request.args.get('to_date', '').strip()

    query = RtnPayment.query

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (RtnPayment.customer_name.ilike(search_filter)) |
            (RtnPayment.voucher_no.ilike(search_filter)) |
            (RtnPayment.account_code.ilike(search_filter)) |
            (RtnPayment.payment_type.ilike(search_filter)) |
            (RtnPayment.note.ilike(search_filter))
        )

    if from_date:
        query = query.filter(RtnPayment.rtn_date >= from_date)
    if to_date:
        query = query.filter(RtnPayment.rtn_date <= to_date)

    rtn_list = query.order_by(RtnPayment.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [r.to_dict() for r in rtn_list],
        'total': len(rtn_list)
    }), 200

@rtn_payment_bp.route('/<int:rtn_id>', methods=['GET'])
def get_rtn_payment(rtn_id):
    rtn = RtnPayment.query.get_or_404(rtn_id)
    return jsonify({
        'success': True,
        'data': rtn.to_dict()
    }), 200

@rtn_payment_bp.route('', methods=['POST'])
def create_rtn_payment():
    data = request.get_json() or {}
    customer_name = data.get('customer_name', '').strip()
    amount = data.get('amount')
    payment_type = data.get('payment_type', 'CASH').strip()
    rtn_date = data.get('rtn_date', '12-08-2026').strip()
    account_code = data.get('account_code', '').strip()
    note = data.get('note', '').strip()

    if not customer_name:
        return jsonify({'success': False, 'message': 'Customer Name is required'}), 400

    try:
        amount_val = float(amount) if amount is not None else 0.0
    except (ValueError, TypeError):
        return jsonify({'success': False, 'message': 'Invalid amount value'}), 400

    voucher_no = data.get('voucher_no') or generate_voucher_no()

    rtn = RtnPayment(
        voucher_no=voucher_no,
        account_code=account_code,
        customer_name=customer_name,
        rtn_date=rtn_date,
        amount=amount_val,
        payment_type=payment_type,
        note=note,
        status='active'
    )

    db.session.add(rtn)
    db.session.commit()

    return jsonify({
        'success': True,
        'data': rtn.to_dict(),
        'message': 'RTN Payment entry created successfully'
    }), 201

@rtn_payment_bp.route('/<int:rtn_id>', methods=['DELETE'])
def delete_rtn_payment(rtn_id):
    rtn = RtnPayment.query.get_or_404(rtn_id)
    db.session.delete(rtn)
    db.session.commit()
    return jsonify({
        'success': True,
        'message': 'RTN Payment entry deleted successfully'
    }), 200
