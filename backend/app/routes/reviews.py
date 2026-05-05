"""
Rutas para gestionar reviews
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from app.supabase_client import SupabaseClient
from datetime import datetime

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/')
@login_required
def list():
    """Lista de reviews"""
    try:
        reviews = SupabaseClient.get_reviews()
        return render_template('reviews/list.html', reviews=reviews)
    except Exception as e:
        flash(f'Error al cargar reviews: {str(e)}', 'danger')
        return render_template('reviews/list.html', reviews=[])

@reviews_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    """Crear nueva review"""
    if request.method == 'POST':
        try:
            data = {
                'name': request.form.get('name'),
                'rating': int(request.form.get('rating')),
                'text': request.form.get('text'),
                'date': request.form.get('date') or datetime.now().strftime('%Y-%m-%d')
            }
            
            # Solo añadir is_active si se proporciona
            if request.form.get('is_active') is not None:
                data['is_active'] = request.form.get('is_active') == 'on'
            
            SupabaseClient.create_review(data)
            flash('Review creada exitosamente', 'success')
            return redirect(url_for('reviews.list'))
        except Exception as e:
            flash(f'Error al crear review: {str(e)}', 'danger')
    
    return render_template('reviews/form.html', review=None)

@reviews_bp.route('/<review_id>/edit', methods=['GET', 'POST'])
@login_required
def edit(review_id):
    """Editar review existente"""
    try:
        review = SupabaseClient.get_review_by_id(review_id)
        
        if not review:
            flash('Review no encontrada', 'danger')
            return redirect(url_for('reviews.list'))
        
        if request.method == 'POST':
            data = {
                'name': request.form.get('name'),
                'rating': int(request.form.get('rating')),
                'text': request.form.get('text'),
                'date': request.form.get('date')
            }
            
            # Solo actualizar is_active si existe en la review
            if 'is_active' in review:
                data['is_active'] = request.form.get('is_active') == 'on'
            
            SupabaseClient.update_review(review_id, data)
            flash('Review actualizada exitosamente', 'success')
            return redirect(url_for('reviews.list'))
        
        # Asegurar conversión de tipos si es necesario
        if review:
            # Convertir rating a int si viene como string
            if 'rating' in review and isinstance(review['rating'], str):
                review['rating'] = int(review['rating'])
        
        return render_template('reviews/form.html', review=review)
    except Exception as e:
        flash(f'Error al editar review: {str(e)}', 'danger')
        return redirect(url_for('reviews.list'))
        return redirect(url_for('reviews.list'))

@reviews_bp.route('/<review_id>/toggle-active', methods=['POST'])
@login_required
def toggle_active(review_id):
    """Activar/desactivar review"""
    try:
        review = SupabaseClient.get_review_by_id(review_id)
        
        if review:
            new_status = not review.get('is_active', True)
            SupabaseClient.update_review(review_id, {'is_active': new_status})
            status_text = 'activada' if new_status else 'desactivada'
            flash(f'Review {status_text} exitosamente', 'success')
        else:
            flash('Review no encontrada', 'danger')
    except Exception as e:
        flash(f'Error al cambiar estado: {str(e)}', 'danger')
    
    return redirect(url_for('reviews.list'))

@reviews_bp.route('/<review_id>/delete', methods=['POST'])
@login_required
def delete(review_id):
    """Eliminar review"""
    try:
        SupabaseClient.delete_review(review_id)
        flash('Review eliminada exitosamente', 'success')
    except Exception as e:
        flash(f'Error al eliminar review: {str(e)}', 'danger')
    
    return redirect(url_for('reviews.list'))
