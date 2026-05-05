/**
 * Cliente de Supabase
 *
 * Configuración centralizada para acceder a Supabase Database
 * desde la aplicación frontend.
 *
 * Variables de entorno requeridas:
 * - NEXT_PUBLIC_SUPABASE_URL: URL de tu proyecto Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Clave pública (anon) de tu proyecto
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Credenciales de Supabase no configuradas. ' +
    'Algunas funcionalidades pueden usar datos de fallback.'
  )
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Mantener sesión para rutas protegidas en Next.
        persistSession: true
      }
    })
  : null

/**
 * Obtener todas las reviews ordenadas por fecha de creación (más recientes primero)
 */
export async function getReviews() {
  if (!supabase) {
    console.warn('Cliente de Supabase no inicializado')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener reviews:', error)
      return null
    }

    return data || []
  } catch (err) {
    console.error('Error de red al obtener reviews:', err)
    return null
  }
}

/**
 * Obtener un número limitado de reviews destacadas
 */
export async function getFeaturedReviews(limit = 3) {
  if (!supabase) {
    console.warn('Cliente de Supabase no inicializado')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('rating', 5)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error al obtener reviews destacadas:', error)
      return null
    }

    return data || []
  } catch (err) {
    console.error('Error de red al obtener reviews destacadas:', err)
    return null
  }
}

/**
 * Obtener servicios destacados
 */
export async function getFeaturedServices() {
  if (!supabase) {
    console.warn('Cliente de Supabase no inicializado')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error al obtener servicios destacados:', error)
      return null
    }

    return data || []
  } catch (err) {
    console.error('Error de red al obtener servicios destacados:', err)
    return null
  }
}

/**
 * Obtener todos los servicios
 */
export async function getServices() {
  if (!supabase) {
    console.warn('Cliente de Supabase no inicializado')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error al obtener servicios:', error)
      return null
    }

    return data || []
  } catch (err) {
    console.error('Error de red al obtener servicios:', err)
    return null
  }
}

/**
 * Obtener un servicio por slug
 */
export async function getServiceBySlug(slug) {
  if (!supabase) {
    console.warn('Cliente de Supabase no inicializado')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (error) {
      console.error('Error al obtener servicio por slug:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Error de red al obtener servicio por slug:', err)
    return null
  }
}

/**
 * Obtener enlaces de redes sociales
 */
export async function getSocialLinks() {
  if (!supabase) {
    console.warn('Cliente de Supabase no inicializado')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error al obtener redes sociales:', error)
      return null
    }

    return data || []
  } catch (err) {
    console.error('Error de red al obtener redes sociales:', err)
    return null
  }
}

/**
 * Obtener configuración pública del negocio desde la tabla settings
 * Solo devuelve claves que empiezan por "business_"
 */
export async function getBusinessSettings() {
  if (!supabase) {
    console.warn('Cliente de Supabase no inicializado')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .like('key', 'business_%')

    if (error) {
      console.error('Error al obtener settings del negocio:', error)
      return null
    }

    // Convertir array [{key, value}] a objeto { business_email: '...', ... }
    return data.reduce((acc, row) => {
      acc[row.key] = row.value
      return acc
    }, {})
  } catch (err) {
    console.error('Error de red al obtener settings del negocio:', err)
    return null
  }
}
