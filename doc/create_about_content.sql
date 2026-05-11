-- =====================================================
-- MIGRACIÓN: Contenido dinámico de la página "Nosotros"
-- Se almacena en la tabla settings existente con claves about_*
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor
-- =====================================================

-- Habilitar RLS y permitir lectura pública solo de las claves about_*
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura pública de settings about" ON public.settings;

CREATE POLICY "Permitir lectura pública de settings about"
    ON public.settings
    FOR SELECT
    TO anon, authenticated
    USING (key LIKE 'about_%');

INSERT INTO public.settings (key, value, description) VALUES
  ('about_hero_title',    'Sobre Nosotros',                                                     'Título del hero en página Nosotros'),
  ('about_hero_subtitle', 'Tu servicio técnico de confianza en Madrid',                          'Subtítulo del hero en página Nosotros'),
  ('about_intro_text1',   'Somos un servicio técnico especializado en la <strong>reparación de televisores en Madrid</strong>, con una sólida trayectoria ofreciendo soluciones eficaces para todo tipo de averías.', 'Primer párrafo de ¿Quiénes Somos?'),
  ('about_intro_text2',   'Nuestro equipo técnico cuenta con amplia experiencia en la reparación de televisores de todas las tecnologías: <strong>LED, OLED, LCD, Plasma y Smart TV</strong>.', 'Segundo párrafo de ¿Quiénes Somos?'),
  ('about_services',      '["Reparación de televisores LED, OLED, LCD y Plasma","Servicio técnico especializado en Smart TV","Reparación de averías de imagen, sonido y placa base","Diagnóstico profesional con presupuesto sin compromiso","Servicio urgente","Reparación de televisores de todas las marcas"]', 'Lista de servicios (JSON array)'),
  ('about_brands',        '["Samsung","LG","Sony","Philips","Panasonic","Xiaomi"]',              'Marcas (JSON array)'),
  ('about_brands_description', 'Trabajamos con televisores de fabricantes reconocidos.',         'Descripción de la sección marcas'),
  ('about_reasons',       '["Atención personalizada y cercana","Técnicos cualificados y con experiencia","Precios competitivos y transparentes","Reparaciones rápidas y garantizadas","Uso de repuestos originales o de alta calidad","Alta tasa de éxito en reparaciones"]', 'Razones para elegirnos (JSON array)'),
  ('about_location_text', 'Ofrecemos cobertura en <strong>Madrid y municipios cercanos</strong>.', 'Texto de la sección localización'),
  ('about_mission',       'Proporcionar un servicio técnico de confianza que permita a nuestros clientes <strong>reparar sus televisores de forma económica</strong>.', 'Texto de Misión'),
  ('about_vision',        'Convertirnos en el <strong>servicio técnico de referencia en Madrid y el sur de la Comunidad</strong>.', 'Texto de Visión'),
  ('about_values',        '[{"title":"Profesionalidad","description":"Técnicos cualificados con amplia experiencia en el sector"},{"title":"Transparencia","description":"Precios claros y presupuestos sin compromiso"},{"title":"Compromiso","description":"Dedicación absoluta a la satisfacción del cliente"},{"title":"Rapidez","description":"Reparaciones eficientes en 24-48 horas"}]', 'Valores del negocio (JSON array con title y description)')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();
