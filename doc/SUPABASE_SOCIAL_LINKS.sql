-- =====================================================
-- Tabla de Redes Sociales
-- =====================================================
-- Esta tabla almacena los enlaces a redes sociales y plataformas
-- que se muestran en el Footer del sitio web.

-- 1. Crear la tabla
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,         -- Nombre de la red social (facebook, google_business, github, etc)
  display_name VARCHAR(100) NOT NULL,       -- Nombre para mostrar (ej: "Facebook", "Google My Business")
  url TEXT NOT NULL,                        -- URL del perfil/página
  icon_type VARCHAR(50) NOT NULL,           -- Tipo de icono (lucide-react o svg)
  icon_name VARCHAR(50),                    -- Nombre del icono si usa lucide-react (opcional)
  svg_path TEXT,                            -- Path del SVG si usa icono personalizado (opcional)
  display_order INTEGER NOT NULL DEFAULT 0,  -- Orden de visualización
  is_active BOOLEAN DEFAULT true,           -- Si está activo/visible
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Crear índice para mejorar las consultas
CREATE INDEX idx_social_links_order ON social_links(display_order);
CREATE INDEX idx_social_links_active ON social_links(is_active);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- 4. Crear política para acceso público (solo lectura)
CREATE POLICY "Permitir lectura pública de redes sociales"
  ON social_links
  FOR SELECT
  TO public
  USING (is_active = true);

-- 5. Insertar datos iniciales (Facebook, Google My Business, GitHub)
INSERT INTO social_links (name, display_name, url, icon_type, svg_path, display_order, is_active) VALUES
-- Facebook
(
  'facebook',
  'Facebook',
  'https://www.facebook.com/profile.php?id=61571858766068',
  'svg',
  'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  1,
  true
),

-- Google My Business
(
  'google_business',
  'Google My Business',
  'https://www.google.com/maps/place/TeleRayo+Electr%C3%B3nica/@40.302205,-3.7329539,17z/data=!3m1!4b1!4m6!3m5!1s0xd4227e48e4a52a5:0x1d0e7f1a2e0c4d4e!8m2!3d40.302205!4d-3.7329539!16s%2Fg%2F1tdc6qz8',
  'svg',
  'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
  2,
  true
),

-- GitHub
(
  'github',
  'GitHub',
  'https://github.com/getafeelectronic/miserviciotecnico',
  'svg',
  'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  3,
  true
);

-- 6. Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_social_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_social_links_updated_at();

-- =====================================================
-- Consultas útiles
-- =====================================================

-- Ver todas las redes sociales activas ordenadas
-- SELECT * FROM social_links WHERE is_active = true ORDER BY display_order;

-- Añadir una nueva red social (ejemplo con Instagram)
-- INSERT INTO social_links (name, display_name, url, icon_type, svg_path, display_order) VALUES
-- ('instagram', 'Instagram', 'https://instagram.com/tu_usuario', 'svg', 'M12 2.163c3.204 0 3.584.012 4.85.07...', 4);

-- Desactivar una red social sin eliminarla
-- UPDATE social_links SET is_active = false WHERE name = 'twitter';

-- Cambiar el orden de visualización
-- UPDATE social_links SET display_order = 1 WHERE name = 'github';

-- Actualizar URL de una red social
-- UPDATE social_links SET url = 'https://nueva-url.com' WHERE name = 'facebook';
