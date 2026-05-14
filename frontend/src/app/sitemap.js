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

function getGithubPagesFallback() {
  const repository = process.env.GITHUB_REPOSITORY || ''
  const [owner, repoName] = repository.split('/')

  if (!owner || !repoName) {
    return null
  }

  return {
    origin: `https://${owner}.github.io`,
    basePath: normalizePathPrefix(repoName),
  }
}

function getSiteConfig() {
  const ghFallback = getGithubPagesFallback()
  const siteUrlValue = process.env.NEXT_PUBLIC_SITE_URL || ghFallback?.origin || 'http://localhost:3000'

  let parsedUrl
  try {
    parsedUrl = new URL(siteUrlValue)
  } catch {
    parsedUrl = new URL('http://localhost:3000')
  }

  const urlPath = normalizePathPrefix(parsedUrl.pathname)
  const envBasePath = normalizePathPrefix(process.env.NEXT_PUBLIC_BASE_PATH)
  const basePath = envBasePath || urlPath || ghFallback?.basePath || ''

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