-- =====================================================
-- MIGRACIÓN: Agregar campo image_url a services
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor para agregar
-- el campo de imagen a la tabla de servicios
-- =====================================================

-- Agregar columna image_url
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Comentario descriptivo
COMMENT ON COLUMN public.services.image_url IS 'URL pública de la imagen del servicio almacenada en Supabase Storage';

-- Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'services' AND column_name = 'image_url';
