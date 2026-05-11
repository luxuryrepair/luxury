"""
Generador de contenido usando Groq AI
"""
from groq import Groq
from app.supabase_client import SupabaseClient
import logging

logger = logging.getLogger(__name__)

class AIContentGenerator:
    """Genera contenido para servicios usando Groq AI"""

    @classmethod
    def _register_usage(cls, model, title, success, prompt_tokens=0, completion_tokens=0, total_tokens=0, error_message=None):
        """Registra métricas de uso de IA sin bloquear el flujo principal."""
        SupabaseClient.log_ai_usage({
            'provider': 'groq',
            'model': model,
            'operation': 'generate_service_content',
            'success': success,
            'prompt_tokens': prompt_tokens,
            'completion_tokens': completion_tokens,
            'total_tokens': total_tokens,
            'error_message': error_message,
            'request_metadata': {'title': title}
        })
    
    @classmethod
    def get_groq_client(cls):
        """Obtiene el cliente de Groq configurado"""
        api_key = SupabaseClient.get_setting('groq_api_key')
        
        if not api_key:
            raise ValueError("API Key de Groq no configurada. Ve a Configuración para agregarla.")
        
        return Groq(api_key=api_key)
    
    @classmethod
    def generate_service_content(cls, title: str) -> dict:
        """
        Genera descripción corta y contenido completo para un servicio
        
        Args:
            title: Título del servicio (ej: "Reparación de Televisores")
            
        Returns:
            dict: {
                'description': 'Descripción corta (max 150 chars)',
                'long_description': 'Contenido HTML completo'
            }
        """
        model = None
        try:
            client = cls.get_groq_client()
            model = SupabaseClient.get_setting('groq_model', 'llama-3.3-70b-versatile')
            
            # Prompt para generar contenido
            prompt = f"""Eres un redactor experto en servicios técnicos de reparación de televisores todas las marcas.

Genera contenido profesional en español para el servicio: "{title}"

IMPORTANTE:
1. La descripción corta debe tener MÁXIMO 150 caracteres y minimo 100 caracteres
2. El contenido completo debe estar en HTML válido, bien estructurado
3. Usa etiquetas semánticas: <h2>, <h3>, <p>, <ul>, <li>, <strong>
4. El tono debe ser profesional pero cercano
5. Enfócate en beneficios para el cliente
6. Incluye información sobre garantía que es de 3 meses desde su reparación y calidad
7. El contenido debe ser original y no contener frases genéricas o clichés y con un minimo de 600 palabras y un máximo de 1200 palabras

Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{{
  "description": "Descripción corta aquí (max 150 caracteres)",
  "long_description": "<h2>Título Principal</h2><p>Contenido HTML aquí...</p>"
}}

NO agregues explicaciones adicionales, SOLO el JSON."""

            logger.info(f"Generando contenido para: {title}")
            
            # Llamada a Groq
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "Eres un asistente que genera contenido en formato JSON para servicios técnicos. Siempre respondes únicamente con JSON válido, sin texto adicional."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=model,
                temperature=0.7,
                max_tokens=2000,
                top_p=1,
                stream=False
            )
            
            # Extraer respuesta
            response_text = chat_completion.choices[0].message.content.strip()
            logger.debug(f"Respuesta de Groq: {response_text[:200]}...")

            # Extraer uso de tokens si está disponible
            usage = getattr(chat_completion, 'usage', None)
            prompt_tokens = getattr(usage, 'prompt_tokens', 0) or 0
            completion_tokens = getattr(usage, 'completion_tokens', 0) or 0
            total_tokens = getattr(usage, 'total_tokens', 0) or (prompt_tokens + completion_tokens)
            
            # Parsear JSON de la respuesta
            import json
            import re
            
            # Limpiar respuesta por si tiene markdown
            if response_text.startswith("```json"):
                response_text = response_text.replace("```json", "").replace("```", "").strip()
            elif response_text.startswith("```"):
                response_text = response_text.replace("```", "").strip()
            
            # SOLUCIÓN: Usar json.loads con strict=False para permitir control characters
            # O mejor aún, usar una regex para extraer solo el objeto JSON válido
            try:
                content = json.loads(response_text, strict=False)
            except json.JSONDecodeError:
                # Si falla, intentar limpiar saltos de línea dentro de strings
                # Buscar el JSON usando regex para ser más flexible
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    response_text = json_match.group(0)
                    content = json.loads(response_text, strict=False)
                else:
                    raise
            
            # Validar respuesta
            if 'description' not in content or 'long_description' not in content:
                raise ValueError("Respuesta de IA incompleta")
            
            # Asegurar límite de 150 caracteres en descripción
            if len(content['description']) > 150:
                content['description'] = content['description'][:147] + '...'

            cls._register_usage(
                model=model,
                title=title,
                success=True,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=total_tokens
            )
            
            logger.info(f"Contenido generado exitosamente para: {title}")
            return content
            
        except json.JSONDecodeError as e:
            logger.error(f"Error al parsear JSON de Groq: {str(e)}")
            logger.error(f"Respuesta recibida: {response_text}")
            cls._register_usage(
                model=model,
                title=title,
                success=False,
                error_message=f"JSONDecodeError: {str(e)}"
            )
            raise ValueError("La IA no generó contenido en formato válido. Intenta de nuevo.")
        
        except Exception as e:
            logger.error(f"Error al generar contenido: {str(e)}")
            cls._register_usage(
                model=model,
                title=title,
                success=False,
                error_message=str(e)
            )
            raise
    
    @classmethod
    def generate_about_content(cls, business_name: str = None) -> dict:
        """
        Genera todo el contenido de la página Nosotros usando IA.

        Returns:
            dict con claves: hero_title, hero_subtitle, intro_text1, intro_text2,
                             services (list), brands (list), reasons (list),
                             location_text, mission, vision,
                             values (list of {title, description})
        """
        import json, re

        model = None
        try:
            client = cls.get_groq_client()
            model = SupabaseClient.get_setting('groq_model', 'llama-3.3-70b-versatile')

            if not business_name:
                business_name = SupabaseClient.get_setting('business_name', 'Luxury Repair')

            prompt = f"""Eres un redactor experto en negocios de reparación de televisores.

Genera el contenido completo en español para la página "Sobre Nosotros" del negocio "{business_name}",
un servicio técnico especializado en reparación de televisores en Getafe (Madrid).

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{{
  "hero_title": "Título corto del hero (máx 40 chars)",
  "hero_subtitle": "Subtítulo del hero (máx 80 chars)",
  "intro_text1": "Primer párrafo de ¿Quiénes Somos? en HTML (puede incluir <strong>). Mínimo 80 palabras.",
  "intro_text2": "Segundo párrafo de ¿Quiénes Somos? en HTML. Mínimo 60 palabras.",
  "services": ["servicio 1", "servicio 2", "servicio 3", "servicio 4", "servicio 5", "servicio 6"],
  "brands": ["Marca1", "Marca2", "Marca3", "Marca4", "Marca5", "Marca6"],
  "brands_description": "Frase corta sobre las marcas con las que trabajamos (máx 100 chars)",
  "reasons": ["razón 1", "razón 2", "razón 3", "razón 4", "razón 5", "razón 6"],
  "location_text": "Texto corto sobre la cobertura geográfica en HTML (máx 120 chars)",
  "mission": "Texto de misión en HTML con <strong>. Mínimo 30 palabras.",
  "vision": "Texto de visión en HTML con <strong>. Mínimo 30 palabras.",
  "values": [
    {{"title": "Valor 1", "description": "Descripción breve del valor 1"}},
    {{"title": "Valor 2", "description": "Descripción breve del valor 2"}},
    {{"title": "Valor 3", "description": "Descripción breve del valor 3"}},
    {{"title": "Valor 4", "description": "Descripción breve del valor 4"}}
  ]
}}

NO agregues texto adicional fuera del JSON. Sé original, profesional y orientado al cliente."""

            logger.info(f"Generando contenido About para: {business_name}")

            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "Eres un asistente que genera contenido en JSON para páginas web. Respondes ÚNICAMENTE con JSON válido."},
                    {"role": "user", "content": prompt}
                ],
                model=model,
                temperature=0.7,
                max_tokens=3000,
                stream=False
            )

            response_text = chat_completion.choices[0].message.content.strip()

            # Limpiar markdown si lo hay
            if response_text.startswith("```"):
                response_text = re.sub(r'^```(?:json)?', '', response_text).rstrip('`').strip()

            try:
                content = json.loads(response_text, strict=False)
            except json.JSONDecodeError:
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    content = json.loads(json_match.group(0), strict=False)
                else:
                    raise

            # Registrar uso
            usage = getattr(chat_completion, 'usage', None)
            cls._register_usage(
                model=model,
                title=f"about/{business_name}",
                success=True,
                prompt_tokens=getattr(usage, 'prompt_tokens', 0) or 0,
                completion_tokens=getattr(usage, 'completion_tokens', 0) or 0,
                total_tokens=getattr(usage, 'total_tokens', 0) or 0
            )

            logger.info("Contenido About generado exitosamente")
            return content

        except Exception as e:
            logger.error(f"Error al generar contenido About: {str(e)}")
            cls._register_usage(model=model, title="about", success=False, error_message=str(e))
            raise

    @classmethod
    def is_enabled(cls) -> bool:
        """Verifica si la generación con IA está habilitada"""
        enabled = SupabaseClient.get_setting('ai_generation_enabled', 'true')
        api_key = SupabaseClient.get_setting('groq_api_key', '')
        
        return enabled.lower() == 'true' and bool(api_key)
