from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import os

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuration PostgreSQL (Supabase)
    database_url = os.getenv('DATABASE_URL')
    if database_url and database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url or (
        f"postgresql://{os.getenv('DB_USER', 'postgres')}:"
        f"{os.getenv('DB_PASSWORD', '')}@"
        f"{os.getenv('DB_HOST', 'localhost')}/"
        f"{os.getenv('DB_NAME', 'postgres')}"
    )
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {"connect_args": {"sslmode": "require"}}
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max
    

    db.init_app(app)
    
    # Enregistrer les blueprints
    from app.routes.products import products_bp
    from app.routes.users import users_bp
    from app.routes.orders import orders_bp
    from app.routes.reviews import reviews_bp
    from app.routes.settings import settings_bp
    from app.routes.categories import categories_bp
    
    app.register_blueprint(products_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(reviews_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(categories_bp)
    
    with app.app_context():
        db.create_all()
    
    return app
