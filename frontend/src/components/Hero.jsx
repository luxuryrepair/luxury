'use client'

import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import useAnalytics from '@/hooks/useAnalytics'

export default function Hero() {
  const { trackClick } = useAnalytics()

  return (
    <section className="hero">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="hero-title">
            Reparación de <span className="highlight">Televisores</span> en Madrid
          </h1>
          <p className="hero-subtitle">
            Servicio técnico premium con más de 20 años de experiencia.
            Diagnóstico gratuito y garantía en todas nuestras reparaciones.
          </p>
          <div className="hero-buttons">
            <Link
              href="/contacto"
              className="btn btn-primary"
              onClick={() => trackClick('solicitar_presupuesto_hero', 'button')}
            >
              <Phone size={20} />
              Solicitar Presupuesto
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/servicios"
              className="btn btn-secondary"
              onClick={() => trackClick('ver_servicios_hero', 'button')}
            >
              Ver Servicios
            </Link>
          </div>

          <div className="hero-badges">
            <div className="badge">
              <span className="badge-icon">✓</span>
              <span className="badge-text">Diagnóstico Gratis</span>
            </div>
            <div className="badge">
              <span className="badge-icon">⚡</span>
              <span className="badge-text">Reparación Rápida</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🛡️</span>
              <span className="badge-text">Garantía Incluida</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src="https://opcdigtqxrmksmemnugs.supabase.co/storage/v1/object/public/images/cartel_aurea.png"
            alt="Reparación de televisores premium en Madrid"
            className="hero-image-real"
          />
        </motion.div>
      </div>
    </section>
  )
}
