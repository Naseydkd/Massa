from flask import Blueprint, jsonify, request
from app import db
from app.models import Category

categories_bp = Blueprint('categories', __name__, url_prefix='/api/categories')

@categories_bp.route('/', methods=['GET'])
def get_categories():
    """Récupérer toutes les catégories triées par ordre d'affichage"""
    categories = Category.query.order_by(Category.display_order).all()
    return jsonify([c.to_dict() for c in categories]), 200

@categories_bp.route('/', methods=['POST'])
def create_or_update_categories():
    """Créer une nouvelle catégorie ou réinitialiser les catégories"""
    data = request.get_json()
    
    try:
        # Si c'est une liste, reorder tous (bulk update)
        if isinstance(data, list):
            for item in data:
                category = Category.query.filter_by(name=item['name']).first()
                if category:
                    category.display_order = item.get('display_order', 999)
                    category.is_visible = item.get('is_visible', True)
                else:
                    category = Category(
                        name=item['name'],
                        display_order=item.get('display_order', 999),
                        is_visible=item.get('is_visible', True)
                    )
                    db.session.add(category)
            db.session.commit()
            return jsonify({'message': 'Catégories mises à jour'}), 200
        # Si c'est un objet, créer une nouvelle catégorie
        elif isinstance(data, dict):
            # Vérifier si la catégorie existe déjà
            if 'name' not in data:
                return jsonify({'error': 'Le nom est requis'}), 400
            
            existing = Category.query.filter_by(name=data['name'].lower()).first()
            if existing:
                return jsonify({'error': f'Catégorie "{data["name"]}" existe déjà'}), 400
            
            category = Category(
                name=data['name'].lower(),
                display_order=data.get('display_order', 999),
                is_visible=data.get('is_visible', True)
            )
            db.session.add(category)
            db.session.commit()
            return jsonify(category.to_dict()), 201
        else:
            return jsonify({'error': 'Format invalide'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@categories_bp.route('/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """Mettre à jour une catégorie"""
    category = Category.query.get(category_id)
    if not category:
        return jsonify({'error': 'Catégorie non trouvée'}), 404
    
    data = request.get_json()
    if 'display_order' in data:
        category.display_order = data['display_order']
    if 'is_visible' in data:
        category.is_visible = data['is_visible']
    
    db.session.commit()
    return jsonify(category.to_dict()), 200

@categories_bp.route('/init', methods=['POST'])
def init_categories():
    """Initialiser les 4 catégories par défaut"""
    try:
        defaults = [
            {'name': 'classique', 'display_order': 1},
            {'name': 'gourmand', 'display_order': 2},
            {'name': 'sain', 'display_order': 3},
            {'name': 'special', 'display_order': 4}
        ]
        
        for cat in defaults:
            existing = Category.query.filter_by(name=cat['name']).first()
            if not existing:
                category = Category(name=cat['name'], display_order=cat['display_order'], is_visible=True)
                db.session.add(category)
        
        db.session.commit()
        return jsonify({'message': 'Catégories initialisées'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
