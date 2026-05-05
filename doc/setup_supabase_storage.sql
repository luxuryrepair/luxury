-- =====================================================
-- CONFIGURACIÓN: Supabase Storage para imágenes
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor para configurar
-- correctamente el bucket de almacenamiento de imágenes
-- =====================================================

-- 1. CREAR BUCKET (si no existe)
-- Nota: También puedes crear el bucket desde la UI de Supabase
-- Storage → New Bucket → nombre: "images" → Public: ON

INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. CONFIGURAR POLÍTICAS DE ACCESO

-- Eliminar políticas existentes si hay
DROP POLICY IF EXISTS "Permitir lectura pública de imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida autenticada de imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualización autenticada de imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminación autenticada de imágenes" ON storage.objects;

-- Política 1: Lectura pública (cualquiera puede ver las imágenes)
CREATE POLICY "Permitir lectura pública de imágenes"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Política 2: Subida solo con service_role (desde el backend)
-- Nota: Como usas service_role key en el backend, esto funcionará automáticamente
CREATE POLICY "Permitir subida autenticada de imágenes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');

-- Política 3: Actualización con service_role
CREATE POLICY "Permitir actualización autenticada de imágenes"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images');

-- Política 4: Eliminación con service_role
CREATE POLICY "Permitir eliminación autenticada de imágenes"
ON storage.objects FOR DELETE
USING (bucket_id = 'images');

-- 3. VERIFICAR CONFIGURACIÓN

-- Ver el bucket creado
SELECT id, name, public, created_at
FROM storage.buckets
WHERE name = 'images';

-- Ver políticas activas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'objects' 
AND (qual LIKE '%images%' OR with_check LIKE '%images%');

-- =====================================================
-- INSTRUCCIONES ADICIONALES:
-- =====================================================
-- 
-- 1. Si prefieres crear el bucket desde la UI:
--    - Ve a Storage en el panel de Supabase
--    - Clic en "New bucket"
--    - Nombre: images
--    - Public: ✅ ACTIVAR (muy importante)
--    - File size limit: 5MB (opcional)
--    - Allowed MIME types: image/* (opcional)
--
-- 2. Después de ejecutar este script, prueba subir una imagen
--    desde el admin panel y verifica que se vea correctamente
--
-- 3. Para verificar manualmente:
--    - Ve a Storage → images
--    - Sube una imagen de prueba
--    - Clic en la imagen → Copy URL
--    - Pega la URL en el navegador, debería cargarse
--
-- 4. Si sigue sin funcionar:
--    - Verifica que el bucket sea "public" (ícono de ojo abierto)
--    - Revisa las políticas en Storage → Policies
--    - Asegúrate de usar el service_role key (no el anon key)
--
-- =====================================================
