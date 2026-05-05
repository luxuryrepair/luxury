"""
Configuración de la aplicación Flask
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Obtener la ruta del directorio backend
basedir = Path(__file__).resolve().parent.parent
env_path = basedir / '.env'

# Cargar variables de entorno
load_dotenv(env_path)

class Config:
    """Configuración base"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_ENV') == 'development'
    
    # Supabase
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
    
    # MongoDB Atlas (OBSOLETO - Ahora usamos Supabase para analytics)
    # MONGODB_URI = os.getenv('MONGODB_URI')
    # MONGODB_DATABASE = os.getenv('MONGODB_DATABASE', 'miserviciotecnico_analytics')
    
    # Admin Credentials
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
    
    # Upload Configuration
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB max file size
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # Session
    SESSION_COOKIE_SECURE = False if DEBUG else True  # False en desarrollo, True en producción
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    PERMANENT_SESSION_LIFETIME = 3600  # 1 hora
    
    @staticmethod
    def allowed_file(filename):
        """Verifica si la extensión del archivo es permitida"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS
