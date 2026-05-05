'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getSocialLinks, getFeaturedServices } from '@/lib/supabase'
import useBusinessInfo from '@/hooks/useBusinessInfo'
import packageJson from '../../package.json'

const logo = 'https://opcdigtqxrmksmemnugs.supabase.co/storage/v1/object/public/images/logo.svg'

const fallbackSocialLinks = [
  {
    name: 'facebook',
    display_name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61571858766068',
    svg_path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
  },
  {
    name: 'google_business',
    display_name: 'Google My Business',
    url: 'https://www.google.com/maps/place/TeleRayo+Electr%C3%B3nica/@40.302205,-3.7329539,17z',
    svg_path: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
  },
  {
    name: 'github',
    display_name: 'GitHub',
    url: 'https://github.com/getafeelectronic/miserviciotecnico',
    svg_path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
  }
]

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
      setSocialLinks(data && data.length > 0 ? data : fallbackSocialLinks)
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
          'https://api.github.com/repos/getafeelectronic/miserviciotecnico/releases/latest'
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
