"""
Sistema de autenticación para el panel de administración
"""
from flask_login import UserMixin
from werkzeug.security import check_password_hash, generate_password_hash
from app.config import Config

class User(UserMixin):
    """Clase de usuario para Flask-Login"""
    
    def __init__(self, username):
        self.id = username
        self.username = username
    
    @staticmethod
    def get(username):
        """Obtiene un usuario si las credenciales son válidas"""
        if username == Config.ADMIN_USERNAME:
            return User(username)
        return None
    
    @staticmethod
    def verify_password(username, password):
        """Verifica las credenciales del usuario"""
        if username == Config.ADMIN_USERNAME and password == Config.ADMIN_PASSWORD:
            return True
        return False

def init_login_manager(login_manager):
    """Inicializa el login manager"""
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.get(user_id)
    
    @login_manager.unauthorized_handler
    def unauthorized():
        from flask import redirect, url_for, flash
        flash('Debes iniciar sesión para acceder a esta página', 'warning')
        return redirect(url_for('auth.login'))
