import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.vendor import Vendor

vendor_bp = Blueprint('vendors', __name__, url_prefix='/api/vendors')

@vendor_bp.route('', methods=['GET'])
@jwt_required(optional=True)
def get_vendors():
    search = request.args.get('search', '').strip()
    status = request.args.get('status', '').strip()

    query = Vendor.query
    if status and status != 'ALL':
        query = query.filter_by(status=status)
    if search:
        query = query.filter(
            (Vendor.display_name.ilike(f"%{search}%")) |
            (Vendor.vendor_code.ilike(f"%{search}%")) |
            (Vendor.contact_no.ilike(f"%{search}%")) |
            (Vendor.email.ilike(f"%{search}%")) |
            (Vendor.gst.ilike(f"%{search}%"))
        )

    vendors = query.order_by(Vendor.created_at.desc()).all()
    return jsonify({
        'success': True,
        'data': [v.to_dict() for v in vendors],
        'total': len(vendors),
        'message': 'Vendors fetched successfully'
    }), 200


@vendor_bp.route('/<int:vendor_id>', methods=['GET'])
@jwt_required(optional=True)
def get_vendor(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'success': False, 'message': 'Vendor not found'}), 404
    return jsonify({'success': True, 'data': vendor.to_dict(), 'message': 'Vendor fetched successfully'}), 200


@vendor_bp.route('', methods=['POST'])
@jwt_required(optional=True)
def create_vendor():
    data = request.get_json() or {}
    display_name = data.get('display_name', '').strip()
    contact_no = (data.get('contact_no') or data.get('contactNo') or '').strip()

    if not display_name:
        return jsonify({'success': False, 'message': 'Vendor Display Name is required'}), 400
    if not contact_no:
        return jsonify({'success': False, 'message': 'Contact Number is required'}), 400

    # Auto-generate vendor_code if empty
    vendor_code = data.get('vendor_code', '').strip()
    if not vendor_code:
        count = Vendor.query.count() + 1
        vendor_code = f"VEND-{count:04d}"

    vendor = Vendor(
        vendor_code=vendor_code,
        display_name=display_name,
        contact_no=contact_no,
        email=data.get('email', '').strip() or None,
        gst=data.get('gst', '').strip() or None,
        gst_doc=data.get('gst_doc', '').strip() or None,
        irdai=data.get('irdai', '').strip() or None,
        irdai_doc=data.get('irdai_doc', '').strip() or None,
        status=data.get('status', 'Active') or 'Active',
        billing_address=data.get('billing_address', '').strip() or None,
        shipping_address=data.get('shipping_address', '').strip() or None,
        bank_name=data.get('bank_name', '').strip() or None,
        account_number=data.get('account_number', '').strip() or None,
        ifsc_code=data.get('ifsc_code', '').strip() or None,
        branch=data.get('branch', '').strip() or None,
        account_holder=data.get('account_holder', '').strip() or None,
        payment_terms=data.get('payment_terms', '').strip() or None,
        website=data.get('website', '').strip() or None,
        facebook=data.get('facebook', '').strip() or None,
        twitter=data.get('twitter', '').strip() or None,
    )

    try:
        db.session.add(vendor)
        db.session.commit()
        return jsonify({
            'success': True,
            'data': vendor.to_dict(),
            'message': 'Vendor created successfully'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error creating vendor: {str(e)}'}), 500


@vendor_bp.route('/<int:vendor_id>', methods=['PUT'])
@jwt_required(optional=True)
def update_vendor(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'success': False, 'message': 'Vendor not found'}), 404

    data = request.get_json() or {}
    if 'display_name' in data and data['display_name'].strip():
        vendor.display_name = data['display_name'].strip()
    if 'contact_no' in data and data['contact_no'].strip():
        vendor.contact_no = data['contact_no'].strip()
    if 'email' in data:
        vendor.email = data['email'].strip() or None
    if 'vendor_code' in data and data['vendor_code'].strip():
        vendor.vendor_code = data['vendor_code'].strip()
    if 'gst' in data:
        vendor.gst = data['gst'].strip() or None
    if 'gst_doc' in data:
        vendor.gst_doc = data['gst_doc'].strip() or None
    if 'irdai' in data:
        vendor.irdai = data['irdai'].strip() or None
    if 'irdai_doc' in data:
        vendor.irdai_doc = data['irdai_doc'].strip() or None
    if 'status' in data and data['status']:
        vendor.status = data['status']
    if 'billing_address' in data:
        vendor.billing_address = data['billing_address']
    if 'shipping_address' in data:
        vendor.shipping_address = data['shipping_address']
    if 'bank_name' in data:
        vendor.bank_name = data['bank_name']
    if 'account_number' in data:
        vendor.account_number = data['account_number']
    if 'ifsc_code' in data:
        vendor.ifsc_code = data['ifsc_code']
    if 'branch' in data:
        vendor.branch = data['branch']
    if 'account_holder' in data:
        vendor.account_holder = data['account_holder']
    if 'payment_terms' in data:
        vendor.payment_terms = data['payment_terms']
    if 'website' in data:
        vendor.website = data['website']
    if 'facebook' in data:
        vendor.facebook = data['facebook']
    if 'twitter' in data:
        vendor.twitter = data['twitter']

    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'data': vendor.to_dict(),
            'message': 'Vendor updated successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error updating vendor: {str(e)}'}), 500


@vendor_bp.route('/<int:vendor_id>', methods=['DELETE'])
@jwt_required(optional=True)
def delete_vendor(vendor_id):
    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'success': False, 'message': 'Vendor not found'}), 404

    try:
        db.session.delete(vendor)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Vendor deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error deleting vendor: {str(e)}'}), 500


@vendor_bp.route('/upload', methods=['POST'])
@jwt_required(optional=True)
def upload_vendor_doc():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'}), 400
    
    filename = secure_filename(file.filename)
    upload_folder = current_app.config.get('UPLOAD_FOLDER', os.path.join(os.getcwd(), 'uploads'))
    os.makedirs(upload_folder, exist_ok=True)
    file_path = os.path.join(upload_folder, filename)
    file.save(file_path)

    return jsonify({
        'success': True,
        'filename': filename,
        'message': 'File uploaded successfully'
    }), 200
