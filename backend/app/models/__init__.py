from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.category import Category
from app.models.review import Review
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)

    # Crée toutes les tables si elles n'existent pas
    with app.app_context():
        db.create_all()

    return app

__all__ = ['Product', 'User', 'Order', 'OrderItem']
