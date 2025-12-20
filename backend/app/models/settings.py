from app import db
from datetime import datetime

class Settings(db.Model):
    __tablename__ = 'settings'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Horaires
    opening_time = db.Column(db.String(5), default="09:00")  # HH:MM
    closing_time = db.Column(db.String(5), default="20:00")  # HH:MM
    is_open = db.Column(db.Boolean, default=True)  # Ouvert/fermé aujourd'hui
    
    # Notifications
    notify_email = db.Column(db.String(120))  # Email pour les notifications
    notify_on_order = db.Column(db.Boolean, default=True)
    
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'opening_time': self.opening_time,
            'closing_time': self.closing_time,
            'is_open': self.is_open,
            'notify_email': self.notify_email,
            'notify_on_order': self.notify_on_order
        }
