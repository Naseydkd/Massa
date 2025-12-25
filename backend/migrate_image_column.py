#!/usr/bin/env python3
"""Script pour migrer la colonne image_url à LongText"""

from app import create_app, db
import os

app = create_app()

with app.app_context():
    # Exécuter la migration
    try:
        # Utiliser raw SQL pour modifier la colonne
        db.session.execute(db.text("""
            ALTER TABLE products 
            MODIFY COLUMN image_url LONGTEXT
        """))
        db.session.commit()
        print("✅ Migration réussie: image_url est maintenant LONGTEXT")
    except Exception as e:
        print(f"⚠️ Erreur lors de la migration: {e}")
        db.session.rollback()
