-- =====================================================
-- TABLA: services (Catálogo de Servicios)
-- =====================================================
-- Esta tabla gestiona el catálogo de servicios de reparación
-- que se muestran en la página de inicio y página de servicios.
-- 
-- Uso:
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Añade/edita servicios desde Table Editor
-- 3. Los cambios se reflejan automáticamente sin redeploy
-- =====================================================

-- 1. CREAR TABLA
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL, -- Descripción corta (cards)
    long_description TEXT, -- Contenido extenso para página de detalle (600-1000 palabras)
    icon_name VARCHAR(50) NOT NULL, -- Nombre del icono de lucide-react (ej: 'Tv', 'Wrench', 'BadgeCheck')
    is_featured BOOLEAN DEFAULT false, -- Si aparece en Home (preview) y Footer
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CREAR ÍNDICES (mejora el rendimiento de consultas)
CREATE INDEX IF NOT EXISTS idx_services_display_order 
    ON public.services(display_order);

CREATE INDEX IF NOT EXISTS idx_services_is_active 
    ON public.services(is_active);

CREATE INDEX IF NOT EXISTS idx_services_is_featured 
    ON public.services(is_featured);

-- 3. CONFIGURAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública solo de servicios activos
DROP POLICY IF EXISTS "Permitir lectura pública de servicios activos" ON public.services;
CREATE POLICY "Permitir lectura pública de servicios activos"
    ON public.services
    FOR SELECT
    USING (is_active = true);

