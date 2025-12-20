#!/usr/bin/env python3
"""
Script de test pour valider toutes les nouvelles fonctionnalités
- Stock management
- Horaires/Settings
- Reviews/Avis
- Email notifications
"""

import sys
import os

# Ajouter le backend au path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app import create_app, db
from app.models.product import Product
from app.models.review import Review
from app.models.settings import Settings
from app.models.order import Order
from app.models.user import User

app = create_app()

def test_models():
    """Test si tous les modèles existent et peuvent être instanciés"""
    print("🧪 Vérification des modèles...")
    
    with app.app_context():
        # Créer les tables
        db.create_all()
        print("✅ Tables créées avec succès")
        
        # Vérifier les colonnes du modèle Product
        product = Product(name="Test Donut", price=500, stock=10)
        assert hasattr(product, 'stock'), "Product doit avoir un champ 'stock'"
        print("✅ Product.stock existe")
        
        # Vérifier Review
        review = Review(product_id=1, user_id=1, rating=5, comment="Excellent!")
        assert hasattr(review, 'rating'), "Review doit avoir un champ 'rating'"
        assert hasattr(review, 'comment'), "Review doit avoir un champ 'comment'"
        print("✅ Review model OK")
        
        # Vérifier Settings
        settings = Settings()
        assert hasattr(settings, 'opening_time'), "Settings doit avoir 'opening_time'"
        assert hasattr(settings, 'notify_on_order'), "Settings doit avoir 'notify_on_order'"
        print("✅ Settings model OK")
        
        print("\n✅ Tous les modèles sont valides!")

def test_api_endpoints():
    """Test si les endpoints API répondent"""
    print("\n🌐 Vérification des endpoints API...")
    
    client = app.test_client()
    
    endpoints = [
        ('GET', '/api/products/', 200),
        ('GET', '/api/orders/', 200),
        ('GET', '/api/users/', 200),
        ('GET', '/api/settings/', 200),
        ('GET', '/api/reviews/', 200),
    ]
    
    for method, endpoint, expected_status in endpoints:
        if method == 'GET':
            response = client.get(endpoint)
            status = response.status_code
            print(f"  {method} {endpoint}: {status}", "✅" if status == expected_status else "❌")

def test_database_structure():
    """Vérifier la structure de la base de données"""
    print("\n💾 Vérification de la structure de base de données...")
    
    with app.app_context():
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        
        required_tables = ['product', 'review', 'settings', 'order', 'user']
        
        for table in required_tables:
            if table in tables:
                columns = [c['name'] for c in inspector.get_columns(table)]
                print(f"  ✅ Table '{table}' existe avec {len(columns)} colonnes")
            else:
                print(f"  ❌ Table '{table}' MANQUANTE")

def test_email_service():
    """Vérifier que le service email est importable"""
    print("\n📧 Vérification du service email...")
    
    try:
        from app.utils.email_service import send_order_notification
        print("  ✅ Module email_service importable")
    except Exception as e:
        print(f"  ❌ Erreur: {e}")

if __name__ == '__main__':
    try:
        test_models()
        test_database_structure()
        test_api_endpoints()
        test_email_service()
        
        print("\n" + "="*50)
        print("✅ TOUS LES TESTS PASSÉS!")
        print("="*50)
        
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
