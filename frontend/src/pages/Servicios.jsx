'use client'

import { useState, useEffect } from 'react'
import {
  Tv, Monitor, Wrench, BadgeCheck, Search, Package,
  Settings, Zap, Shield, DollarSign, Clock, Phone
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { getServices } from '@/lib/supabase'
import useAnalytics from '@/hooks/useAnalytics'
import useBusinessInfo from '@/hooks/useBusinessInfo'

const iconMap = { Tv, Monitor, Wrench, BadgeCheck, Search, Package, Settings, Zap, Shield, DollarSign, Clock, Phone }

const fallbackServices = [
  { slug: 'reparacion-tv-lcd-led', title: 'Reparación TV LCD/LED', description: 'Reparamos todo tipo de televisores LCD y LED de todas las marcas. Diagnóstico profesional, repuestos originales y garantía incluida.', icon_name: 'Tv', display_order: 1 },
  { slug: 'reparacion-tv-plasma', title: 'Reparación TV Plasma', description: 'Especialistas en solucionar problemas de televisores plasma. Experiencia en marcas como Samsung, LG, Panasonic y más.', icon_name: 'Wrench', display_order: 2 },
  { slug: 'garantia-incluida', title: 'Garantía Incluida', description: 'Todas nuestras reparaciones incluyen garantía de 6 meses. Trabajamos con repuestos de calidad para asegurar durabilidad.', icon_name: 'BadgeCheck', display_order: 3 },
  { slug: 'diagnostico-gratuito', title: 'Diagnóstico Gratuito', description: 'Realizamos un diagnóstico completo y gratuito de tu televisor. Sin compromiso, te explicamos el problema y el presupuesto.', icon_name: 'Search', display_order: 4 },
  { slug: 'reparacion-monitores', title: 'Reparación de Monitores', description: 'También reparamos monitores de ordenador LCD y LED. Solución rápida para problemas de imagen, alimentación y backlight.', icon_name: 'Monitor', display_order: 5 },
  { slug: 'venta-repuestos', title: 'Venta de Repuestos', description: 'Disponemos de repuestos originales y compatibles: fuentes de alimentación, placas T-Con, pantallas LED/LCD y más.', icon_name: 'Package', display_order: 6 }
]

export default function Servicios() {
  useAnalytics()
  const { phoneForCall } = useBusinessInfo()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadServices() {
      const data = await getServices()
      setServices(data && data.length > 0 ? data : fallbackServices)
      setLoading(false)
    }
    loadServices()
  }, [])

  const renderIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Wrench
    return <IconComponent size={40} />
  }

  return (
    <div className="servicios-page">
      <section className="servicios-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="servicios-hero-content"
          >
            <h1 className="servicios-hero-title">Nuestros Servicios</h1>
            <p className="servicios-hero-subtitle">
              Soluciones profesionales de reparación con más de 10 años de experiencia
            </p>
          </motion.div>
        </div>
      </section>

      <section className="servicios-section">
        <div className="container">
          {loading ? (
            <div className="servicios-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="service-card-skeleton">
                  <div className="skeleton-icon"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-description"></div>
                  <div className="skeleton-description short"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="servicios-grid">
              {services.map((service, index) => (
                <motion.div
                  key={service.slug}
                  className="service-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/servicios/${service.slug}`} className="service-card-link">
                    {service.image_url && (
                      <div className="service-image">
                        <img src={service.image_url} alt={service.title} />
                      </div>
                    )}
                    <div className="service-card-content">
                      <div className="service-icon">{renderIcon(service.icon_name)}</div>
                      <h3 className="service-title">{service.title}</h3>
                      <p className="service-description">{service.description}</p>
                      <span className="service-read-more">Leer más →</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="servicios-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="cta-box">
              <h2 className="cta-title">¿Necesitas ayuda con tu televisor?</h2>
              <p className="cta-text">
                Contacta con nosotros para un diagnóstico gratuito y presupuesto sin compromiso
              </p>
              <div className="cta-buttons">
                <Link href="/contacto" className="btn btn-primary">
                  Solicitar Presupuesto
                </Link>
                <a href={`tel:${phoneForCall}`} className="btn btn-secondary">
                  <Phone size={20} />
                  Llamar Ahora
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
