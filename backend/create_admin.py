#!/usr/bin/env python3
"""
Script pour créer un compte administrateur
Usage: python3 create_admin.py
"""

from app import create_app, db
from app.models.user import User

def create_admin():
    print("\n" + "=" * 50)
    print("🔑 CRÉER UN COMPTE ADMINISTRATEUR")
    print("=" * 50)
    
    # Demander les infos
    email = input("\n📧 Email: ").strip()
    username = input("👤 Nom d'utilisateur: ").strip()
    password = input("🔐 Mot de passe: ").strip()
    first_name = input("✍️  Prénom (optionnel): ").strip() or None
    last_name = input("✍️  Nom (optionnel): ").strip() or None
    
    app = create_app()
    with app.app_context():
        # Vérifier que l'email n'existe pas
        if User.query.filter_by(email=email).first():
            print("\n❌ Erreur: Cet email existe déjà!")
            return
        
        if User.query.filter_by(username=username).first():
            print("\n❌ Erreur: Ce nom d'utilisateur existe déjà!")
            return
        
        # Créer l'utilisateur admin
        admin = User(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            is_admin=True
        )
        admin.set_password(password)
        
        try:
            db.session.add(admin)
            db.session.commit()
            
            print("\n" + "=" * 50)
            print("✅ ADMINISTRATEUR CRÉÉ AVEC SUCCÈS!")
            print("=" * 50)
            print(f"Email: {email}")
            print(f"Identifiant: {username}")
            print(f"Statut: Admin ✅")
            print("\n📍 Connexion admin:")
            print(f"   • URL: http://localhost:8000/admin-auth.html")
            print(f"   • Email: {email}")
            print(f"   • Mot de passe: [celui que vous avez saisi]")
            print("=" * 50 + "\n")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Erreur: {str(e)}\n")

if __name__ == '__main__':
    create_admin()

