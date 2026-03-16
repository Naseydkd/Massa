from app import db
from datetime import datetime

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # 4 catégories
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.Text, nullable=True)  # Stocke URLs et images Base64
    available = db.Column(db.Boolean, default=True)
    stock = db.Column(db.Integer, default=0)  # Quantité en stock
    display_order = db.Column(db.Integer, default=999)  # Ordre d'affichage
    is_featured = db.Column(db.Boolean, default=False)  # Affiché en vedette
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    order_items = db.relationship('OrderItem', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'description': self.description,
            'price': self.price,
            'image_url': self.image_url,
            'available': self.available,
            'stock': self.stock,
            'display_order': self.display_order,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
