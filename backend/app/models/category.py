from app import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    display_order = db.Column(db.Integer, default=999)  # Ordre d'affichage
    is_visible = db.Column(db.Boolean, default=True)  # Visible ou non
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'display_order': self.display_order,
            'is_visible': self.is_visible
        }
