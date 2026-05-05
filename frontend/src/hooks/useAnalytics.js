'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'

/**
 * Hook para enviar eventos de analytics directamente a Supabase
 *
 * Trackea automáticamente:
 * - Pageviews con tiempo de permanencia
 * - Dispositivo (mobile/tablet/desktop)
 * - Origen del tráfico
 * - Formularios completados
 * - Conversiones (llamadas, emails)
 */
const useAnalytics = () => {
  const pathname = usePathname()
  const pageLoadTime = useRef(0)
  const hasTrackedPageview = useRef(false)

  const getCurrentPage = () => {
    if (typeof window === 'undefined') return pathname
    const query = window.location.search
    return query ? `${pathname}${query}` : pathname
  }

  const getDeviceType = () => {
    if (typeof window === 'undefined') return 'unknown'
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  const getTrafficOrigin = () => {
    if (typeof document === 'undefined') return 'direct'
    const referrer = document.referrer

    if (!referrer) return 'direct'
    if (referrer.includes('facebook.com')) return 'facebook'
    if (referrer.includes('instagram.com')) return 'instagram'
    if (referrer.includes('twitter.com') || referrer.includes('t.co')) return 'twitter'
    if (referrer.includes('linkedin.com')) return 'linkedin'
    if (referrer.includes('whatsapp.com')) return 'whatsapp'
    if (referrer.includes('google.com')) return 'google'
    if (referrer.includes('bing.com')) return 'bing'
    if (referrer.includes('yahoo.com')) return 'yahoo'
    return 'referral'
  }

  const getGeolocation = () => {
    const timezone = typeof Intl !== 'undefined'
      ? (Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown')
      : 'Unknown'
    const language = typeof navigator !== 'undefined' ? (navigator.language || 'Unknown') : 'Unknown'
    const localeParts = language.split('-')
    const country = localeParts.length > 1 ? localeParts[1].toUpperCase() : 'Unknown'

    return {
      country,
      country_name: 'Unknown',
      city: 'Unknown',
      region: 'Unknown',
      timezone
    }
  }

  const sendEvent = async (eventData) => {
    if (!supabase) {
      console.warn('Supabase no configurado. Analytics deshabilitado.')
      return
    }

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert([eventData])

      if (error) {
        console.error('[Analytics] Error enviando evento a Supabase:', error)
      }
    } catch (error) {
      console.warn('[Analytics] Error de red al enviar analytics:', error)
    }
  }

  const trackPageview = useCallback(async () => {
    const geolocation = getGeolocation()
    const currentPage = getCurrentPage()

    await sendEvent({
      event_type: 'pageview',
      page: currentPage,
      page_title: typeof document !== 'undefined' ? document.title : '',
      device: getDeviceType(),
      origin: getTrafficOrigin(),
      referrer: typeof document !== 'undefined' ? (document.referrer || 'direct') : 'direct',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
      screen_height: typeof window !== 'undefined' ? window.innerHeight : 0,
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      ...geolocation
    })
  }, [pathname])

  const trackDuration = useCallback(async () => {
    const duration = Math.round((Date.now() - pageLoadTime.current) / 1000)
    const currentPage = getCurrentPage()

    if (duration >= 3) {
      await sendEvent({
        event_type: 'duration',
        page: currentPage,
        duration_seconds: duration,
        device: getDeviceType()
      })
    }
  }, [pathname])

  const trackFormSubmit = async (formType, formData = {}) => {
    const currentPage = getCurrentPage()

    await sendEvent({
      event_type: 'form_submit',
      form_type: formType,
      page: currentPage,
      device: getDeviceType(),
      form_data: formData
    })
  }

  const trackConversion = async (conversionType, details = {}) => {
    const currentPage = getCurrentPage()

    await sendEvent({
      event_type: 'conversion',
      conversion_type: conversionType,
      page: currentPage,
      device: getDeviceType(),
      conversion_details: details
    })
  }

  const trackClick = async (elementName, elementType = 'button') => {
    const currentPage = getCurrentPage()

    await sendEvent({
      event_type: 'click',
      element_name: elementName,
      element_type: elementType,
      page: currentPage,
      device: getDeviceType()
    })
  }

  useEffect(() => {
    pageLoadTime.current = Date.now()
    hasTrackedPageview.current = false

    trackPageview()
    hasTrackedPageview.current = true

    return () => {
      if (hasTrackedPageview.current) {
        trackDuration()
      }
    }
  }, [pathname, trackPageview, trackDuration])

  return {
    trackFormSubmit,
    trackConversion,
    trackClick,
    trackPageview,
    getDeviceType,
    getTrafficOrigin
  }
}

export default useAnalytics