-- 4. FUNCIÓN PARA ACTUALIZAR updated_at AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. CREAR TRIGGER
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar servicios iniciales con contenido extenso
INSERT INTO public.services (slug, title, description, long_description, icon_name, is_featured, display_order, is_active) VALUES
    ('reparacion-tv-lcd-led', 
     'Reparación TV LCD/LED', 
     'Reparamos todo tipo de televisores LCD y LED de todas las marcas. Diagnóstico profesional, repuestos originales y garantía incluida.', 
     'En nuestro servicio técnico especializado en Getafe, contamos con más de 10 años de experiencia en la reparación profesional de televisores LCD y LED de todas las marcas del mercado. Nuestro equipo técnico altamente cualificado diagnostica y repara problemas complejos con precisión y eficacia.

Los televisores LCD (Liquid Crystal Display) y LED (Light Emitting Diode) son la tecnología más común en los hogares españoles. Aunque son dispositivos robustos, con el tiempo pueden presentar fallos como pantallas oscuras, líneas verticales u horizontales, problemas de retroiluminación (backlight), fallos en la fuente de alimentación, o imagen congelada. Estos problemas no significan que debas comprar un televisor nuevo.

Nuestro servicio de diagnóstico gratuito identifica la causa exacta del problema. Los fallos más frecuentes incluyen:

**Problemas de retroiluminación LED**: Las tiras de LEDs que iluminan la pantalla pueden fallar con el tiempo. Sustituimos estos componentes con repuestos originales o de calidad equivalente, devolviendo el brillo y uniformidad a tu pantalla.

**Fallos en placas electrónicas**: La placa T-CON (Timing Control) procesa la señal de video. Cuando falla, aparecen líneas, distorsión de colores o pantalla en blanco. Reparamos o reemplazamos estas placas según sea necesario.

**Fuentes de alimentación defectuosas**: Si tu TV no enciende o se apaga sola, probablemente sea la fuente de alimentación. Disponemos de repuestos para Samsung, LG, Sony, Philips, Hisense y más marcas.

**Problemas de panel LCD**: Aunque menos frecuente, los paneles pueden dañarse por impactos o defectos de fabricación. Evaluamos si la reparación es viable económicamente.

Trabajamos con marcas como Samsung, LG, Sony, Philips, Panasonic, Sharp, Toshiba, Hisense, TCL y otras. Todas nuestras reparaciones incluyen garantía de 6 meses, respaldando la calidad de nuestro trabajo. Además, te asesoramos sobre el mantenimiento adecuado para prolongar la vida útil de tu televisor.

Nuestro compromiso es ofrecer soluciones rápidas y económicas. En muchos casos, reparar tu televisor cuesta una fracción del precio de uno nuevo, siendo además una opción más sostenible y ecológica. Contacta con nosotros para un presupuesto sin compromiso.',
     'Tv', 
     true, 
     1, 
     true),
    
    ('reparacion-tv-plasma', 
     'Reparación TV Plasma', 
     'Especialistas en solucionar problemas de televisores plasma. Experiencia en marcas como Samsung, LG, Panasonic y más.', 
     'Los televisores de plasma representaron una revolución en calidad de imagen durante años, ofreciendo negros profundos y ángulos de visión superiores. Aunque su fabricación cesó, millones de hogares aún conservan estos dispositivos de alta calidad. En nuestro servicio técnico de Getafe somos especialistas en mantener estos televisores funcionando perfectamente.

La tecnología plasma funciona mediante celdas individuales que contienen gas ionizado. Esta complejidad requiere conocimientos especializados para su reparación. Los problemas más comunes en televisores plasma incluyen:

**Fallos en las placas Y-SUS y Z-SUS**: Estas placas controlan las líneas verticales y horizontales del panel. Cuando fallan, aparecen líneas de colores, bandas oscuras o distorsión de imagen. Contamos con experiencia específica en la reparación de estas placas complejas.

**Problemas de alimentación**: Las fuentes de alimentación en televisores plasma manejan voltajes elevados y son propensas a fallos. Síntomas incluyen el TV que no enciende, parpadeos, o apagados inesperados. Diagnosticamos y reparamos estos componentes con precisión.

**Defectos de imagen**: Burn-in (imagen quemada), manchas, pérdida de brillo, o coloración incorrecta son problemas tratables. Evaluamos si la reparación es viable y ofrecemos soluciones realistas.

**Placa Main y procesamiento de señal**: Problemas de sincronización, falta de sonido, puertos HDMI defectuosos o menús que no responden suelen originarse en la placa principal. Reparamos o sustituimos estos componentes.

**Sobrecalentamiento**: Los plasmas generan mucho calor. Los ventiladores defectuosos o acumulación de polvo pueden causar apagados por protección térmica. Realizamos limpieza profunda y mantenimiento preventivo.

Trabajamos con todas las marcas principales de plasma: Panasonic (Viera), Samsung, LG, Pioneer (Kuro), Philips y más. Disponemos de un stock de componentes específicos para plasma, cada vez más difíciles de encontrar en el mercado.

Muchos propietarios de televisores plasma valoran la calidad de imagen única de esta tecnología. Si tu plasma está fallando, no lo descarte todavía. Nuestro diagnóstico gratuito determina si la reparación es rentable. En la mayoría de casos, reparar tu plasma cuesta significativamente menos que comprar un nuevo televisor de gama comparable.

Además del servicio de reparación, ofrecemos asesoramiento sobre el uso correcto para maximizar la vida útil: evitar imágenes estáticas prolongadas, configurar el brillo adecuadamente y mantener ventilación apropiada. Todas nuestras reparaciones en plasma incluyen garantía de 6 meses y soporte técnico posterior.',
     'Wrench', 
     true, 
     2, 
     true),
    
    ('garantia-incluida', 
     'Garantía Incluida', 
     'Todas nuestras reparaciones incluyen garantía de 6 meses. Trabajamos con repuestos de calidad para asegurar durabilidad.', 
     'La garantía es nuestro compromiso con la excelencia y calidad de servicio. Cuando confías en nosotros la reparación de tu televisor, no solo estás pagando por el trabajo inmediato, sino por la tranquilidad de saber que respaldamos completamente nuestro trabajo.

**Cobertura de 6 meses completos**: Todas las reparaciones que realizamos incluyen automáticamente una garantía de 6 meses. Esto cubre tanto la mano de obra como los repuestos instalados. Si el mismo problema reaparece durante este período, lo solucionamos sin coste adicional.

**¿Qué cubre nuestra garantía?**

La garantía incluye cualquier defecto relacionado con la reparación realizada: componentes defectuosos, problemas de soldadura, o fallos en las piezas instaladas. Si tu televisor presenta el mismo problema que reparamos, simplemente contáctanos y lo solucionaremos inmediatamente.

**Repuestos de calidad certificada**: Utilizamos exclusivamente repuestos originales cuando están disponibles, o componentes de fabricantes certificados de calidad equivalente. Nunca usamos piezas de dudosa procedencia que comprometan la durabilidad de la reparación. Esta política nos permite ofrecer garantías amplias con confianza.

**Excepciones razonables**: Como en cualquier garantía técnica, existen exclusiones lógicas. La garantía no cubre daños físicos nuevos (golpes, caídas, líquidos derramados), sobretensiones eléctricas externas, o uso inadecuado del equipo. Tampoco cubre problemas no relacionados con la reparación original.

**Proceso simple de reclamación**: Si necesitas hacer uso de la garantía, el proceso es sencillo. Contacta con nosotros por teléfono, WhatsApp o email indicando el problema. Revisaremos tu historial de reparación y programaremos la revisión. No hay papeleo complicado ni letra pequeña.

**Más allá de la garantía legal**: La normativa española obliga a ofrecer garantía en servicios técnicos, pero nosotros vamos más allá. Nuestros 6 meses superan muchos estándares del sector, porque confiamos en la calidad de nuestro trabajo.

**Historial de reparaciones documentado**: Mantenemos registro detallado de cada reparación: componentes sustituidos, diagnóstico realizado, y fecha de servicio. Esto facilita cualquier revisión futura y genera un historial técnico de tu equipo.

**Asesoramiento post-reparación incluido**: Durante el período de garantía, estamos disponibles para consultas técnicas sin cargo. Si tienes dudas sobre el funcionamiento, configuración, o mantenimiento de tu TV reparado, contáctanos.

**Transparencia total**: Antes de realizar cualquier reparación, explicamos exactamente qué cubre la garantía y qué no. No hay sorpresas ni condiciones ocultas. Nuestro objetivo es que tengas completa confianza en el servicio.

La garantía refleja nuestra filosofía de servicio al cliente. No queremos solo reparar tu televisor, queremos que quedes completamente satisfecho y que recomiendes nuestro servicio. Por eso respaldamos cada trabajo con esta sólida garantía que te protege y nos compromete a la excelencia.',
     'BadgeCheck', 
     true, 
     3, 
     true),
    
    ('diagnostico-gratuito', 
     'Diagnóstico Gratuito', 
     'Realizamos un diagnóstico completo y gratuito de tu televisor. Sin compromiso, te explicamos el problema y el presupuesto.', 
     'Entendemos que un televisor que no funciona genera frustración e incertidumbre. ¿Cuál es el problema? ¿Vale la pena repararlo? ¿Cuánto costará? Por eso ofrecemos un servicio de diagnóstico completamente gratuito y sin compromiso.

**¿En qué consiste nuestro diagnóstico gratuito?**

Nuestro proceso de diagnóstico es exhaustivo y profesional. Un técnico cualificado examina tu televisor utilizando equipamiento especializado para identificar la causa exacta del fallo. Esto incluye:

**Inspección visual completa**: Revisamos el exterior e interior del televisor buscando signos evidentes de daño, componentes quemados, o conexiones defectuosas.

**Pruebas eléctricas**: Medimos voltajes, corrientes y señales en diferentes puntos de las placas electrónicas. Esto identifica componentes defectuosos con precisión.

**Análisis de síntomas**: Estudiamos el comportamiento del televisor: ¿Enciende? ¿Qué hace exactamente? ¿El problema es intermitente o constante? Cada síntoma nos da pistas valiosas.

**Comprobación de componentes críticos**: Revisamos fuente de alimentación, placa T-CON, placa Main, retroiluminación, altavoces y otros elementos según los síntomas.

**Investigación de modelo específico**: Consultamos bases de datos técnicas para problemas conocidos de tu modelo específico de televisor. Muchas veces los fabricantes tienen fallos recurrentes en ciertos modelos.

**Informe detallado y transparente**:

Al finalizar el diagnóstico, te explicamos claramente:
- Qué componente está fallando
- Por qué ha fallado
- Qué implica la reparación
- Coste detallado (mano de obra + repuestos)
- Tiempo estimado de reparación
- Viabilidad económica (¿merece la pena vs comprar nuevo?)

**Presupuesto sin compromiso**:

El diagnóstico es totalmente gratuito. Recibes un presupuesto detallado por escrito. Tú decides si proceder con la reparación. Si decides no reparar, no pagas absolutamente nada por el diagnóstico. Sin costes ocultos, sin obligaciones.

**Asesoramiento honesto**:

Nuestra filosofía es la honestidad. Si descubrimos que la reparación no es rentable económicamente, te lo diremos directamente. No tiene sentido pagar 300€ por reparar un televisor cuyo reemplazo cuesta 350€ nuevo. Te asesoramos objetivamente sobre la mejor decisión.

**¿Cuándo es especialmente útil el diagnóstico gratuito?**

- Cuando tu TV presenta un fallo pero no sabes si es grave
- Si compraste el televisor hace pocos años y crees que debería durar más
- Cuando recibes presupuestos dispares de diferentes talleres
- Si el televisor es de gama alta y quieres una segunda opinión

**¿Cómo solicitarlo?**

Simplemente contáctanos por teléfono, WhatsApp, email o visita nuestro taller en Getafe. Traes tu televisor (o coordinamos recogida para modelos grandes) y programamos el diagnóstico. Generalmente obtienes resultados en 24-48 horas.

**Compromiso de servicio**:

Nuestro diagnóstico gratuito es realmente gratuito. No es una estrategia de ventas para presionarte a reparar. Es nuestro compromiso con la transparencia y servicio al cliente. Queremos que tomes decisiones informadas sobre tu televisor.',
     'Search', 
     false, 
     4, 
     true),
    
    ('reparacion-monitores', 
     'Reparación de Monitores', 
     'También reparamos monitores de ordenador LCD y LED. Solución rápida para problemas de imagen, alimentación y backlight.', 
     'Además de televisores, somos especialistas en reparación de monitores de ordenador LCD y LED. Los monitores son herramientas esenciales para trabajo, estudio y entretenimiento. Cuando fallan, tu productividad se ve afectada. Nuestro servicio técnico devuelve la vida a tu monitor rápidamente y a precios competitivos.

**Problemas comunes en monitores que reparamos**:

**Pantalla negra / Sin imagen**: Uno de los fallos más frecuentes. Puede deberse a fuente de alimentación defectuosa, problemas de retroiluminación, o fallo en la placa controladora. Nuestro diagnóstico identifica la causa exacta.

**Retroiluminación LED defectuosa**: Los LEDs que iluminan la pantalla pueden fallar parcial o totalmente. Síntomas incluyen pantalla muy oscura, iluminación desigual, o parpadeos. Sustituimos las tiras LED defectuosas restaurando el brillo original.

**Problemas de alimentación**: El monitor no enciende, se enciende el LED pero no hay imagen, o se apaga solo. Reparamos o reemplazamos fuentes de alimentación internas y adaptadores externos.

**Píxeles muertos o líneas**: Aunque los píxeles muertos individuales son difíciles de reparar, las líneas verticales u horizontales frecuentemente se deben a conexiones defectuosas en el cable Flat (LVDS) que une la placa controladora con el panel. Resoldamos o reemplazamos estos cables.

**Problemas de imagen**: Colores incorrectos, franjas de color, parpadeos, o distorsión pueden originarse en la placa T-CON o problemas de señal. Diagnosticamos y reparamos estos componentes electrónicos.

**Botones no funcionan**: Los botones físicos de control del monitor pueden desgastarse o el circuito fallar. Reparamos o sustituimos estos componentes.

**Puertos HDMI/DP/VGA defectuosos**: Los puertos de entrada pueden dañarse por conexiones/desconexiones frecuentes. Reemplazamos conectores individuales sin necesidad de cambiar toda la placa en muchos casos.

**Marcas y modelos que reparamos**:

Trabajamos con todas las marcas principales: Dell, HP, ASUS, Acer, BenQ, Samsung, LG, ViewSonic, Philips, AOC, Lenovo, MSI y más. Tanto monitores de oficina estándar como monitores gaming de gama alta, monitores profesionales 4K, y pantallas ultrawide.

**Diagnóstico rápido y preciso**:

Los monitores generalmente son más sencillos que los televisores debido a su diseño modular. Esto significa diagnósticos más rápidos y reparaciones frecuentemente más económicas. En muchos casos, tenemos el diagnóstico el mismo día.

**Repuestos específicos para monitores**:

Disponemos de fuentes de alimentación, placas controladoras, cables LVDS, inversores, y otros componentes específicos de monitores. Para modelos menos comunes, gestionamos la importación de repuestos específicos.

**¿Merece la pena reparar un monitor?**

Depende del modelo y el fallo. Monitores gaming de alta frecuencia (144Hz+), monitores 4K profesionales, o pantallas de gama alta (IPS de calidad) suelen merecer la reparación. Para monitores básicos antiguos, hacemos una evaluación económica honesta.

**Servicio express disponible**:

Para profesionales que necesitan su monitor funcionando urgentemente, ofrecemos servicio express. Si el repuesto está disponible, muchas reparaciones las completamos en 24 horas.

**Asesoramiento técnico incluido**:

Te asesoramos sobre configuración óptima, calibración de color, conexiones apropiadas, y cuidados para prolongar la vida útil de tu monitor. También evaluamos si tu monitor puede beneficiarse de una actualización de firmware.

**Garantía de 6 meses**:

Como todos nuestros servicios, las reparaciones de monitores incluyen garantía completa de 6 meses en mano de obra y repuestos instalados.

Contacta con nosotros para el diagnóstico gratuito de tu monitor. Te daremos un presupuesto claro y resolveremos el problema rápidamente para que puedas volver a trabajar sin interrupciones.',
     'Monitor', 
     false, 
     5, 
     true),
    
    ('venta-repuestos', 
     'Venta de Repuestos', 
     'Disponemos de repuestos originales y compatibles: fuentes de alimentación, placas T-Con, pantallas LED/LCD y más.', 
     'Para técnicos profesionales, aficionados al bricolaje electrónico, o quienes prefieren realizar reparaciones por su cuenta, ofrecemos venta de repuestos para televisores y monitores. Contamos con un amplio catálogo de componentes originales y compatibles de calidad certificada.

**Catálogo de repuestos disponibles**:

**Fuentes de alimentación (Power Supply)**: Disponemos de fuentes para la mayoría de marcas y modelos: Samsung, LG, Sony, Philips, Panasonic, Sharp, Toshiba, Hisense, TCL. Tanto fuentes universales como específicas de modelo. Incluyen certificaciones de seguridad CE.

**Placas T-CON (Timing Control)**: Estas placas procesan la señal de video y controlan el panel. Disponemos de T-CON para modelos populares y gestionamos pedidos específicos para modelos menos comunes. Todas probadas antes de la venta.

**Placas Main (Controladoras)**: La placa principal que gestiona todas las funciones del televisor. Disponemos de reemplazos para modelos frecuentes. Algunas incluyen actualización de firmware si es necesaria.

**Tiras LED de retroiluminación**: Conjuntos completos de tiras LED para múltiples modelos. Especificamos voltaje, número de LEDs, y longitud. Incluyen adhesivo pre-instalado para montaje sencillo. Compatibles con Samsung, LG, Sony, Philips y más.

**Inversores (para LCD CCFL antiguos)**: Aunque menos comunes, mantenemos stock de inversores para televisores LCD con tecnología CCFL (tubos fluorescentes). Ideal para modelos de hace 10-15 años aún en uso.

**Cables Flat (LVDS)**: Los cables internos que conectan placas entre sí. Disponibles en diferentes longitudes y configuraciones de pines. Esenciales cuando los originales presentan corrosión o daño.

**Mandos a distancia**: Reemplazos universales programables y específicos de marca. También reprogramamos mandos universales para trabajar con tu modelo específico.

**Conectores y puertos**: HDMI, VGA, USB, componentes de audio. Ideales para reparación de entradas defectuosas sin reemplazar toda la placa.

**Capacitores electrolíticos**: Uno de los componentes que más fallan con el tiempo. Stock de capacitores de diferentes valores y voltajes, ideales para reparación de fuentes y placas.

**Herramientas de apertura**: Kits de herramientas plásticas para desmontar televisores sin dañar carcasas. Ideales si es tu primera reparación.

**Ventajas de comprar con nosotros**:

**Asesoramiento técnico gratuito**: No solo vendemos el repuesto. Te asesoramos sobre compatibilidad, instalación, y diagnóstico previo. Si tienes dudas sobre qué componente necesitas, te ayudamos a identificarlo.

**Repuestos probados**: Todos los componentes electrónicos los probamos antes de vendértelos (cuando es técnicamente posible). Esto minimiza devoluciones por componentes defectuosos de origen.

**Garantía en repuestos**: Los repuestos vendidos incluyen garantía. Si un componente resulta defectuoso, lo reemplazamos sin coste.

**Servicio de identificación**: Si no sabes exactamente qué repuesto necesitas, trae una foto de tu placa o el número de modelo de tu TV. Identificamos el componente correcto.

**Gestión de pedidos especiales**: Si no tenemos un repuesto en stock, lo gestionamos. Trabajamos con proveedores internacionales especializados en componentes de TV. Tiempo de entrega típico: 7-15 días según origen.

**Precios competitivos**: Nuestros precios son justos y transparentes. Como profesionales, compramos directamente a distribuidores, lo que nos permite ofrecer precios mejores que plataformas genéricas de venta online.

**¿Eres técnico o aficionado al bricolaje?**

Si tienes conocimientos técnicos y prefieres reparar por ti mismo, respetamos esa decisión. Te vendemos el repuesto con gusto y te damos consejos técnicos sin coste. En nuestra opinión, reparar electrónica es un hobby fascinante y una habilidad valiosa.

**Servicio de instalación disponible**:

Si compras el repuesto pero luego decides que prefieres que lo instalemos nosotros, no hay problema. Ofrecemos servicio de instalación del componente comprado a precio reducido (solo mano de obra).

**¿No estás seguro de qué repuesto necesitas?**

Ofrece nuestro diagnóstico gratuito. Identificamos el componente defectuoso con certeza. Luego decides si compras el repuesto solo o contratas la reparación completa.

Visítanos personalmente en nuestro taller en Getafe, llámanos o contáctanos por WhatsApp/email. Te atendemos con asesoramiento profesional y honesto. Estamos aquí para ayudarte, seas profesional o aficionado al bricolaje electrónico.',
     'Package', 
     false, 
     6, 
     true);

