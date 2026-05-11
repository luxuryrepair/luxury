'use client'

import { motion } from 'framer-motion'
import {
  Users, Target, Eye, Heart, Award, Wrench,
  Clock, Shield, MapPin, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import useAnalytics from '@/hooks/useAnalytics'
import { useState, useEffect } from 'react'
import { getAboutContent } from '@/lib/supabase'

// ─── Datos por defecto (fallback si la DB aún no tiene contenido) ───────────
const DEFAULTS = {
  about_hero_title: 'Sobre Nosotros',
  about_hero_subtitle: 'Tu servicio técnico de confianza en Getafe',
  about_intro_text1: 'Somos un servicio técnico especializado en la <strong>reparación de televisores en Getafe (Madrid)</strong>, con una sólida trayectoria ofreciendo soluciones eficaces para todo tipo de averías.',
  about_intro_text2: 'Nuestro equipo técnico cuenta con amplia experiencia en la reparación de televisores de todas las tecnologías: <strong>LED, OLED, LCD, Plasma y Smart TV</strong>.',
  about_services: [
    'Reparación de televisores LED, OLED, LCD y Plasma',
    'Servicio técnico especializado en Smart TV',
    'Reparación de averías de imagen, sonido y placa base',
    'Diagnóstico profesional con presupuesto sin compromiso',
    'Servicio urgente',
    'Reparación de televisores de todas las marcas',
  ],
  about_brands: ['Samsung', 'LG', 'Sony', 'Philips', 'Panasonic', 'Xiaomi'],
  about_brands_description: 'Trabajamos con televisores de fabricantes reconocidos.',
  about_reasons: [
    'Atención personalizada y cercana',
    'Técnicos cualificados y con experiencia',
    'Precios competitivos y transparentes',
    'Reparaciones rápidas y garantizadas',
    'Uso de repuestos originales o de alta calidad',
    'Alta tasa de éxito en reparaciones',
  ],
  about_location_text: 'Ofrecemos cobertura en <strong>Getafe y municipios cercanos</strong>.',
  about_mission: 'Proporcionar un servicio técnico de confianza que permita a nuestros clientes <strong>reparar sus televisores de forma económica</strong>.',
  about_vision: 'Convertirnos en el <strong>servicio técnico de referencia en Getafe y el sur de Madrid</strong>.',
  about_values: [
    { title: 'Profesionalidad', description: 'Técnicos cualificados con amplia experiencia en el sector' },
    { title: 'Transparencia', description: 'Precios claros y presupuestos sin compromiso' },
    { title: 'Compromiso', description: 'Dedicación absoluta a la satisfacción del cliente' },
    { title: 'Rapidez', description: 'Reparaciones eficientes en 24-48 horas' },
  ],
}

const VALUE_ICONS = [
  <Award className="value-icon" key="award" />,
  <Shield className="value-icon" key="shield" />,
  <Heart className="value-icon" key="heart" />,
  <Clock className="value-icon" key="clock" />,
]

export default function Nosotros() {
  const { trackClick } = useAnalytics()

  const [about, setAbout] = useState(DEFAULTS)

  useEffect(() => {
    getAboutContent().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setAbout({ ...DEFAULTS, ...data })
      }
    })
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  }

  const services = Array.isArray(about.about_services) ? about.about_services : DEFAULTS.about_services
  const brands   = Array.isArray(about.about_brands)   ? about.about_brands   : DEFAULTS.about_brands
  const reasons  = Array.isArray(about.about_reasons)  ? about.about_reasons  : DEFAULTS.about_reasons
  const values   = Array.isArray(about.about_values)   ? about.about_values   : DEFAULTS.about_values

  return (
    <div className="nosotros-page">
      <section className="nosotros-hero">
        <div className="nosotros-hero-content">
          <motion.h1
            className="nosotros-hero-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {about.about_hero_title}
          </motion.h1>
          <motion.p
            className="nosotros-hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {about.about_hero_subtitle}
          </motion.p>
        </div>
      </section>

      <section className="nosotros-intro">
        <div className="container">
          <motion.div className="intro-content" {...fadeInUp}>
            <div className="intro-icon"><Users size={48} /></div>
            <h2 className="section-title">¿Quiénes Somos?</h2>
            <p className="intro-text" dangerouslySetInnerHTML={{ __html: about.about_intro_text1 }} />
            <p className="intro-text" dangerouslySetInnerHTML={{ __html: about.about_intro_text2 }} />
          </motion.div>
        </div>
      </section>

      <section className="nosotros-services">
        <div className="container">
          <motion.div {...fadeInUp}>
            <div className="services-header">
              <Wrench size={40} />
              <h2 className="section-title">Servicios de Reparación</h2>
            </div>
            <div className="services-grid">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  className="service-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="service-bullet"></div>
                  <p>{service}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="nosotros-brands">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">Especialistas en Todas las Marcas</h2>
            <p className="brands-description">{about.about_brands_description}</p>
            <div className="brands-list">
              {brands.map((brand, index) => (
                <motion.div
                  key={index}
                  className="brand-badge"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {brand}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="nosotros-why">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="section-title">¿Por Qué Elegirnos?</h2>
            <div className="reasons-grid">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  className="reason-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="reason-check">✓</div>
                  <p>{reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="nosotros-location">
        <div className="container">
          <motion.div className="location-content" {...fadeInUp}>
            <MapPin size={40} />
            <h2 className="section-title">Servicio Comunidad de Madrid</h2>
            <p className="location-text" dangerouslySetInnerHTML={{ __html: about.about_location_text }} />
          </motion.div>
        </div>
      </section>

      <section className="nosotros-mvv">
        <div className="container">
          <div className="mvv-grid">
            <motion.div className="mvv-card" {...fadeInUp}>
              <Target size={48} />
              <h3>Nuestra Misión</h3>
              <p dangerouslySetInnerHTML={{ __html: about.about_mission }} />
            </motion.div>

            <motion.div className="mvv-card" {...fadeInUp} transition={{ delay: 0.2 }}>
              <Eye size={48} />
              <h3>Visión</h3>
              <p dangerouslySetInnerHTML={{ __html: about.about_vision }} />
            </motion.div>

            <motion.div className="mvv-card values-card" {...fadeInUp} transition={{ delay: 0.4 }}>
              <TrendingUp size={48} />
              <h3>Valores</h3>
              <div className="values-list">
                {values.map((value, index) => (
                  <div key={index} className="value-item">
                    {VALUE_ICONS[index % VALUE_ICONS.length]}
                    <div>
                      <h4>{value.title}</h4>
                      <p>{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="nosotros-cta">
        <div className="container">
          <motion.div className="cta-content" {...fadeInUp}>
            <h2>¿Necesitas reparar tu televisor?</h2>
            <p>Contacta con nosotros para un diagnóstico gratuito y sin compromiso</p>
            <Link
              href="/contacto"
              className="cta-button"
              onClick={() => trackClick('solicitar_presupuesto_nosotros', 'button')}
            >
              Solicitar Presupuesto Gratis
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
