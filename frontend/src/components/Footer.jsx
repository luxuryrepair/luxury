'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSocialLinks, getFeaturedServices } from '@/lib/supabase'
import useBusinessInfo from '@/hooks/useBusinessInfo'
import packageJson from '../../package.json'

const logo = 'https://opcdigtqxrmksmemnugs.supabase.co/storage/v1/object/public/images/logo.svg'

const fallbackFeaturedServices = [
  { slug: 'reparacion-tv-lcd-led', title: 'Reparación TV LCD/LED' },
  { slug: 'reparacion-tv-plasma', title: 'Reparación TV Plasma' },
  { slug: 'diagnostico-gratuito', title: 'Diagnóstico Gratuito' }
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { business_phone, business_address, business_email, business_hours, phoneForCall } = useBusinessInfo()
  const [version, setVersion] = useState(packageJson.version)
  const [socialLinks, setSocialLinks] = useState([])
  const [loadingSocial, setLoadingSocial] = useState(true)
  const [featuredServices, setFeaturedServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)

  useEffect(() => {
    async function loadSocialLinks() {
      const data = await getSocialLinks()
      setSocialLinks(data && data.length > 0 ? data : [])
      setLoadingSocial(false)
    }

    async function loadFeaturedServices() {
      const data = await getFeaturedServices()
      setFeaturedServices(data && data.length > 0 ? data.slice(0, 3) : fallbackFeaturedServices)
      setLoadingServices(false)
    }

    async function fetchGitHubVersion() {
      try {
        const response = await fetch(
          'https://api.github.com/repos/luxuryrepair/luxury/releases/latest'
        )
        if (response.ok) {
          const data = await response.json()
          if (data.tag_name) {
            setVersion(data.tag_name.replace('v', ''))
          }
        }
      } catch {
        // mantener versión por defecto
      }
    }

    loadSocialLinks()
    loadFeaturedServices()
    fetchGitHubVersion()
  }, [])

  const businessAddress = business_address
  const businessEmail = business_email
  const businessHours = business_hours

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">
            <img src={logo} alt="Logo" className="footer-logo" />
          </h3>
          <p className="footer-description">
            Servicio técnico premium en reparación de televisores en Madrid.
            Más de 20 años de experiencia y garantía en todas nuestras reparaciones.
          </p>
          <div className="social-links">
            {loadingSocial ? (
              <>
                <div className="social-link-skeleton"></div>
                <div className="social-link-skeleton"></div>
                <div className="social-link-skeleton"></div>
              </>
            ) : (
              socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="social-link"
                  aria-label={social.display_name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.svg_path} />
                  </svg>
                </a>
              ))
            )}
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Enlaces Rápidos</h4>
          <ul className="footer-links">
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/servicios">Servicios</Link></li>
            <li><Link href="/contacto">Contacto</Link></li>
            <li><Link href="/nosotros">Sobre Nosotros</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Servicios</h4>
          <ul className="footer-links">
            {loadingServices ? (
              <>
                <li><div className="footer-link-skeleton"></div></li>
                <li><div className="footer-link-skeleton"></div></li>
                <li><div className="footer-link-skeleton"></div></li>
              </>
            ) : (
              featuredServices.map((service) => (
                <li key={service.slug}>
                  <Link href={`/servicios/${service.slug}`}>{service.title}</Link>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contacto</h4>
          <ul className="contact-info">
            <li>
              <MapPin size={18} />
              <span>{businessAddress}</span>
            </li>
            <li>
              <Phone size={18} />
              <a href={`tel:${phoneForCall || '+34123456789'}`}>{business_phone}</a>
            </li>
            <li>
              <Mail size={18} />
              <a href={`mailto:${businessEmail}`}>{businessEmail}</a>
            </li>
            <li>
              <Clock size={18} />
              <span>{businessHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">
            © {currentYear} Luxury Repair. Todos los derechos reservados.{' '}
            <span className="version">v{version}</span>
          </p>
          <div className="legal-links">
            <Link href="/privacidad">Política de Privacidad</Link>
            <Link href="/terminos">Términos de Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
