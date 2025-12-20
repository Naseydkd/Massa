from flask import Blueprint, jsonify, request
from app import db
from app.models.settings import Settings

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')

@settings_bp.route('/', methods=['GET'])
def get_settings():
    """Récupérer les paramètres"""
    settings = Settings.query.first()
    
    if not settings:
        # Créer les paramètres par défaut
        settings = Settings()
        db.session.add(settings)
        db.session.commit()
    
    return jsonify(settings.to_dict()), 200

@settings_bp.route('/', methods=['PUT'])
def update_settings():
    """Mettre à jour les paramètres (admin)"""
    settings = Settings.query.first()
    
    if not settings:
        settings = Settings()
    
    data = request.get_json()
    
    if 'opening_time' in data:
        settings.opening_time = data['opening_time']
    if 'closing_time' in data:
        settings.closing_time = data['closing_time']
    if 'is_open' in data:
        settings.is_open = data['is_open']
    if 'notify_email' in data:
        settings.notify_email = data['notify_email']
    if 'notify_on_order' in data:
        settings.notify_on_order = data['notify_on_order']
    
    db.session.add(settings)
    db.session.commit()
    
    return jsonify(settings.to_dict()), 200
