#!/usr/bin/env python3
"""Initialise les catégories"""

from app import create_app, db
from app.models import Category

app = create_app()

with app.app_context():
    try:
        # Créer les 4 catégories par défaut
        defaults = [
            {'name': 'classique', 'display_order': 1},
            {'name': 'gourmand', 'display_order': 2},
            {'name': 'sain', 'display_order': 3},
            {'name': 'special', 'display_order': 4}
        ]
        
        for cat_data in defaults:
            existing = Category.query.filter_by(name=cat_data['name']).first()
            if not existing:
                category = Category(
                    name=cat_data['name'],
                    display_order=cat_data['display_order'],
                    is_visible=True
                )
                db.session.add(category)
                print(f"✅ Catégorie '{cat_data['name']}' créée")
        
        db.session.commit()
        print("✅ Catégories initialisées avec succès!")
    except Exception as e:
        print(f"⚠️ Erreur: {e}")
        db.session.rollback()
