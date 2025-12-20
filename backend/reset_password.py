#!/usr/bin/env python3
"""
Script pour réinitialiser le mot de passe d'un utilisateur
Usage: python3 reset_password.py
"""

from app import create_app, db
from app.models.user import User

def reset_password():
    print("\n" + "=" * 50)
    print("🔐 RÉINITIALISER UN MOT DE PASSE")
    print("=" * 50)
    
    # Demander l'email
    email = input("\n📧 Email de l'utilisateur: ").strip()
    new_password = input("🔑 Nouveau mot de passe: ").strip()
    
    app = create_app()
    with app.app_context():
        # Chercher l'utilisateur
        user = User.query.filter_by(email=email).first()
        
        if not user:
            print(f"\n❌ Erreur: Aucun utilisateur avec l'email '{email}'")
            return
        
        # Changer le mot de passe
        try:
            user.set_password(new_password)
            db.session.commit()
            
            print("\n" + "=" * 50)
            print("✅ MOT DE PASSE RÉINITIALISÉ!")
            print("=" * 50)
            print(f"Email: {user.email}")
            print(f"Identifiant: {user.username}")
            print(f"Nouveau mot de passe: {new_password}")
            print(f"Admin: {'✅ OUI' if user.is_admin else '❌ NON'}")
            print("=" * 50 + "\n")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Erreur: {str(e)}\n")

if __name__ == '__main__':
    reset_password()
