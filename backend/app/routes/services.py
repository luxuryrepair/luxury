"""
Rutas para gestionar servicios
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required
from slugify import slugify
from werkzeug.utils import secure_filename
from app.supabase_client import SupabaseClient
from app.ai_generator import AIContentGenerator
import os

services_bp = Blueprint('services', __name__)

# Extensiones de imagen permitidas
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    """Verificar si la extensión del archivo es permitida"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@services_bp.route('/')
@login_required
def list():
    """Lista de servicios"""
    try:
        services = SupabaseClient.get_services()
        if not services:
            flash('⚠️ La tabla de servicios está vacía. Crea tu primer servicio.', 'info')
        return render_template('services/list.html', services=services or [])
    except Exception as e:
        flash(f'❌ Error al cargar servicios: {str(e)}', 'danger')
        flash(f'💡 Asegúrate de que la tabla "services" existe en Supabase', 'warning')
        return render_template('services/list.html', services=[])

@services_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    """Crear nuevo servicio"""
    if request.method == 'POST':
        try:
            # Generar slug automáticamente
            title = request.form.get('title')
            slug = slugify(title)
            
            data = {
                'title': title,
                'slug': slug,
                'description': request.form.get('description'),
                'long_description': request.form.get('long_description'),
                'icon_name': request.form.get('icon_name', 'Wrench'),
                'is_featured': request.form.get('is_featured') == 'on',
                'is_active': request.form.get('is_active') == 'on',
                'display_order': int(request.form.get('display_order', 999))
            }
            
            # Procesar imagen: prioridad a archivo subido, luego URL seleccionada
            if 'image' in request.files:
                file = request.files['image']
                
                if file and file.filename and allowed_file(file.filename):
                    try:
                        # Usar el supabase_client para procesar y subir la imagen
                        image_url = SupabaseClient.process_and_upload_image(file, 'services')
                        data['image_url'] = image_url
                        flash('✅ Imagen subida correctamente', 'success')
                    except Exception as img_error:
                        flash(f'⚠️ Advertencia: Servicio creado pero error al subir imagen: {str(img_error)}', 'warning')
                elif request.form.get('selected_image_url'):
                    # Si no hay archivo pero sí URL seleccionada de la galería
                    data['image_url'] = request.form.get('selected_image_url')
                    flash('✅ Imagen seleccionada de la galería', 'success')
            elif request.form.get('selected_image_url'):
                # Fallback si 'image' no está en request.files
                data['image_url'] = request.form.get('selected_image_url')
                flash('✅ Imagen seleccionada de la galería', 'success')
            
            service = SupabaseClient.create_service(data)
            flash(f'Servicio "{service["title"]}" creado exitosamente', 'success')
            return redirect(url_for('services.list'))
        except Exception as e:
            flash(f'Error al crear servicio: {str(e)}', 'danger')
    
    return render_template('services/create.html')

@services_bp.route('/<service_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(service_id):
    """Editar servicio existente"""
    if request.method == 'POST':
        try:
            data = {
                'title': request.form.get('title'),
                'slug': slugify(request.form.get('title')),
                'description': request.form.get('description'),
                'long_description': request.form.get('long_description'),
                'icon_name': request.form.get('icon_name', 'Wrench'),
                'is_featured': request.form.get('is_featured') == 'on',
                'is_active': request.form.get('is_active') == 'on',
                'display_order': int(request.form.get('display_order', 999))
            }
            
            # Procesar nueva imagen: prioridad a archivo subido, luego URL seleccionada
            if 'image' in request.files:
                file = request.files['image']
                
                if file and file.filename and allowed_file(file.filename):
                    try:
                        # Subir nueva imagen
                        image_url = SupabaseClient.process_and_upload_image(file, 'services')
                        data['image_url'] = image_url
                        flash('✅ Imagen actualizada correctamente', 'success')
                    except Exception as img_error:
                        flash(f'⚠️ Advertencia: Servicio actualizado pero error al subir imagen: {str(img_error)}', 'warning')
                elif request.form.get('selected_image_url'):
                    # Si no hay archivo pero sí URL seleccionada de la galería
                    data['image_url'] = request.form.get('selected_image_url')
                    flash('✅ Imagen seleccionada de la galería', 'success')
            elif request.form.get('selected_image_url'):
                # Fallback si 'image' no está en request.files
                data['image_url'] = request.form.get('selected_image_url')
                flash('✅ Imagen seleccionada de la galería', 'success')
            
            service = SupabaseClient.update_service(service_id, data)
            flash(f'Servicio "{service["title"]}" actualizado exitosamente', 'success')
            return redirect(url_for('services.list'))
        except Exception as e:
            flash(f'Error al actualizar servicio: {str(e)}', 'danger')
    
    try:
        service = SupabaseClient.get_service_by_id(service_id)
        return render_template('services/edit.html', service=service)
    except Exception as e:
        flash(f'Error al cargar servicio: {str(e)}', 'danger')
        return redirect(url_for('services.list'))

@services_bp.route('/<service_id>/delete', methods=['POST'])
@login_required
def delete(service_id):
    """Eliminar servicio"""
    try:
        SupabaseClient.delete_service(service_id)
        flash('Servicio eliminado exitosamente', 'success')
    except Exception as e:
        flash(f'Error al eliminar servicio: {str(e)}', 'danger')
    
    return redirect(url_for('services.list'))

@services_bp.route('/<service_id>/toggle-active', methods=['POST'])
@login_required
def toggle_active(service_id):
    """Activar/desactivar servicio"""
    try:
        service = SupabaseClient.get_service_by_id(service_id)
        new_status = not service.get('is_active', False)
        SupabaseClient.update_service(service_id, {'is_active': new_status})
        
        status_text = 'activado' if new_status else 'desactivado'
        flash(f'Servicio {status_text} exitosamente', 'success')
    except Exception as e:
        flash(f'Error al cambiar estado: {str(e)}', 'danger')
    
    return redirect(url_for('services.list'))

@services_bp.route('/<service_id>/toggle-featured', methods=['POST'])
@login_required
def toggle_featured(service_id):
    """Marcar/desmarcar como destacado"""
    try:
        service = SupabaseClient.get_service_by_id(service_id)
        new_status = not service.get('is_featured', False)
        SupabaseClient.update_service(service_id, {'is_featured': new_status})
        
        status_text = 'destacado' if new_status else 'no destacado'
        flash(f'Servicio marcado como {status_text}', 'success')
    except Exception as e:
        flash(f'Error al cambiar estado destacado: {str(e)}', 'danger')
    
    return redirect(url_for('services.list'))

@services_bp.route('/generate-content', methods=['POST'])
@login_required
def generate_content():
    """Generar contenido automático usando IA"""
    try:
        data = request.get_json()
        title = data.get('title', '').strip()
        
        if not title:
            return jsonify({
                'success': False,
                'error': 'El título es requerido para generar contenido'
            }), 400
        
        # Verificar si la IA está habilitada
        if not AIContentGenerator.is_enabled():
            return jsonify({
                'success': False,
                'error': 'La generación con IA no está configurada. Agrega tu API Key de Groq en Configuración.'
            }), 400
        
        # Generar contenido
        content = AIContentGenerator.generate_service_content(title)
        
        return jsonify({
            'success': True,
            'description': content['description'],
            'long_description': content['long_description']
        })
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error al generar contenido: {str(e)}'
        }), 500
