import { getServices } from '@/lib/supabase'

export const dynamic = 'force-static'

const fallbackServiceSlugs = [
  'reparacion-tv-lcd-led',
  'reparacion-tv-plasma',
  'garantia-incluida',
  'diagnostico-gratuito',
  'reparacion-monitores',
  'venta-repuestos',
]

function normalizePathPrefix(value = '') {
  const cleaned = String(value).trim().replace(/^\/+|\/+$/g, '')
  return cleaned ? `/${cleaned}` : ''
}

function getSiteConfig() {
  const siteUrlValue = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const parsedUrl = new URL(siteUrlValue)

  const urlPath = normalizePathPrefix(parsedUrl.pathname)
  const envBasePath = normalizePathPrefix(process.env.NEXT_PUBLIC_BASE_PATH)
  const basePath = envBasePath || urlPath

  return {
    origin: parsedUrl.origin,
    basePath,
  }
}

function withBasePath(path = '') {
  const { origin, basePath } = getSiteConfig()
  return `${origin}${basePath}${path}`
}

export default async function sitemap() {
  const now = new Date()

  const staticRoutes = [
    '/',
    '/servicios',
    '/nosotros',
    '/contacto',
    '/privacidad',
    '/terminos',
  ].map((path) => ({
    url: withBasePath(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.7,
  }))

  const services = await getServices()
  const serviceSlugs = services && services.length > 0
    ? services.filter((service) => service?.slug).map((service) => service.slug)
    : fallbackServiceSlugs

  const serviceRoutes = serviceSlugs.map((slug) => ({
    url: withBasePath(`/servicios/${slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...serviceRoutes]
}