"""
Cliente de Supabase para interactuar con la base de datos
"""
from supabase import create_client, Client
from app.config import Config
import logging
from PIL import Image
import io
import uuid
from datetime import datetime

# Configurar logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class SupabaseClient:
    """Cliente singleton para Supabase"""
    
    _instance: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Obtiene la instancia del cliente Supabase"""
        if cls._instance is None:
            url = Config.SUPABASE_URL
            key = Config.SUPABASE_SERVICE_KEY or Config.SUPABASE_KEY
            
            logger.debug(f"Inicializando Supabase con URL: {url}")
            logger.debug(f"Service Key presente: {bool(Config.SUPABASE_SERVICE_KEY)}")
            
            if not url or not key:
                raise ValueError("SUPABASE_URL y SUPABASE_KEY/SUPABASE_SERVICE_KEY son requeridos")
            
            cls._instance = create_client(url, key)
            logger.info("Cliente Supabase inicializado correctamente")
        
        return cls._instance
    
    @classmethod
    def get_services(cls):
        """Obtiene todos los servicios"""
        try:
            client = cls.get_client()
            logger.debug("Consultando tabla 'services'...")
            response = client.table('services').select('*').order('display_order').execute()
            logger.debug(f"Servicios obtenidos: {len(response.data)} registros")
            return response.data
        except Exception as e:
            logger.error(f"Error al obtener servicios: {str(e)}", exc_info=True)
            raise
    
    @classmethod
    def get_service_by_id(cls, service_id):
        """Obtiene un servicio por ID"""
        try:
            client = cls.get_client()
            response = client.table('services').select('*').eq('id', service_id).single().execute()
            return response.data
        except Exception as e:
            logger.error(f"Error al obtener servicio {service_id}: {str(e)}")
            return None
    
    @classmethod
    def create_service(cls, data):
        """Crea un nuevo servicio"""
        client = cls.get_client()
        response = client.table('services').insert(data).execute()
        return response.data[0] if response.data else None
    
    @classmethod
    def update_service(cls, service_id, data):
        """Actualiza un servicio"""
        client = cls.get_client()
        response = client.table('services').update(data).eq('id', service_id).execute()
        return response.data[0] if response.data else None
    
    @classmethod
    def delete_service(cls, service_id):
        """Elimina un servicio"""
        client = cls.get_client()
        response = client.table('services').delete().eq('id', service_id).execute()
        return response.data
    
    @classmethod
    def get_reviews(cls):
        """Obtiene todas las reviews"""
        client = cls.get_client()
        response = client.table('reviews').select('*').order('date', desc=True).execute()
        return response.data
    
    @classmethod
    def get_review_by_id(cls, review_id):
        """Obtiene una review por ID"""
        client = cls.get_client()
        response = client.table('reviews').select('*').eq('id', review_id).execute()
        return response.data[0] if response.data else None
    
    @classmethod
    def create_review(cls, data):
        """Crea una nueva review"""
        client = cls.get_client()
        response = client.table('reviews').insert(data).execute()
        return response.data[0] if response.data else None
    
    @classmethod
    def update_review(cls, review_id, data):
        """Actualiza una review"""
        client = cls.get_client()
        response = client.table('reviews').update(data).eq('id', review_id).execute()
        return response.data[0] if response.data else None
    
    @classmethod
    def delete_review(cls, review_id):
        """Elimina una review"""
        client = cls.get_client()
        response = client.table('reviews').delete().eq('id', review_id).execute()
        return response.data
    
    @classmethod
    def get_social_links(cls):
        """Obtiene los enlaces de redes sociales"""
        client = cls.get_client()
        response = client.table('social_links').select('*').order('display_order').execute()
        return response.data
    
    @classmethod
    def update_social_link(cls, link_id, data):
        """Actualiza un enlace social"""
        client = cls.get_client()
        response = client.table('social_links').update(data).eq('id', link_id).execute()
        return response.data[0] if response.data else None
    
    @classmethod
    def upload_image(cls, bucket_name, file_path, file_data):
        """Sube una imagen a Supabase Storage"""
        client = cls.get_client()
        response = client.storage.from_(bucket_name).upload(file_path, file_data)
        return response
    
    @classmethod
    def process_and_upload_image(cls, file, folder='services'):
        """
        Procesa y sube una imagen a Supabase Storage
        
        Args:
            file: Archivo de Flask (werkzeug.datastructures.FileStorage)
            folder: Carpeta donde guardar (services, reviews, etc.)
            
        Returns:
            str: URL pública de la imagen subida
        """
        try:
            # Abrir imagen con Pillow
            img = Image.open(file.stream)
            
            # Convertir a RGB si es necesario (para PNG con transparencia)
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Redimensionar si es muy grande (máximo 1920px)
            max_size = 1920
            if img.width > max_size or img.height > max_size:
                img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            
            # Guardar en buffer como JPEG con calidad 85%
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=85, optimize=True)
            buffer.seek(0)
            
            # Generar nombre único
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_id = str(uuid.uuid4())[:8]
            filename = f"{folder}/{timestamp}_{unique_id}.jpg"
            
            # Subir a Supabase Storage
            client = cls.get_client()
            bucket_name = 'images'
            
            # Subir archivo
            response = client.storage.from_(bucket_name).upload(
                filename,
                buffer.getvalue(),
                file_options={"content-type": "image/jpeg"}
            )
            
            logger.debug(f"Imagen subida: {filename}")
            
            # Obtener URL pública
            public_url = client.storage.from_(bucket_name).get_public_url(filename)
            
            return public_url
            
        except Exception as e:
            logger.error(f"Error al procesar/subir imagen: {str(e)}")
            raise
    
    # ===== MÉTODOS DE ANALYTICS =====
    
    @classmethod
    def get_analytics_summary(cls):
        """Obtiene resumen general de analytics"""
        try:
            client = cls.get_client()
            
            # Total de eventos
            total_response = client.table('analytics_events').select('id', count='exact').execute()
            
            # Pageviews totales
            pageviews_response = client.table('analytics_events')\
                .select('id', count='exact')\
                .eq('event_type', 'pageview')\
                .execute()
            
            # Páginas únicas visitadas
            unique_pages_response = client.table('analytics_events')\
                .select('page')\
                .eq('event_type', 'pageview')\
                .execute()
            
            unique_pages = len(set([item['page'] for item in unique_pages_response.data]))
            
            return {
                'total_events': total_response.count,
                'total_pageviews': pageviews_response.count,
                'unique_pages': unique_pages
            }
        except Exception as e:
            logger.error(f"Error al obtener resumen de analytics: {str(e)}")
            return {'total_events': 0, 'total_pageviews': 0, 'unique_pages': 0}
    
    @classmethod
    def get_pageviews_by_day(cls, days=30):
        """Obtiene pageviews agrupados por día"""
        try:
            from datetime import datetime, timedelta
            
            client = cls.get_client()
            start_date = datetime.now() - timedelta(days=days)
            
            logger.debug(f"Consultando pageviews desde {start_date.isoformat()}")
            
            # Obtener todos los pageviews del período
            response = client.table('analytics_events')\
                .select('created_at')\
                .eq('event_type', 'pageview')\
                .gte('created_at', start_date.isoformat())\
                .order('created_at')\
                .execute()
            
            logger.debug(f"Se obtuvieron {len(response.data)} pageviews")
            
            # Agrupar por día
            daily_counts = {}
            for event in response.data:
                # Extraer solo la fecha (YYYY-MM-DD)
                date_str = event['created_at'][:10]
                daily_counts[date_str] = daily_counts.get(date_str, 0) + 1
            
            # Generar lista completa de días (incluso con 0 visitas)
            result = []
            current_date = start_date.date()
            end_date = datetime.now().date()
            
            while current_date <= end_date:
                date_str = current_date.isoformat()
                result.append({
                    'date': date_str,
                    'count': daily_counts.get(date_str, 0)
                })
                current_date += timedelta(days=1)
            
            logger.debug(f"Resultado final: {len(result)} días procesados")
            return result
            
        except Exception as e:
            logger.error(f"Error al obtener pageviews por día: {str(e)}", exc_info=True)
            return []
    
    @classmethod
    def get_top_pages(cls, limit=10):
        """Obtiene las páginas más visitadas"""
        try:
            client = cls.get_client()
            
            logger.debug("Consultando top páginas...")
            
            response = client.table('analytics_events')\
                .select('page')\
                .eq('event_type', 'pageview')\
                .execute()
            
            logger.debug(f"Se obtuvieron {len(response.data)} eventos de pageview")
            
            # Contar ocurrencias (filtrando valores vacíos o None)
            page_counts = {}
            for event in response.data:
                page = event.get('page')
                
                # Filtrar valores inválidos
                if page and page.strip():
                    page_counts[page] = page_counts.get(page, 0) + 1
            
            logger.debug(f"Páginas únicas encontradas: {len(page_counts)}")
            logger.debug(f"Páginas: {list(page_counts.keys())[:10]}")
            
            # Ordenar y limitar
            sorted_pages = sorted(page_counts.items(), key=lambda x: x[1], reverse=True)[:limit]
            
            result = [{'page': page, 'count': count} for page, count in sorted_pages]
            logger.debug(f"Top {len(result)} páginas: {result}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error al obtener top páginas: {str(e)}", exc_info=True)
            return []
    
    @classmethod
    def get_device_stats(cls):
        """Obtiene estadísticas por tipo de dispositivo"""
        try:
            client = cls.get_client()
            
            response = client.table('analytics_events')\
                .select('device')\
                .eq('event_type', 'pageview')\
                .execute()
            
            # Contar por dispositivo
            device_counts = {}
            for event in response.data:
                device = event.get('device', 'unknown')
                device_counts[device] = device_counts.get(device, 0) + 1
            
            return [{'device': device, 'count': count} for device, count in device_counts.items()]
            
        except Exception as e:
            logger.error(f"Error al obtener estadísticas de dispositivos: {str(e)}")
            return []
    
    @classmethod
    def get_traffic_origins(cls, limit=5):
        """Obtiene los orígenes de tráfico principales"""
        try:
            client = cls.get_client()
            
            response = client.table('analytics_events')\
                .select('origin')\
                .eq('event_type', 'pageview')\
                .execute()
            
            # Contar por origen
            origin_counts = {}
            for event in response.data:
                origin = event.get('origin', 'unknown')
                origin_counts[origin] = origin_counts.get(origin, 0) + 1
            
            # Ordenar y limitar
            sorted_origins = sorted(origin_counts.items(), key=lambda x: x[1], reverse=True)[:limit]
            
            return [{'origin': origin, 'count': count} for origin, count in sorted_origins]
            
        except Exception as e:
            logger.error(f"Error al obtener orígenes de tráfico: {str(e)}")
            return []
    
    @classmethod
    def get_public_url(cls, bucket_name, file_path):
        """Obtiene la URL pública de un archivo"""
        client = cls.get_client()
        response = client.storage.from_(bucket_name).get_public_url(file_path)
        return response
    
    @classmethod
    def delete_image(cls, bucket_name, file_path):
        """Elimina una imagen de Supabase Storage"""
        client = cls.get_client()
        response = client.storage.from_(bucket_name).remove([file_path])
        return response
    
    @classmethod
    def list_images(cls, bucket_name, folder=''):
        """
        Lista las imágenes de un bucket/carpeta
        
        Args:
            bucket_name: Nombre del bucket (ej: 'images')
            folder: Carpeta dentro del bucket (ej: 'services')
            
        Returns:
            list: Lista de imágenes con sus URLs públicas
        """
        try:
            client = cls.get_client()
            
            # Listar archivos en la carpeta
            response = client.storage.from_(bucket_name).list(folder)
            
            images = []
            for file in response:
                # Solo incluir archivos (no carpetas)
                if file.get('id'):
                    file_path = f"{folder}/{file['name']}" if folder else file['name']
                    public_url = client.storage.from_(bucket_name).get_public_url(file_path)
                    
                    images.append({
                        'name': file['name'],
                        'path': file_path,
                        'url': public_url,
                        'size': file.get('metadata', {}).get('size', 0),
                        'created_at': file.get('created_at', ''),
                        'updated_at': file.get('updated_at', '')
                    })
            
            logger.debug(f"Imágenes listadas: {len(images)} archivos")
            return images
            
        except Exception as e:
            logger.error(f"Error al listar imágenes: {str(e)}")
            return []
    
    # ========== CONFIGURACIONES / SETTINGS ==========
    
    @classmethod
    def get_setting(cls, key, default=None):
        """
        Obtiene una configuración del sistema
        
        Args:
            key: Clave de la configuración (ej: 'groq_api_key')
            default: Valor por defecto si no existe
            
        Returns:
            str: Valor de la configuración
        """
        try:
            client = cls.get_client()
            response = client.table('settings').select('value').eq('key', key).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]['value']
            return default
            
        except Exception as e:
            logger.error(f"Error al obtener setting '{key}': {str(e)}")
            return default
    
    @classmethod
    def set_setting(cls, key, value, description=None):
        """
        Guarda o actualiza una configuración del sistema
        
        Args:
            key: Clave de la configuración
            value: Valor a guardar
            description: Descripción opcional
            
        Returns:
            dict: Configuración guardada
        """
        try:
            client = cls.get_client()
            
            # Verificar si existe
            existing = client.table('settings').select('id').eq('key', key).execute()
            
            data = {
                'key': key,
                'value': value,
                'updated_at': datetime.now().isoformat()
            }
            
            if description:
                data['description'] = description
            
            if existing.data and len(existing.data) > 0:
                # Actualizar
                response = client.table('settings').update(data).eq('key', key).execute()
            else:
                # Insertar
                response = client.table('settings').insert(data).execute()
            
            logger.info(f"Setting '{key}' guardado correctamente")
            return response.data[0] if response.data else None
            
        except Exception as e:
            logger.error(f"Error al guardar setting '{key}': {str(e)}")
            raise
    
    @classmethod
    def get_all_settings(cls):
        """
        Obtiene todas las configuraciones del sistema
        
        Returns:
            dict: Diccionario con todas las configuraciones {key: value}
        """
        try:
            client = cls.get_client()
            response = client.table('settings').select('key, value').execute()
            
            settings = {}
            for item in response.data:
                settings[item['key']] = item['value']
            
            return settings
            
        except Exception as e:
            logger.error(f"Error al obtener configuraciones: {str(e)}")
            return {}

    @classmethod
    def log_ai_usage(cls, data):
        """
        Registra un evento de uso de IA (Groq)

        Args:
            data: dict con columnas de ai_usage_logs

        Returns:
            dict | None: registro insertado
        """
        try:
            client = cls.get_client()
            response = client.table('ai_usage_logs').insert(data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            logger.error(f"Error al registrar uso de IA: {str(e)}")
            return None

    @classmethod
    def get_recent_ai_usage(cls, limit=50):
        """Obtiene los últimos registros de uso de IA"""
        try:
            client = cls.get_client()
            response = client.table('ai_usage_logs')\
                .select('*')\
                .order('created_at', desc=True)\
                .limit(limit)\
                .execute()
            return response.data
        except Exception as e:
            logger.error(f"Error al obtener uso reciente de IA: {str(e)}")
            return []

    # ========== CONTENIDO PÁGINA NOSOTROS ==========

    ABOUT_KEYS = [
        'about_hero_title', 'about_hero_subtitle',
        'about_intro_text1', 'about_intro_text2',
        'about_services', 'about_brands', 'about_brands_description',
        'about_reasons', 'about_location_text',
        'about_mission', 'about_vision', 'about_values',
    ]

    @classmethod
    def get_about_content(cls):
        """
        Obtiene todo el contenido de la página Nosotros desde settings.
        Los campos JSON (services, brands, reasons, values) se deserializan.
        """
        import json
        try:
            client = cls.get_client()
            response = client.table('settings').select('key, value').like('key', 'about_%').execute()
            raw = {item['key']: item['value'] for item in response.data}

            # Deserializar JSON arrays
            for k in ('about_services', 'about_brands', 'about_reasons', 'about_values'):
                if raw.get(k):
                    try:
                        raw[k] = json.loads(raw[k])
                    except Exception:
                        pass

            return raw
        except Exception as e:
            logger.error(f"Error al obtener contenido About: {str(e)}")
            return {}

    @classmethod
    def save_about_content(cls, data: dict):
        """
        Guarda todos los campos about_* desde un dict.
        Los valores list/dict se serializan a JSON automáticamente.
        """
        import json
        for key, value in data.items():
            if not key.startswith('about_'):
                continue
            if isinstance(value, (list, dict)):
                value = json.dumps(value, ensure_ascii=False)
            cls.set_setting(key, value)
