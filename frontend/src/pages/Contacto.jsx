'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import useAnalytics from '@/hooks/useAnalytics'
import useBusinessInfo from '@/hooks/useBusinessInfo'

export default function Contacto() {
  const { trackFormSubmit, trackConversion } = useAnalytics()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const {
    business_name: businessName,
    business_address: businessAddress,
    business_phone: businessPhoneRaw,
    business_email: businessEmail,
    business_hours: businessHours,
    business_maps_embed: businessMapsEmbed,
    phoneForCall: businessPhoneForCall,
  } = useBusinessInfo()

  const mapsEmbedSrc = businessMapsEmbed

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const legacyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const templateBusinessId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS_ID || legacyTemplateId
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateBusinessId || !publicKey ||
          serviceId.includes('tu_') || templateBusinessId.includes('tu_') || publicKey.includes('tu_')) {
        console.warn('EmailJS no está configurado. Simulando envío...')
        await new Promise(resolve => setTimeout(resolve, 1500))
        await trackFormSubmit('contact', { has_phone: !!data.telefono, subject: data.asunto, simulated: true })
        await trackConversion('contact_form', { source: 'contact_page', subject: data.asunto, simulated: true })
        setSubmitStatus('success')
        reset()
        setIsSubmitting(false)
        return
      }

      await emailjs.send(
        serviceId,
        templateBusinessId,
        {
          to_name: businessName,
          to_email: businessEmail,
          from_name: data.nombre,
          from_email: data.email,
          from_phone: data.telefono,
          user_phone: data.telefono,
          subject: data.asunto,
          user_subject: data.asunto,
          message: data.mensaje,
          user_message: data.mensaje,
          business_name: businessName,
          business_email: businessEmail,
          business_phone: businessPhoneRaw
        },
        publicKey
      )

      await trackFormSubmit('contact', { has_phone: !!data.telefono, subject: data.asunto })
      await trackConversion('contact_form', { source: 'contact_page', subject: data.asunto })
      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Error al enviar el formulario:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contacto">
      <div className="container">
        <div className="section-header">
          <h1 className="section-title">Contacta con Nosotros</h1>
          <p className="section-subtitle">
            ¿Necesitas reparar tu televisor? Estamos aquí para ayudarte.
            Rellena el formulario y te responderemos lo antes posible.
          </p>
        </div>

        <div className="contacto-grid">
          <div className="contacto-form-section">
            <div className="form-card">
              <h2 className="form-title">Envíanos un mensaje</h2>

              {submitStatus === 'success' && (
                <div className="alert alert-success">
                  <CheckCircle size={20} />
                  <p>¡Mensaje enviado correctamente! Te responderemos pronto.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="alert alert-error">
                  <AlertCircle size={20} />
                  <p>Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    id="nombre"
                    className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                    {...register('nombre', {
                      required: 'El nombre es obligatorio',
                      minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
                    })}
                  />
                  {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      {...register('email', {
                        required: 'El email es obligatorio',
                        pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email inválido' }
                      })}
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono" className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      className={`form-input ${errors.telefono ? 'input-error' : ''}`}
                      {...register('telefono', {
                        required: 'El teléfono es obligatorio',
                        pattern: { value: /^[0-9]{9}$/, message: 'Teléfono inválido (9 dígitos)' }
                      })}
                    />
                    {errors.telefono && <span className="error-message">{errors.telefono.message}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="asunto" className="form-label">Asunto</label>
                  <select
                    id="asunto"
                    className={`form-input ${errors.asunto ? 'input-error' : ''}`}
                    {...register('asunto', { required: 'Selecciona un asunto' })}
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="presupuesto">Solicitar presupuesto</option>
                    <option value="reparacion">Reparación de TV</option>
                    <option value="garantia">Consulta sobre garantía</option>
                    <option value="otro">Otro</option>
                  </select>
                  {errors.asunto && <span className="error-message">{errors.asunto.message}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="mensaje" className="form-label">Mensaje</label>
                  <textarea
                    id="mensaje"
                    rows="5"
                    className={`form-input ${errors.mensaje ? 'input-error' : ''}`}
                    {...register('mensaje', {
                      required: 'El mensaje es obligatorio',
                      minLength: { value: 10, message: 'El mensaje debe tener al menos 10 caracteres' }
                    })}
                  ></textarea>
                  {errors.mensaje && <span className="error-message">{errors.mensaje.message}</span>}
                </div>

                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><span className="spinner"></span>Enviando...</>
                  ) : (
                    <><Send size={20} />Enviar mensaje</>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="contacto-info-section">
            <div className="info-card">
              <h3 className="info-title">Información de contacto</h3>
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon"><MapPin size={20} /></div>
                  <div className="info-content">
                    <span className="info-label">Dirección</span>
                    <span className="info-value">{businessAddress}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><Phone size={20} /></div>
                  <div className="info-content">
                    <span className="info-label">Teléfono</span>
                    <a
                      href={`tel:${businessPhoneForCall || '+34123456789'}`}
                      className="info-value info-link"
                      onClick={() => trackConversion('phone_call', {
                        source: 'contact_page',
                        phone_number: businessPhoneRaw,
                      })}
                    >
                      {businessPhoneRaw}
                    </a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><Mail size={20} /></div>
                  <div className="info-content">
                    <span className="info-label">Email</span>
                    <a
                      href={`mailto:${businessEmail}`}
                      className="info-value info-link"
                      onClick={() => trackConversion('email', { source: 'contact_page' })}
                    >
                      {businessEmail}
                    </a>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon"><Clock size={20} /></div>
                  <div className="info-content">
                    <span className="info-label">Horario</span>
                    <span className="info-value">{businessHours}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="map-card">
              {mapsEmbedSrc ? (
                <iframe
                  src={mapsEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Ubicación en mapa de ${businessName}`}
                ></iframe>
              ) : (
                <div className="map-empty-state">
                  <p>Mapa no configurado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
