"""
Aplicación Flask - Panel de Administración
"""
from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from app.config import Config
from app.auth import init_login_manager
import os

# Inicializar extensiones
login_manager = LoginManager()

def create_app():
    """Factory para crear la aplicación Flask"""
    
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Inicializar extensiones — CORS restringido al frontend en Vercel
    allowed_origins = os.getenv('ALLOWED_ORIGINS', '*')
    origins = [o.strip() for o in allowed_origins.split(',')] if allowed_origins != '*' else '*'
    CORS(app, origins=origins, supports_credentials=True)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    init_login_manager(login_manager)
    
    # Registrar blueprints
    from app.routes.auth import auth_bp
    from app.routes.dashboard import dashboard_bp
    from app.routes.services import services_bp
    from app.routes.reviews import reviews_bp
    from app.routes.social_links import social_links_bp
    from app.routes.images import images_bp
    from app.routes.settings import settings_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(dashboard_bp, url_prefix='/')
    app.register_blueprint(services_bp, url_prefix='/services')
    app.register_blueprint(reviews_bp, url_prefix='/reviews')
    app.register_blueprint(social_links_bp, url_prefix='/social-links')
    app.register_blueprint(images_bp, url_prefix='/images')
    app.register_blueprint(settings_bp, url_prefix='/settings')
    
    return app
