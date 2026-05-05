'use client'

import { useState, useEffect } from 'react'
import { X, Cookie, Settings, Shield, BarChart3 } from 'lucide-react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setTimeout(() => setShowBanner(true), 1000)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
  }, [])

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true })
  }

  const handleRejectAll = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false })
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  const saveConsent = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs))
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
    setShowBanner(false)
    setShowSettings(false)
  }

  const togglePreference = (type) => {
    if (type === 'necessary') return
    setPreferences(prev => ({ ...prev, [type]: !prev[type] }))
  }

  if (!showBanner) return null

  return (
    <>
      <div className={`cookie-overlay ${showSettings ? 'active' : ''}`} />

      {!showSettings && (
        <div className="cookie-banner">
          <div className="cookie-banner-content">
            <div className="cookie-header">
              <Cookie size={28} className="cookie-icon" />
              <h3 className="cookie-title">Utilizamos cookies</h3>
            </div>

            <p className="cookie-text">
              Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación,
              analizar el tráfico del sitio y personalizar el contenido.
            </p>

            <div className="cookie-actions">
              <button onClick={handleRejectAll} className="btn-cookie btn-secondary">
                Rechazar todo
              </button>
              <button onClick={() => setShowSettings(true)} className="btn-cookie btn-settings">
                <Settings size={18} />
                Configurar
              </button>
              <button onClick={handleAcceptAll} className="btn-cookie btn-primary">
                Aceptar todo
              </button>
            </div>

            <p className="cookie-policy">
              Consulta nuestra{' '}
              <a href="/privacidad" rel="noopener noreferrer">
                Política de Privacidad
              </a>{' '}
              para más información.
            </p>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="cookie-settings-panel">
          <div className="cookie-settings-header">
            <h3 className="cookie-settings-title">Configuración de Cookies</h3>
            <button onClick={() => setShowSettings(false)} className="btn-close" aria-label="Cerrar">
              <X size={20} />
            </button>
          </div>

          <div className="cookie-settings-body">
            <p className="cookie-settings-description">
              Personaliza qué tipos de cookies deseas aceptar.
            </p>

            <div className="cookie-categories">
              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <Shield size={20} className="category-icon" />
                    <div>
                      <h4 className="category-title">Cookies Necesarias</h4>
                      <p className="category-description">Esenciales para el funcionamiento básico del sitio web. No se pueden desactivar.</p>
                    </div>
                  </div>
                  <div className="toggle-switch disabled">
                    <input type="checkbox" checked={true} disabled readOnly />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <BarChart3 size={20} className="category-icon" />
                    <div>
                      <h4 className="category-title">Cookies de Análisis</h4>
                      <p className="category-description">Nos ayudan a entender cómo los visitantes interactúan con el sitio.</p>
                    </div>
                  </div>
                  <div className="toggle-switch" onClick={() => togglePreference('analytics')}>
                    <input type="checkbox" checked={preferences.analytics} onChange={() => {}} />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>

              <div className="cookie-category">
                <div className="category-header">
                  <div className="category-info">
                    <Cookie size={20} className="category-icon" />
                    <div>
                      <h4 className="category-title">Cookies de Marketing</h4>
                      <p className="category-description">Se utilizan para mostrar anuncios relevantes y atractivos.</p>
                    </div>
                  </div>
                  <div className="toggle-switch" onClick={() => togglePreference('marketing')}>
                    <input type="checkbox" checked={preferences.marketing} onChange={() => {}} />
                    <span className="toggle-slider"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cookie-settings-footer">
            <button onClick={handleRejectAll} className="btn-cookie btn-secondary">
              Rechazar todo
            </button>
            <button onClick={handleSavePreferences} className="btn-cookie btn-primary">
              Guardar preferencias
            </button>
          </div>
        </div>
      )}
    </>
  )
}
