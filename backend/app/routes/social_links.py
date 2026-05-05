"""
Rutas para gestionar enlaces de redes sociales
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from app.supabase_client import SupabaseClient

social_links_bp = Blueprint('social_links', __name__)

@social_links_bp.route('/')
@login_required
def list():
    """Lista de enlaces sociales"""
    try:
        social_links = SupabaseClient.get_social_links()
        return render_template('social_links/list.html', social_links=social_links)
    except Exception as e:
        flash(f'Error al cargar enlaces: {str(e)}', 'danger')
        return render_template('social_links/list.html', social_links=[])

@social_links_bp.route('/<link_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(link_id):
    """Editar enlace social"""
    if request.method == 'POST':
        try:
            data = {
                'platform': request.form.get('platform'),
                'url': request.form.get('url'),
                'icon_name': request.form.get('icon_name'),
                'display_order': int(request.form.get('display_order', 999)),
                'is_active': request.form.get('is_active') == 'on'
            }
            
            SupabaseClient.update_social_link(link_id, data)
            flash('Enlace actualizado exitosamente', 'success')
            return redirect(url_for('social_links.list'))
        except Exception as e:
            flash(f'Error al actualizar enlace: {str(e)}', 'danger')
    
    try:
        social_links = SupabaseClient.get_social_links()
        link = next((l for l in social_links if l['id'] == link_id), None)
        return render_template('social_links/edit.html', link=link)
    except Exception as e:
        flash(f'Error al cargar enlace: {str(e)}', 'danger')
        return redirect(url_for('social_links.list'))

@social_links_bp.route('/<link_id>/toggle-active', methods=['POST'])
@login_required
def toggle_active(link_id):
    """Activar/desactivar enlace"""
    try:
        social_links = SupabaseClient.get_social_links()
        link = next((l for l in social_links if l['id'] == link_id), None)
        
        if link:
            new_status = not link.get('is_active', True)
            SupabaseClient.update_social_link(link_id, {'is_active': new_status})
            status_text = 'activado' if new_status else 'desactivado'
            flash(f'Enlace {status_text} exitosamente', 'success')
        else:
            flash('Enlace no encontrado', 'danger')
    except Exception as e:
        flash(f'Error al cambiar estado: {str(e)}', 'danger')
    
    return redirect(url_for('social_links.list'))
