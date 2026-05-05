"""
Rutas para gestionar imágenes
"""
import io
import uuid
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required
from PIL import Image
from app.supabase_client import SupabaseClient
from app.config import Config

images_bp = Blueprint('images', __name__)

@images_bp.route('/')
@login_required
def list():
    """Lista de imágenes"""
    return render_template('images/list.html')

@images_bp.route('/list-files', methods=['GET'])
@login_required
def list_files():
    """Obtener lista de imágenes del bucket"""
    try:
        images = SupabaseClient.list_images('images', 'services')
        return jsonify({
            'success': True,
            'images': images
        })
    except Exception as e:
        import logging
        logging.error(f"Error al listar imágenes: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@images_bp.route('/upload', methods=['POST'])
@login_required
def upload():
    """Subir imagen a Supabase Storage"""
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No se seleccionó ningún archivo'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'Nombre de archivo vacío'}), 400
    
    # Verificar extensión permitida
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    if not ('.' in file.filename and file.filename.rsplit('.', 1)[1].lower() in allowed_extensions):
        return jsonify({'success': False, 'error': 'Tipo de archivo no permitido. Solo JPG, PNG, GIF, WEBP'}), 400
    
    try:
        # Usar el método mejorado que procesa y optimiza la imagen
        public_url = SupabaseClient.process_and_upload_image(file, 'services')
        
        return jsonify({
            'success': True,
            'url': public_url,
            'message': 'Imagen subida y optimizada correctamente'
        })
    
    except Exception as e:
        import logging
        logging.error(f"Error al subir imagen: {str(e)}")
        return jsonify({'success': False, 'error': f'Error al subir imagen: {str(e)}'}), 500

@images_bp.route('/delete', methods=['POST'])
@login_required
def delete():
    """Eliminar imagen de Supabase Storage"""
    data = request.get_json()
    file_path = data.get('file_path')
    
    if not file_path:
        return jsonify({'success': False, 'error': 'Ruta de archivo no proporcionada'}), 400
    
    try:
        SupabaseClient.delete_image('images', file_path)
        return jsonify({'success': True, 'message': 'Imagen eliminada correctamente'})
    except Exception as e:
        import logging
        logging.error(f"Error al eliminar imagen: {str(e)}")
        return jsonify({'success': False, 'error': f'Error al eliminar imagen: {str(e)}'}), 500
