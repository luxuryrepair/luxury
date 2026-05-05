-- Tabla para almacenar configuraciones del sistema
-- Incluye API keys y otras configuraciones sensibles

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    is_encrypted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por key
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(key);

-- Insertar configuración inicial para Groq API Key (vacía por seguridad)
INSERT INTO public.settings (key, value, description, is_encrypted)
VALUES 
    ('groq_api_key', '', 'API Key para Groq AI (generación de contenido)', true),
    ('groq_model', 'llama-3.3-70b-versatile', 'Modelo de Groq a utilizar', false),
    ('ai_generation_enabled', 'true', 'Habilitar/deshabilitar generación con IA', false)
ON CONFLICT (key) DO NOTHING;

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_updated_at 
    BEFORE UPDATE ON public.settings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE public.settings IS 'Configuraciones del sistema y API keys';
COMMENT ON COLUMN public.settings.key IS 'Identificador único de la configuración';
COMMENT ON COLUMN public.settings.value IS 'Valor de la configuración';
COMMENT ON COLUMN public.settings.is_encrypted IS 'Indica si el valor debe tratarse como sensible';
