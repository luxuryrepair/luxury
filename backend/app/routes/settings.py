"""
Rutas para gestionar la configuración del negocio
"""
from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_required
from app.supabase_client import SupabaseClient

settings_bp = Blueprint('settings', __name__)

BUSINESS_FIELDS = [
    {'key': 'business_name',            'label': 'Nombre del negocio',        'type': 'text'},
    {'key': 'business_email',           'label': 'Email de contacto',          'type': 'email'},
    {'key': 'business_phone',           'label': 'Teléfono',                   'type': 'text'},
    {'key': 'business_address',         'label': 'Dirección',                  'type': 'text'},
    {'key': 'business_hours',           'label': 'Horario de apertura',        'type': 'text'},
    {'key': 'business_coordinates_lat', 'label': 'Latitud GPS',                'type': 'text'},
    {'key': 'business_coordinates_lng', 'label': 'Longitud GPS',               'type': 'text'},
    {'key': 'business_maps_embed',      'label': 'URL embed Google Maps',      'type': 'url'},
]

AI_FIELDS = [
    {'key': 'groq_api_key', 'label': 'Groq API Key', 'type': 'password', 'description': 'Clave privada para generar contenido con IA'},
    {'key': 'groq_model', 'label': 'Modelo de Groq', 'type': 'text', 'default': 'llama-3.3-70b-versatile'},
    {'key': 'ai_generation_enabled', 'label': 'Generación con IA habilitada', 'type': 'checkbox', 'default': 'true'},
]


@settings_bp.route('/')
@login_required
def edit():
    """Formulario de configuración del negocio"""
    try:
        all_settings = SupabaseClient.get_all_settings()

        # Nunca mostrar la API key completa en la vista
        masked_api_key = ''
        if all_settings.get('groq_api_key'):
            masked_api_key = '********'

        return render_template(
            'settings/edit.html',
            business_fields=BUSINESS_FIELDS,
            ai_fields=AI_FIELDS,
            settings=all_settings,
            has_groq_api_key=bool(all_settings.get('groq_api_key')),
            masked_groq_api_key=masked_api_key
        )
    except Exception as e:
        flash(f'Error al cargar la configuración: {str(e)}', 'danger')
        return render_template(
            'settings/edit.html',
            business_fields=BUSINESS_FIELDS,
            ai_fields=AI_FIELDS,
            settings={},
            has_groq_api_key=False,
            masked_groq_api_key=''
        )


@settings_bp.route('/save', methods=['POST'])
@login_required
def save():
    """Guarda los valores del formulario"""
    errors = []

    for field in BUSINESS_FIELDS:
        key = field['key']
        value = request.form.get(key, '').strip()
        try:
            SupabaseClient.set_setting(key, value)
        except Exception as e:
            errors.append(f"{field['label']}: {str(e)}")

    # IA: si API key viene vacía, se mantiene la actual
    new_api_key = request.form.get('groq_api_key', '').strip()
    if new_api_key:
        try:
            SupabaseClient.set_setting('groq_api_key', new_api_key, 'API Key privada de Groq')
        except Exception as e:
            errors.append(f"Groq API Key: {str(e)}")

    groq_model = request.form.get('groq_model', '').strip() or 'llama-3.3-70b-versatile'
    try:
        SupabaseClient.set_setting('groq_model', groq_model, 'Modelo usado para generar contenido IA')
    except Exception as e:
        errors.append(f"Modelo de Groq: {str(e)}")

    ai_enabled = 'true' if request.form.get('ai_generation_enabled') == 'on' else 'false'
    try:
        SupabaseClient.set_setting('ai_generation_enabled', ai_enabled, 'Habilitar o deshabilitar generación con IA')
    except Exception as e:
        errors.append(f"Generación IA: {str(e)}")

    if errors:
        flash('Algunos valores no se pudieron guardar: ' + '; '.join(errors), 'danger')
    else:
        flash('Configuración guardada correctamente', 'success')

    return redirect(url_for('settings.edit'))
