-- Crear tabla reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  date VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar rendimiento en consultas ordenadas
CREATE INDEX IF NOT EXISTS idx_reviews_created_at 
  ON reviews(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública de todas las reviews
CREATE POLICY "Permitir lectura pública de reviews"
  ON reviews
  FOR SELECT
  USING (true);

-- Opcional: Política para permitir inserción autenticada
-- (Descomenta si quieres un formulario de reviews en el futuro)
-- CREATE POLICY "Permitir inserción autenticada"
--   ON reviews
--   FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');

-- Comentario de la tabla
COMMENT ON TABLE reviews IS 'Opiniones y testimonios de clientes del servicio técnico';

-- Insertar datos de ejemplo
INSERT INTO reviews (name, rating, text, date) VALUES
  ('María García', 5, 'Excelente servicio. Repararon mi TV en menos de 24 horas. Muy profesionales.', 'Hace 1 semana'),
  ('Carlos Ruiz', 5, 'Muy contentos con el trabajo realizado. Precio justo y trato excepcional.', 'Hace 2 semanas'),
  ('Ana Martínez', 5, 'Recomendable 100%. Mi TV LG quedó perfecta. Gracias!', 'Hace 1 mes'),
  ('Juan López', 5, 'Diagnóstico gratuito y reparación rápida. Muy satisfecho con el resultado.', 'Hace 3 semanas'),
  ('Laura Fernández', 5, 'Atención al cliente de 10. Explicaron todo el proceso claramente.', 'Hace 2 meses');