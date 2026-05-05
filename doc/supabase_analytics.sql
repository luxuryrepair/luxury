-- ============================================
-- Tabla de Analytics (Pageviews y Eventos)
-- ============================================

-- Eliminar tabla si existe (solo para desarrollo)
DROP TABLE IF EXISTS analytics_events CASCADE;

-- Crear tabla de eventos de analytics
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Tipo de evento
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'pageview', 
    'duration', 
    'form_submit', 
    'conversion', 
    'click'
  )),
  
  -- Información de la página
  page VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  
  -- Información del dispositivo
  device VARCHAR(20) CHECK (device IN ('mobile', 'tablet', 'desktop')),
  screen_width INTEGER,
  screen_height INTEGER,
  user_agent TEXT,
  language VARCHAR(10),
  
  -- Información de origen del tráfico
  origin VARCHAR(50) CHECK (origin IN (
    'direct', 
    'google', 
    'bing', 
    'yahoo',
    'facebook', 
    'instagram', 
    'twitter', 
    'linkedin', 
    'whatsapp',
    'referral'
  )),
  referrer TEXT,
  
  -- Información geográfica
  country VARCHAR(10),
  country_name VARCHAR(100),
  city VARCHAR(100),
  region VARCHAR(100),
  timezone VARCHAR(100),
  
  -- Datos específicos por tipo de evento
  -- Para 'duration'
  duration_seconds INTEGER,
  
  -- Para 'form_submit'
  form_type VARCHAR(50),
  form_data JSONB,
  
  -- Para 'conversion'
  conversion_type VARCHAR(50),
  conversion_details JSONB,
  
  -- Para 'click'
  element_name VARCHAR(200),
  element_type VARCHAR(50),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Índices para mejorar el rendimiento de consultas
  CONSTRAINT valid_duration CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
);

-- ============================================
-- Índices para mejorar rendimiento
-- ============================================

-- Índice para consultas por tipo de evento
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);

-- Índice para consultas por página
CREATE INDEX idx_analytics_page ON analytics_events(page);

-- Índice para consultas por fecha
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);

-- Índice compuesto para consultas frecuentes
CREATE INDEX idx_analytics_type_date ON analytics_events(event_type, created_at DESC);

-- Índice para consultas por dispositivo
CREATE INDEX idx_analytics_device ON analytics_events(device);

-- Índice para consultas por origen
CREATE INDEX idx_analytics_origin ON analytics_events(origin);

-- Índice para consultas geográficas
CREATE INDEX idx_analytics_country ON analytics_events(country);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT a usuarios autenticados y anónimos
-- (para que el frontend pueda insertar sin autenticación)
CREATE POLICY "Permitir INSERT público en analytics_events"
ON analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Política: Permitir SELECT solo a usuarios autenticados
-- (para el dashboard de admin)
CREATE POLICY "Permitir SELECT autenticado en analytics_events"
ON analytics_events
FOR SELECT
TO authenticated
USING (true);

-- Política: NO permitir UPDATE ni DELETE a nadie
-- (los datos de analytics no deben modificarse)
-- Ya está implícito al no crear políticas para UPDATE/DELETE

-- ============================================
-- Comentarios de documentación
-- ============================================

COMMENT ON TABLE analytics_events IS 'Tabla para almacenar eventos de analytics del sitio web';
COMMENT ON COLUMN analytics_events.event_type IS 'Tipo de evento: pageview, duration, form_submit, conversion, click';
COMMENT ON COLUMN analytics_events.page IS 'Ruta de la página donde ocurrió el evento';
COMMENT ON COLUMN analytics_events.device IS 'Tipo de dispositivo: mobile, tablet, desktop';
COMMENT ON COLUMN analytics_events.origin IS 'Origen del tráfico: direct, google, facebook, etc.';
COMMENT ON COLUMN analytics_events.duration_seconds IS 'Tiempo de permanencia en segundos (solo para event_type=duration)';
COMMENT ON COLUMN analytics_events.form_type IS 'Tipo de formulario enviado (solo para event_type=form_submit)';
COMMENT ON COLUMN analytics_events.conversion_type IS 'Tipo de conversión: call, email, whatsapp (solo para event_type=conversion)';

-- ============================================
-- Vista para estadísticas agregadas
-- ============================================

CREATE OR REPLACE VIEW analytics_stats AS
SELECT 
  -- Totales
  COUNT(*) FILTER (WHERE event_type = 'pageview') as total_pageviews,
  COUNT(*) FILTER (WHERE event_type = 'conversion') as total_conversions,
  COUNT(*) FILTER (WHERE event_type = 'form_submit') as total_forms,
  
  -- Por dispositivo
  COUNT(*) FILTER (WHERE device = 'mobile') as mobile_views,
  COUNT(*) FILTER (WHERE device = 'tablet') as tablet_views,
  COUNT(*) FILTER (WHERE device = 'desktop') as desktop_views,
  
  -- Por origen
  COUNT(*) FILTER (WHERE origin = 'direct') as direct_traffic,
  COUNT(*) FILTER (WHERE origin = 'google') as google_traffic,
  COUNT(*) FILTER (WHERE origin IN ('facebook', 'instagram', 'twitter', 'linkedin', 'whatsapp')) as social_traffic,
  
  -- Tiempo promedio de permanencia
  AVG(duration_seconds) FILTER (WHERE event_type = 'duration') as avg_duration,
  
  -- Fecha
  DATE(created_at) as date
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

COMMENT ON VIEW analytics_stats IS 'Vista con estadísticas agregadas de analytics por día';

-- ============================================
-- Función para limpiar datos antiguos (opcional)
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Eliminar eventos mayores a 1 año
  DELETE FROM analytics_events
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  RAISE NOTICE 'Analytics antiguos eliminados';
END;
$$;

COMMENT ON FUNCTION cleanup_old_analytics IS 'Elimina eventos de analytics mayores a 1 año';

-- Para ejecutar la limpieza, llamar:
-- SELECT cleanup_old_analytics();

-- ============================================
-- Datos de prueba (opcional, comentar en producción)
-- ============================================

/*
INSERT INTO analytics_events (event_type, page, page_title, device, origin, country) VALUES
('pageview', '/home', 'Inicio | Mi Servicio Técnico', 'desktop', 'direct', 'ES'),
('pageview', '/servicios', 'Servicios | Mi Servicio Técnico', 'mobile', 'google', 'ES'),
('pageview', '/contacto', 'Contacto | Mi Servicio Técnico', 'mobile', 'facebook', 'ES'),
('form_submit', '/contacto', 'Contacto | Mi Servicio Técnico', 'desktop', 'google', 'ES'),
('conversion', '/contacto', 'Contacto | Mi Servicio Técnico', 'mobile', 'google', 'ES');
*/

-- ============================================
-- Verificación
-- ============================================

-- Verificar que la tabla se creó correctamente
SELECT 
  table_name, 
  table_type 
FROM information_schema.tables 
WHERE table_name = 'analytics_events';

-- Verificar las políticas RLS
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd 
FROM pg_policies 
WHERE tablename = 'analytics_events';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

-- Para ejecutar este script en Supabase:
-- 1. Ve a tu proyecto de Supabase
-- 2. SQL Editor → New Query
-- 3. Pega este código
-- 4. Click en "Run"
