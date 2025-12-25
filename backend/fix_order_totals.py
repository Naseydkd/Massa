#!/usr/bin/env python3
"""Script pour recalculer les totaux des commandes basé sur les order_items"""

from app import create_app, db
from app.models import Order, OrderItem

app = create_app()

with app.app_context():
    # Récupérer toutes les commandes
    orders = Order.query.all()
    
    for order in orders:
        if order.items:
            # Recalculer le total basé sur les items
            new_total = sum(item.quantity * item.unit_price for item in order.items)
            
            if order.total_price == 0 or order.total_price is None:
                print(f"Commande #{order.id}: Ancien total={order.total_price} → Nouveau total={new_total}")
                order.total_price = new_total
        else:
            print(f"Commande #{order.id}: Pas d'items")
    
    db.session.commit()
    print("\n✅ Totaux des commandes recalculés avec succès!")
