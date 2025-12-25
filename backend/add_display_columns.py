#!/usr/bin/env python3
"""Script pour ajouter les colonnes display_order et is_featured"""

from app import create_app, db

app = create_app()

with app.app_context():
    try:
        # Ajouter les colonnes
        db.session.execute(db.text("""
            ALTER TABLE products 
            ADD COLUMN display_order INT DEFAULT 999,
            ADD COLUMN is_featured BOOLEAN DEFAULT FALSE
        """))
        db.session.commit()
        print("✅ Migration réussie: colonnes display_order et is_featured ajoutées")
    except Exception as e:
        print(f"⚠️ Les colonnes existent déjà ou erreur: {e}")
        db.session.rollback()
