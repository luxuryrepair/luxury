"""
Rutas para gestionar el contenido de la página Nosotros
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required
from app.supabase_client import SupabaseClient
from app.ai_generator import AIContentGenerator

about_bp = Blueprint('about', __name__)


@about_bp.route('/')
@login_required
def edit():
    """Formulario de edición del contenido de Nosotros"""
    try:
        content = SupabaseClient.get_about_content()
        ai_enabled = AIContentGenerator.is_enabled()
        return render_template('about/edit.html', content=content, ai_enabled=ai_enabled)
    except Exception as e:
        flash(f'Error al cargar contenido: {str(e)}', 'danger')
        return render_template('about/edit.html', content={}, ai_enabled=False)


@about_bp.route('/save', methods=['POST'])
@login_required
def save():
    """Guarda los cambios del formulario"""
    import json

    try:
        data = {}
        text_fields = [
            'about_hero_title', 'about_hero_subtitle',
            'about_intro_text1', 'about_intro_text2',
            'about_brands_description', 'about_location_text',
            'about_mission', 'about_vision',
        ]
        for key in text_fields:
            data[key] = request.form.get(key, '').strip()

        # Campos de lista: uno por línea
        for key in ('about_services', 'about_reasons', 'about_brands'):
            raw = request.form.get(key, '')
            items = [line.strip() for line in raw.splitlines() if line.strip()]
            data[key] = json.dumps(items, ensure_ascii=False)

        # Valores: título|descripción por línea
        raw_values = request.form.get('about_values', '')
        values = []
        for line in raw_values.splitlines():
            line = line.strip()
            if '|' in line:
                title, _, desc = line.partition('|')
                values.append({'title': title.strip(), 'description': desc.strip()})
        data['about_values'] = json.dumps(values, ensure_ascii=False)

        SupabaseClient.save_about_content(data)
        flash('✅ Contenido de Nosotros actualizado correctamente', 'success')
    except Exception as e:
        flash(f'❌ Error al guardar: {str(e)}', 'danger')

    return redirect(url_for('about.edit'))


@about_bp.route('/generate-ai', methods=['POST'])
@login_required
def generate_ai():
    """Genera todo el contenido con IA y lo guarda"""
    import json

    try:
        if not AIContentGenerator.is_enabled():
            return jsonify({'success': False, 'error': 'IA no habilitada. Configura la API Key de Groq en Ajustes.'}), 400

        result = AIContentGenerator.generate_about_content()

        # Mapear claves devueltas por la IA a las claves de settings
        mapping = {
            'hero_title':          'about_hero_title',
            'hero_subtitle':       'about_hero_subtitle',
            'intro_text1':         'about_intro_text1',
            'intro_text2':         'about_intro_text2',
            'services':            'about_services',
            'brands':              'about_brands',
            'brands_description':  'about_brands_description',
            'reasons':             'about_reasons',
            'location_text':       'about_location_text',
            'mission':             'about_mission',
            'vision':              'about_vision',
            'values':              'about_values',
        }

        to_save = {}
        for ai_key, setting_key in mapping.items():
            if ai_key in result:
                to_save[setting_key] = result[ai_key]

        SupabaseClient.save_about_content(to_save)

        return jsonify({'success': True, 'message': '✅ Contenido generado y guardado correctamente'})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