-- =====================================================
-- CONSULTAS ÚTILES PARA GESTIÓN
-- =====================================================

-- Ver todos los servicios
-- SELECT * FROM services ORDER BY display_order;

-- Ver solo servicios destacados (mostrar en Home)
-- SELECT * FROM services WHERE is_featured = true AND is_active = true ORDER BY display_order;

-- Ver todos los servicios activos (página /servicios)
-- SELECT * FROM services WHERE is_active = true ORDER BY display_order;

-- Añadir nuevo servicio
-- INSERT INTO services (slug, title, description, icon_name, is_featured, display_order, is_active)
-- VALUES (
--     'nuevo-servicio',
--     'Título del Servicio',
--     'Descripción detallada del servicio.',
--     'Tv', -- Nombre del icono de lucide-react
--     false, -- ¿Mostrar en Home?
--     7, -- Orden de visualización
--     true
-- );

-- Editar servicio existente
-- UPDATE services 
-- SET title = 'Nuevo Título', description = 'Nueva descripción'
-- WHERE slug = 'reparacion-tv-lcd-led';

-- Cambiar orden de visualización
-- UPDATE services SET display_order = 10 WHERE slug = 'reparacion-tv-plasma';

-- Desactivar servicio (ocultarlo sin eliminarlo)
-- UPDATE services SET is_active = false WHERE slug = 'venta-repuestos';

-- Activar servicio
-- UPDATE services SET is_active = true WHERE slug = 'venta-repuestos';

-- Marcar/desmarcar como destacado (Home)
-- UPDATE services SET is_featured = true WHERE slug = 'diagnostico-gratuito';
-- UPDATE services SET is_featured = false WHERE slug = 'garantia-incluida';

-- =====================================================
-- ICONOS DISPONIBLES DE LUCIDE-REACT
-- =====================================================
-- Puedes usar cualquier icono de: https://lucide.dev/icons/
-- Ejemplos comunes:
--   'Tv', 'Monitor', 'Wrench', 'BadgeCheck', 'Search', 
--   'Package', 'Settings', 'Zap', 'Shield', 'DollarSign',
--   'Clock', 'Phone', 'Mail', 'MapPin', 'Star'
--
-- Para usar un nuevo icono en el frontend:
-- 1. Importa el icono en el componente: import { NombreIcono } from 'lucide-react';
-- 2. Mapea icon_name a componente React en un objeto
-- =====================================================
