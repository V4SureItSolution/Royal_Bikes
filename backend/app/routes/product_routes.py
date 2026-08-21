from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config import db
from app.models.product import Product

product_bp = Blueprint('products', __name__, url_prefix='/api/products')

@product_bp.route('', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')

    query = Product.query
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (Product.name.ilike(f"%{search}%")) |
            (Product.brand.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%"))
        )

    products = query.order_by(Product.created_at.desc()).all()
    return jsonify({'success': True, 'data': [p.to_dict() for p in products], 'message': 'Products fetched successfully'}), 200


@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'success': False, 'message': 'Product not found'}), 404
    return jsonify({'success': True, 'data': product.to_dict(), 'message': 'Product details fetched'}), 200


@product_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    data = request.get_json() or {}
    if not data.get('name'):
        return jsonify({'success': False, 'message': 'Product name is required'}), 400

    product = Product(
        name=data.get('name', '').strip(),
        brand=data.get('brand', 'Royal Enfield').strip(),
        category=data.get('category', 'Cruiser').strip(),
        price=float(data.get('price', 0.0)),
        stock=int(data.get('stock', 0)),
        description=data.get('description', ''),
        image_url=data.get('image_url', ''),
        is_available=data.get('is_available', True)
    )
    db.session.add(product)
    db.session.commit()

    return jsonify({'success': True, 'data': product.to_dict(), 'message': 'Product created successfully'}), 201


@product_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'success': False, 'message': 'Product not found'}), 404

    data = request.get_json() or {}
    if 'name' in data:
        product.name = data['name'].strip()
    if 'brand' in data:
        product.brand = data['brand'].strip()
    if 'category' in data:
        product.category = data['category'].strip()
    if 'price' in data:
        product.price = float(data['price'])
    if 'stock' in data:
        product.stock = int(data['stock'])
    if 'description' in data:
        product.description = data['description']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'is_available' in data:
        product.is_available = bool(data['is_available'])

    db.session.commit()
    return jsonify({'success': True, 'data': product.to_dict(), 'message': 'Product updated successfully'}), 200


@product_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({'success': False, 'message': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({'success': True, 'data': None, 'message': 'Product deleted successfully'}), 200
