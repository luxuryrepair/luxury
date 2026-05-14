export const dynamic = 'force-static'

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

export default function robots() {
  const { origin } = getSiteConfig()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: withBasePath('/sitemap.xml'),
    host: origin,
  }
}