from flask import Blueprint, jsonify, request
from app import db
from app.models import Order, OrderItem, Product
from app.models.settings import Settings
from app.utils.email_service import send_order_notification
from sqlalchemy.orm import joinedload

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')

@orders_bp.route('/', methods=['POST'])
def create_order():
    """Créer une nouvelle commande"""
    data = request.get_json()
    
    if not all(k in data for k in ['user_id', 'items', 'delivery_type', 'payment_method']):
        return jsonify({'error': 'Champs requis manquants'}), 400
    
    # Calculer le total
    total_price = 0
    items_list = []
    
    for item in data['items']:
        product = Product.query.get(item['product_id'])
        if not product:
            return jsonify({'error': f"Produit {item['product_id']} non trouvé"}), 404
        
        total_price += product.price * item['quantity']
        items_list.append((product, item['quantity'], product.price))
    
    order = Order(
        user_id=data['user_id'],
        total_price=total_price,
        delivery_type=data['delivery_type'],
        payment_method=data['payment_method'],
        notes=data.get('notes')
    )
    
    db.session.add(order)
    db.session.flush()
    
    for product, quantity, price in items_list:
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=quantity,
            unit_price=price
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    # Envoyer notification email si activée
    try:
        settings = Settings.query.first()
        if settings and settings.notify_on_order and settings.notify_email:
            send_order_notification(
                order.id,
                total_price,
                settings.notify_email
            )
    except Exception as e:
        print(f"⚠️ Erreur notification: {str(e)}")
    
    return jsonify(order.to_dict()), 201

@orders_bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_orders(user_id):
    """Récupérer toutes les commandes d'un utilisateur"""
    orders = Order.query.options(joinedload(Order.user)).filter_by(user_id=user_id).all()
    
    return jsonify([o.to_dict() for o in orders]), 200

@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Récupérer une commande"""
    order = Order.query.options(joinedload(Order.user)).get(order_id)
    
    if not order:
        return jsonify({'error': 'Commande non trouvée'}), 404
    
    return jsonify(order.to_dict()), 200

@orders_bp.route('/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    """Mettre à jour le statut d'une commande"""
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': 'Commande non trouvée'}), 404
    
    data = request.get_json()
    
    order.status = data.get('status', order.status)
    order.notes = data.get('notes', order.notes)
    
    db.session.commit()
    
    return jsonify(order.to_dict()), 200

@orders_bp.route('/', methods=['GET'])
def get_all_orders():
    """Récupérer toutes les commandes (admin)"""
    orders = Order.query.options(joinedload(Order.user)).all()
    
    return jsonify([o.to_dict() for o in orders]), 200

@orders_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    """Supprimer une commande"""
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': 'Commande non trouvée'}), 404
    
    db.session.delete(order)
    db.session.commit()
    
    return jsonify({'message': 'Commande supprimée'}), 200

