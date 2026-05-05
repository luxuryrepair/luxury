-- =====================================================
-- TABLA: Registro de uso de Groq API en backend
-- =====================================================
-- Ejecuta este script en Supabase SQL Editor
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL DEFAULT 'groq',
    model VARCHAR(100),
    operation VARCHAR(100) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT true,
    prompt_tokens INTEGER NOT NULL DEFAULT 0,
    completion_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    request_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON public.ai_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_provider ON public.ai_usage_logs(provider);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_success ON public.ai_usage_logs(success);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura autenticada de uso IA" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Insercion autenticada de uso IA" ON public.ai_usage_logs;

CREATE POLICY "Lectura autenticada de uso IA"
    ON public.ai_usage_logs
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Insercion autenticada de uso IA"
    ON public.ai_usage_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
