export const dynamic = 'force-static'

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

export default function robots() {
  const { origin } = getSiteConfig()
  const sitemapUrl = withBasePath('/sitemap.xml')
  // Directiva Sitemap como primera línea, luego reglas y host
  return {
    sitemap: sitemapUrl,
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    host: origin,
  }
}