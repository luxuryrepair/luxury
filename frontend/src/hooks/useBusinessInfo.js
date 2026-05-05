'use client'

import { useState, useEffect } from 'react'
import { getBusinessSettings } from '../lib/supabase'

const FALLBACK = {
  business_name:            'Tele Rayo Electrónica',
  business_email:           'contacto@telerayo.com',
  business_phone:           '+34 916 95 07 81',
  business_address:         'C. Leoncio Rojas, 11, 28901 Getafe, Madrid',
  business_hours:           'Lun-Vie: 9:30-13:30, 16:30-19:30',
  business_coordinates_lat: '40.302205',
  business_coordinates_lng: '-3.7329539',
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
