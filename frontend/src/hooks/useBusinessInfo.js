'use client'

import { useState, useEffect } from 'react'
import { getBusinessSettings } from '../lib/supabase'

const FALLBACK = {
  business_name:            '🏷️',
  business_email:           '🏷️',
  business_phone:           '🏷️',
  business_address:         '🏷️',
  business_hours:           '🏷️',
  business_coordinates_lat: '0',
  business_coordinates_lng: '0',
  business_maps_embed:      '',
}

/**
 * Hook que carga la información de negocio desde Supabase (tabla settings).
 * Mientras carga devuelve los valores de fallback para evitar parpadeos.
 */
export default function useBusinessInfo() {
  const [info, setInfo] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBusinessSettings().then((data) => {
      if (data && Object.keys(data).length > 0) {
        setInfo({ ...FALLBACK, ...data })
      }
      setLoading(false)
    })
  }, [])

  // Devuelve también el teléfono limpio (sin el texto de horario)
  const phoneForCall = info.business_phone.split('|')[0].trim()

  return { ...info, phoneForCall, loading }
}
