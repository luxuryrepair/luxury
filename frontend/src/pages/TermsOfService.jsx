'use client'

import { FileText, AlertCircle, CheckCircle, XCircle, Scale, Mail } from 'lucide-react'
import Link from 'next/link'
import useAnalytics from '@/hooks/useAnalytics'
import useBusinessInfo from '@/hooks/useBusinessInfo'

export default function TermsOfService() {
  useAnalytics()
  const { business_name: businessName, business_email: email, business_phone: phone, business_address: address, business_hours: hours, phoneForCall } = useBusinessInfo()

  const lastUpdated = '28 de abril de 2026'

  return (
    <div className="terms-of-service">
      <div className="container">
        <div className="terms-header">
          <FileText size={48} className="terms-icon" />
          <h1 className="terms-title">Términos de Servicio</h1>
          <p className="last-updated">Última actualización: {lastUpdated}</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Aceptación de los Términos</h2>
            <p>Bienvenido a <strong>{businessName}</strong>. Al acceder y utilizar nuestro sitio web o contratar nuestros servicios de reparación de televisores, aceptas estar sujeto a estos Términos de Servicio.</p>
            <p>Nos reservamos el derecho de modificar estos términos en cualquier momento, y tu uso continuado constituye la aceptación de dichos cambios.</p>
          </section>

          <section className="terms-section">
            <h2>2. Descripción del Servicio</h2>
            <p><strong>{businessName}</strong> ofrece servicios profesionales de reparación y mantenimiento de televisores de diversas marcas y modelos, incluyendo:</p>
            <ul>
              <li>Reparación de televisores LCD, LED, Plasma, OLED y QLED</li>
              <li>Diagnóstico gratuito de averías</li>
              <li>Presupuestos sin compromiso</li>
              <li>Garantía en reparaciones</li>
              <li>Asesoramiento técnico</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Uso del Sitio Web</h2>
            <h3>3.1. Licencia de Uso</h3>
            <p>Te otorgamos una licencia limitada, no exclusiva, intransferible y revocable para acceder y usar nuestro sitio web con fines personales y no comerciales.</p>
            <h3>3.2. Restricciones de Uso</h3>
            <p>Al utilizar nuestro sitio web, aceptas NO:</p>
            <ul>
              <li>Utilizar el sitio para fines ilegales o no autorizados</li>
              <li>Intentar obtener acceso no autorizado a nuestros sistemas</li>
              <li>Transmitir virus, malware o código malicioso</li>
              <li>Recopilar información de otros usuarios sin su consentimiento</li>
              <li>Realizar ingeniería inversa o descompilar el sitio web</li>
              <li>Utilizar robots, scrapers o herramientas automatizadas sin permiso</li>
            </ul>
          </section>

          <section className="terms-section">
            <div className="section-icon-title">
              <CheckCircle size={24} />
              <h2>4. Proceso de Solicitud de Servicio</h2>
            </div>
            <h3>4.1. Solicitud y Diagnóstico</h3>
            <ul>
              <li>El cliente solicita el servicio mediante formulario web, teléfono o email</li>
              <li>Ofrecemos diagnóstico gratuito sin compromiso</li>
            </ul>
            <h3>4.2. Presupuesto y Aceptación</h3>
            <ul>
              <li>Proporcionamos un presupuesto detallado antes de iniciar la reparación</li>
              <li>El cliente debe aceptar el presupuesto para que procedamos con la reparación</li>
              <li>El presupuesto es válido por 7 días desde su emisión</li>
            </ul>
            <h3>4.3. Reparación</h3>
            <ul>
              <li>El tiempo estimado de reparación es de 24-48 horas (puede variar según la avería)</li>
              <li>Te notificaremos cuando el televisor esté listo para recoger</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Precios y Pago</h2>
            <h3>5.1. Precios</h3>
            <ul>
              <li>Todos los precios incluyen IVA (21%)</li>
              <li>El precio final es el acordado en el presupuesto aceptado</li>
            </ul>
            <h3>5.2. Métodos de Pago</h3>
            <ul>
              <li>Efectivo</li>
              <li>Transferencia bancaria (solo para empresas)</li>
            </ul>
            <h3>5.3. Condiciones de Pago</h3>
            <ul>
              <li>El pago se realiza al recoger el televisor reparado</li>
              <li>Si el cliente rechaza el presupuesto, no hay coste por el diagnóstico</li>
            </ul>
          </section>

          <section className="terms-section">
            <div className="section-icon-title">
              <CheckCircle size={24} />
              <h2>6. Garantía</h2>
            </div>
            <h3>6.1. Cobertura de Garantía</h3>
            <ul>
              <li><strong>Duración:</strong> 3 meses desde la fecha de reparación</li>
              <li><strong>Cobertura:</strong> Mano de obra y piezas instaladas</li>
              <li><strong>Condición:</strong> Solo cubre defectos relacionados con la reparación realizada</li>
            </ul>
            <h3>6.2. Exclusiones de Garantía</h3>
            <p>La garantía NO cubre:</p>
            <ul>
              <li>Daños causados por mal uso, negligencia o accidentes posteriores</li>
              <li>Daños por sobretensión eléctrica o descargas eléctricas</li>
              <li>Reparaciones realizadas por terceros no autorizados</li>
              <li>Desgaste normal del equipo</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. Responsabilidades y Limitaciones</h2>
            <h3>7.1. Responsabilidad del Cliente</h3>
            <ul>
              <li>Proporcionar información precisa sobre la avería</li>
              <li>Recoger el televisor en un plazo máximo de 30 días desde la notificación</li>
              <li>Realizar copias de seguridad de datos almacenados en Smart TV</li>
            </ul>
            <h3>7.2. Limitación de Responsabilidad</h3>
            <ul>
              <li>No nos hacemos responsables de pérdida de datos, configuraciones o ajustes personalizados</li>
              <li>Nuestra responsabilidad se limita al coste de la reparación realizada</li>
            </ul>
          </section>

          <section className="terms-section">
            <div className="section-icon-title">
              <AlertCircle size={24} />
              <h2>8. Recogida y Abandono de Equipos</h2>
            </div>
            <h3>8.1. Plazo de Recogida</h3>
            <ul>
              <li>El cliente dispone de <strong>30 días</strong> desde la notificación para recoger el televisor</li>
              <li>Transcurrido este plazo sin contacto del cliente, el equipo se considera abandonado</li>
            </ul>
            <h3>8.2. Equipos Abandonados</h3>
            <ul>
              <li>Enviaremos un recordatorio final por email/SMS</li>
              <li>Si no hay respuesta en 7 días adicionales, se aplicará una tarifa de almacenamiento de 5€/día</li>
              <li>Tras 60 días totales, nos reservamos el derecho de disponer del equipo</li>
            </ul>
          </section>

          <section className="terms-section">
            <div className="section-icon-title">
              <XCircle size={24} />
              <h2>9. Cancelaciones y Devoluciones</h2>
            </div>
            <h3>9.1. Cancelación antes de la Reparación</h3>
            <ul>
              <li>El cliente puede cancelar antes de aceptar el presupuesto sin coste</li>
              <li>Si se ha iniciado pedido de piezas, el cliente debe asumir el coste de las piezas encargadas</li>
            </ul>
            <h3>9.2. Devolución después de la Reparación</h3>
            <p>Según la ley de protección al consumidor, el cliente tiene <strong>14 días</strong> para desistir del servicio contratado.</p>
          </section>

          <section className="terms-section">
            <h2>10. Propiedad Intelectual</h2>
            <p>Todo el contenido del sitio web es propiedad de <strong>{businessName}</strong> o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual españolas e internacionales.</p>
          </section>

          <section className="terms-section">
            <h2>11. Protección de Datos Personales</h2>
            <p>El tratamiento de tus datos personales se rige por nuestra <Link href="/privacidad">Política de Privacidad</Link>, que forma parte integral de estos Términos de Servicio.</p>
          </section>

          <section className="terms-section">
            <div className="section-icon-title">
              <Scale size={24} />
              <h2>12. Resolución de Disputas</h2>
            </div>
            <h3>12.1. Ley Aplicable</h3>
            <p>Estos Términos de Servicio se rigen por las leyes de España. Cualquier disputa se someterá a la jurisdicción exclusiva de los tribunales de Madrid, España.</p>
            <h3>12.2. Resolución Amistosa</h3>
            <p>En caso de controversia, nos comprometemos a intentar resolver el conflicto de manera amistosa antes de recurrir a procedimientos legales.</p>
          </section>

          <section className="terms-section">
            <h2>13. Disposiciones Generales</h2>
            <h3>13.1. Modificaciones</h3>
            <p>Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento.</p>
            <h3>13.2. Divisibilidad</h3>
            <p>Si cualquier disposición de estos términos se considera inválida o inaplicable, las demás disposiciones seguirán siendo válidas.</p>
            <h3>13.3. Acuerdo Completo</h3>
            <p>Estos Términos de Servicio, junto con la Política de Privacidad, constituyen el acuerdo completo entre tú y <strong>{businessName}</strong>.</p>
          </section>

          <section className="terms-section terms-contact">
            <div className="section-icon-title">
              <Mail size={24} />
              <h2>14. Contacto</h2>
            </div>
            <p>Si tienes preguntas sobre estos Términos de Servicio, puedes contactarnos:</p>
            <div className="contact-info-box">
              <p><strong>{businessName}</strong></p>
              <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
              <p><strong>Teléfono:</strong> <a href={`tel:${phoneForCall}`}>{phone}</a></p>
              <p><strong>Dirección:</strong> {address}</p>
              <p><strong>Horario de atención:</strong> {hours}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
