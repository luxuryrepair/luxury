'use client'

import { Shield, Lock, Eye, Database, Mail, FileText } from 'lucide-react'
import useAnalytics from '@/hooks/useAnalytics'
import useBusinessInfo from '@/hooks/useBusinessInfo'

export default function PrivacyPolicy() {
  useAnalytics()
  const { business_email: email, business_phone: phone, business_address: address, phoneForCall } = useBusinessInfo()

  const lastUpdated = '28 de abril de 2026'

  return (
    <div className="privacy-policy">
      <div className="container">
        <div className="policy-header">
          <Shield size={48} className="policy-icon" />
          <h1 className="policy-title">Política de Privacidad</h1>
          <p className="last-updated">Última actualización: {lastUpdated}</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Introducción</h2>
            <p>En <strong>Mi Servicio Técnico</strong> nos comprometemos a proteger y respetar tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos tu información personal cuando utilizas nuestro sitio web y servicios.</p>
            <p>Al utilizar nuestro sitio web, aceptas las prácticas descritas en esta política.</p>
          </section>

          <section className="policy-section">
            <div className="section-icon-title">
              <Database size={24} />
              <h2>2. Información que Recopilamos</h2>
            </div>
            <h3>2.1. Información que proporcionas directamente</h3>
            <ul>
              <li><strong>Datos de contacto:</strong> Nombre completo, dirección de correo electrónico, número de teléfono</li>
              <li><strong>Consultas de servicio:</strong> Información sobre el problema de tu televisor, marca, modelo</li>
              <li><strong>Comunicaciones:</strong> Mensajes que nos envías a través de formularios de contacto</li>
            </ul>
            <h3>2.2. Información recopilada automáticamente</h3>
            <ul>
              <li><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia</li>
              <li><strong>Cookies y tecnologías similares:</strong> Utilizamos cookies para mejorar tu experiencia</li>
              <li><strong>Datos de dispositivo:</strong> Tipo de dispositivo, sistema operativo, resolución de pantalla</li>
            </ul>
          </section>

          <section className="policy-section">
            <div className="section-icon-title">
              <Eye size={24} />
              <h2>3. Cómo Usamos tu Información</h2>
            </div>
            <p>Utilizamos la información recopilada para:</p>
            <ul>
              <li><strong>Proporcionar servicios:</strong> Responder a tus consultas y solicitudes de servicio técnico</li>
              <li><strong>Comunicación:</strong> Enviarte presupuestos, confirmaciones de citas y actualizaciones de servicios</li>
              <li><strong>Mejora del sitio:</strong> Analizar el uso del sitio web para mejorar la experiencia del usuario</li>
              <li><strong>Cumplimiento legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
              <li><strong>Marketing:</strong> Enviarte información sobre promociones y nuevos servicios (solo con tu consentimiento)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Base Legal del Tratamiento</h2>
            <ul>
              <li><strong>Consentimiento:</strong> Has dado tu consentimiento explícito para el procesamiento</li>
              <li><strong>Ejecución de contrato:</strong> Necesario para la prestación de nuestros servicios</li>
              <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y proteger nuestro negocio</li>
              <li><strong>Obligación legal:</strong> Cumplimiento de leyes aplicables</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Compartir tu Información</h2>
            <p>No vendemos ni alquilamos tu información personal a terceros. Podemos compartir tu información con:</p>
            <ul>
              <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar nuestro negocio (hosting, email, análisis)</li>
              <li><strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger nuestros derechos</li>
              <li><strong>Transferencias empresariales:</strong> En caso de fusión, adquisición o venta de activos</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Cookies y Tecnologías de Rastreo</h2>
            <p>Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestro sitio web.</p>
            <h3>Tipos de cookies que utilizamos:</h3>
            <ul>
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio</li>
              <li><strong>Cookies de análisis:</strong> Nos ayudan a entender cómo los usuarios interactúan con el sitio</li>
              <li><strong>Cookies de marketing:</strong> Utilizadas para mostrar anuncios relevantes (solo con tu consentimiento)</li>
            </ul>
          </section>

          <section className="policy-section">
            <div className="section-icon-title">
              <Lock size={24} />
              <h2>7. Seguridad de los Datos</h2>
            </div>
            <p>Implementamos medidas técnicas y organizativas apropiadas para proteger tu información personal. Estas medidas incluyen:</p>
            <ul>
              <li>Cifrado SSL/TLS para transmisión de datos</li>
              <li>Almacenamiento seguro en servidores protegidos</li>
              <li>Acceso restringido solo a personal autorizado</li>
              <li>Revisiones periódicas de seguridad</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Tus Derechos (RGPD)</h2>
            <p>Bajo el Reglamento General de Protección de Datos (RGPD), tienes los siguientes derechos:</p>
            <ul>
              <li><strong>Derecho de acceso:</strong> Solicitar copia de tu información personal</li>
              <li><strong>Derecho de rectificación:</strong> Corregir información inexacta o incompleta</li>
              <li><strong>Derecho de supresión:</strong> Solicitar la eliminación de tu información ("derecho al olvido")</li>
              <li><strong>Derecho de limitación:</strong> Restringir el procesamiento de tu información</li>
              <li><strong>Derecho de portabilidad:</strong> Recibir tu información en un formato estructurado</li>
              <li><strong>Derecho de oposición:</strong> Oponerte al procesamiento de tu información</li>
            </ul>
            <p>Para ejercer cualquiera de estos derechos, contáctanos en <a href={`mailto:${email}`}>{email}</a></p>
          </section>

          <section className="policy-section">
            <h2>9. Retención de Datos</h2>
            <ul>
              <li><strong>Consultas de servicio:</strong> Hasta 2 años desde la última interacción</li>
              <li><strong>Datos de facturación:</strong> 7 años (requisito legal fiscal)</li>
              <li><strong>Datos de marketing:</strong> Hasta que retires tu consentimiento</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>10. Menores de Edad</h2>
            <p>Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos intencionalmente información personal de menores.</p>
          </section>

          <section className="policy-section">
            <h2>11. Enlaces a Sitios de Terceros</h2>
            <p>Nuestro sitio web puede contener enlaces a sitios de terceros. No somos responsables de las prácticas de privacidad de estos sitios.</p>
          </section>

          <section className="policy-section">
            <div className="section-icon-title">
              <FileText size={24} />
              <h2>12. Cambios a esta Política</h2>
            </div>
            <p>Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cambios significativos publicando la nueva política en esta página.</p>
          </section>

          <section className="policy-section policy-contact">
            <div className="section-icon-title">
              <Mail size={24} />
              <h2>13. Contacto</h2>
            </div>
            <p>Si tienes preguntas o deseas ejercer tus derechos, puedes contactarnos:</p>
            <div className="contact-info-box">
              <p><strong>Mi Servicio Técnico</strong></p>
              <p><strong>Email:</strong> <a href={`mailto:${email}`}>{email}</a></p>
              <p><strong>Teléfono:</strong> <a href={`tel:${phoneForCall}`}>{phone}</a></p>
              <p><strong>Dirección:</strong> {address}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
