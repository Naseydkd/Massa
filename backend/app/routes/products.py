from flask import Blueprint, jsonify, request
from app import db
from app.models import Product, OrderItem

products_bp = Blueprint('products', __name__, url_prefix='/api/products')

@products_bp.route('/', methods=['GET'])
def get_products():
    """Récupérer tous les produits"""
    category = request.args.get('category')
    
    if category:
        products = Product.query.filter_by(category=category).all()
    else:
        products = Product.query.all()
    
    return jsonify([p.to_dict() for p in products]), 200

@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Récupérer un produit par ID"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Produit non trouvé'}), 404
    
    return jsonify(product.to_dict()), 200

@products_bp.route('/', methods=['POST'])
def create_product():
    """Créer un nouveau produit (admin)"""
    data = request.get_json()
    
    if not all(k in data for k in ['name', 'category', 'price']):
        return jsonify({'error': 'Champs requis: name, category, price'}), 400
    
    product = Product(
        name=data['name'],
        category=data['category'],
        description=data.get('description'),
        price=data['price'],
        image_url=data.get('image_url'),
        available=data.get('available', True),
        stock=data.get('stock', 0)
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@products_bp.route('/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Mettre à jour un produit (admin)"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Produit non trouvé'}), 404
    
    data = request.get_json()
    
    product.name = data.get('name', product.name)
    product.category = data.get('category', product.category)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.image_url = data.get('image_url', product.image_url)
    product.available = data.get('available', product.available)
    product.stock = data.get('stock', product.stock)
    
    db.session.commit()
    
    return jsonify(product.to_dict()), 200

@products_bp.route('/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Supprimer un produit (admin)"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Produit non trouvé'}), 404
    
    try:
        # Supprimer d'abord les OrderItems associés
        OrderItem.query.filter_by(product_id=product_id).delete()
        
        # Puis supprimer le produit
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Produit supprimé'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression: {str(e)}'}), 500
@products_bp.route('/<int:product_id>/display-order', methods=['PUT'])
def update_display_order(product_id):
    """Mettre à jour l'ordre d'affichage d'un produit"""
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Produit non trouvé'}), 404
    
    data = request.get_json()
    
    if 'display_order' in data:
        product.display_order = data['display_order']
    if 'is_featured' in data:
        product.is_featured = data['is_featured']
    
    db.session.commit()
    
    return jsonify(product.to_dict()), 200

@products_bp.route('/reorder', methods=['POST'])
def reorder_products():
    """Réorganiser tous les produits à la fois"""
    data = request.get_json()  # [{id: 1, display_order: 1}, ...]
    
    try:
        for item in data:
            product = Product.query.get(item['id'])
            if product:
                product.display_order = item.get('display_order', 999)
        
        db.session.commit()
        return jsonify({'message': 'Ordre mis à jour'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500