from flask import Blueprint, jsonify, request
from app import db
from app.models.review import Review

reviews_bp = Blueprint('reviews', __name__, url_prefix='/api/reviews')

@reviews_bp.route('/', methods=['GET'])
def get_reviews():
    """Récupérer tous les avis"""
    reviews = Review.query.all()
    return jsonify([r.to_dict() for r in reviews]), 200

@reviews_bp.route('/product/<int:product_id>', methods=['GET'])
def get_product_reviews(product_id):
    """Récupérer les avis d'un produit"""
    reviews = Review.query.filter_by(product_id=product_id).all()
    return jsonify([r.to_dict() for r in reviews]), 200

@reviews_bp.route('/', methods=['POST'])
def create_review():
    """Créer un avis"""
    data = request.get_json()
    
    if not all(k in data for k in ['product_id', 'user_id', 'rating']):
        return jsonify({'error': 'Champs requis: product_id, user_id, rating'}), 400
    
    if data['rating'] < 1 or data['rating'] > 5:
        return jsonify({'error': 'Note doit être entre 1 et 5'}), 400
    
    review = Review(
        product_id=data['product_id'],
        user_id=data['user_id'],
        rating=data['rating'],
        comment=data.get('comment')
    )
    
    db.session.add(review)
    db.session.commit()
    
    return jsonify(review.to_dict()), 201

@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    """Supprimer un avis (admin)"""
    review = Review.query.get(review_id)
    
    if not review:
        return jsonify({'error': 'Avis non trouvé'}), 404
    
    db.session.delete(review)
    db.session.commit()
    
    return jsonify({'message': 'Avis supprimé'}), 200
