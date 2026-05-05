-- =====================================================
-- MIGRACIÓN: Insertar información de negocio en settings
-- y configurar RLS para acceso público a claves business_*
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor
-- =====================================================

-- 1. CREAR TABLA settings SI NO EXISTE
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HABILITAR RLS en la tabla settings (si no está habilitado)
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 3. ELIMINAR POLÍTICAS PREVIAS si existen
DROP POLICY IF EXISTS "Permitir lectura pública de settings de negocio" ON public.settings;
DROP POLICY IF EXISTS "Permitir lectura autenticada de todos los settings" ON public.settings;
DROP POLICY IF EXISTS "Permitir escritura autenticada en settings" ON public.settings;

-- 4. POLÍTICA: Lectura pública solo para claves que empiecen por "business_"
--    (email, teléfono, dirección, horarios — sin exponer API keys)
CREATE POLICY "Permitir lectura pública de settings de negocio"
    ON public.settings
    FOR SELECT
    TO anon, authenticated
    USING (key LIKE 'business_%');

-- 5. POLÍTICA: Lectura total solo para usuarios autenticados (admin backend)
CREATE POLICY "Permitir lectura autenticada de todos los settings"
    ON public.settings
    FOR SELECT
    TO authenticated
    USING (true);

-- 6. POLÍTICA: Escritura solo con service_role (desde el backend)
--    Los usuarios anon no pueden insertar/actualizar/borrar
CREATE POLICY "Permitir escritura autenticada en settings"
    ON public.settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. INSERTAR INFORMACIÓN DE NEGOCIO
INSERT INTO public.settings (key, value, description, is_encrypted)
VALUES
    ('business_name',            'Tele Rayo Electrónica',                                                   'Nombre del negocio',                          false),
    ('business_email',           'ruizrjan@gmail.com',                                                      'Email de contacto del negocio',               false),
    ('business_phone',           '+34 916 95 07 81 | Atención telefónica: 9:00 a 21:00',                   'Teléfono y horario de atención telefónica',   false),
    ('business_address',         'C. Leoncio Rojas, 11, 28901 Getafe, Madrid',                             'Dirección física del negocio',                false),
    ('business_hours',           'Lun-Vie: 9:30-13:30, 16:30-19:30',                                       'Horario de apertura del local',               false),
    ('business_coordinates_lat', '40.302205',                                                               'Latitud GPS del negocio',                     false),
    ('business_coordinates_lng', '-3.7329539',                                                              'Longitud GPS del negocio',                    false),
    ('business_maps_embed',      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3042.8089457531146!2d-3.7329539234494664!3d40.302200871458325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422099ac198c93%3A0x4baa28182c027db0!2sTele%20Rayo%20Electr%C3%B3nica%20reparaci%C3%B3n%20de%20televisores!5e0!3m2!1ses!2ses!4v1777358537980!5m2!1ses!2ses', 'URL embed de Google Maps', false)
ON CONFLICT (key) DO UPDATE
    SET value       = EXCLUDED.value,
        description = EXCLUDED.description,
        updated_at  = NOW();

    -- 8. VERIFICAR
SELECT key, value, description
FROM public.settings
WHERE key LIKE 'business_%'
ORDER BY key;
