"""
Rutas del dashboard principal
"""
from flask import Blueprint, render_template, jsonify
from flask_login import login_required
from app.supabase_client import SupabaseClient

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@dashboard_bp.route('/dashboard')
@login_required
def index():
    """Dashboard principal"""
    try:
        # Obtener estadísticas
        services = SupabaseClient.get_services()
        reviews = SupabaseClient.get_reviews()
        social_links = SupabaseClient.get_social_links()
        analytics_summary = SupabaseClient.get_analytics_summary()
        
        stats = {
            'total_services': len(services),
            'active_services': len([s for s in services if s.get('is_active')]),
            'featured_services': len([s for s in services if s.get('is_featured')]),
            'total_reviews': len(reviews),
            'total_social_links': len(social_links),
            'total_pageviews': analytics_summary.get('total_pageviews', 0)
        }
        
        return render_template('dashboard/index.html', stats=stats)
    except Exception as e:
        return render_template('dashboard/index.html', stats={}, error=str(e))

@dashboard_bp.route('/analytics')
@login_required
def analytics():
    """Página dedicada a analytics con todos los gráficos"""
    try:
        analytics_summary = SupabaseClient.get_analytics_summary()
        
        stats = {
            'total_events': analytics_summary.get('total_events', 0),
            'total_pageviews': analytics_summary.get('total_pageviews', 0),
            'unique_pages': analytics_summary.get('unique_pages', 0)
        }
        
        return render_template('analytics/index.html', stats=stats)
    except Exception as e:
        return render_template('analytics/index.html', stats={}, error=str(e))

@dashboard_bp.route('/api/analytics/stats')
@login_required
def analytics_stats():
    """Endpoint API para obtener estadísticas de analytics"""
    try:
        # Obtener todos los datos de analytics
        summary = SupabaseClient.get_analytics_summary()
        pageviews_by_day = SupabaseClient.get_pageviews_by_day(days=30)
        top_pages = SupabaseClient.get_top_pages(limit=10)
        device_stats = SupabaseClient.get_device_stats()
        traffic_origins = SupabaseClient.get_traffic_origins(limit=5)
        
        return jsonify({
            'success': True,
            'data': {
                'summary': summary,
                'pageviews_by_day': pageviews_by_day,
                'top_pages': top_pages,
                'device_stats': device_stats,
                'traffic_origins': traffic_origins
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
