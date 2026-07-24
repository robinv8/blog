import BLOG from '@/blog.config'
import { pickLocale, normalizeLocale } from '@/lib/locale'
import Head from 'next/head'
import { useRouter } from 'next/router'

const SEO = ({ meta }) => {
  const router = useRouter()
  const locale = normalizeLocale(router.locale)
  const siteDescription = pickLocale(BLOG.description, locale)
  const description = meta.description
    ? pickLocale(meta.description, locale) || meta.description
    : siteDescription
  const title = meta.title || BLOG.title

  const ogImage = `https://${BLOG.ogImageGenerateHost}/api/default?logo=${
    BLOG.link
  }/favicon.png&siteName=${encodeURIComponent(
    BLOG.title?.trim()
  )}&description=${encodeURIComponent(
    siteDescription?.trim()
  )}&title=${encodeURIComponent(
    String(title).trim()
  )}&summary=${encodeURIComponent(
    String(description).trim()
  )}&theme=light&border=solid`

  const path = router.asPath?.split('?')[0] || '/'
  const base = BLOG.link.replace(/\/$/, '')
  // Next: defaultLocale zh has no prefix; en is /en/...
  const zhPath = path === '/' ? '' : path
  const enPath = path === '/' ? '/en' : `/en${path}`
  const canonical =
    locale === 'en' ? `${base}${enPath === '/en' ? '/en' : enPath}` : `${base}${zhPath || ''}`

  const ogLocale = locale === 'en' ? 'en_US' : 'zh_CN'

  return (
    <Head>
      <title>{title}</title>
      <html lang={locale === 'en' ? 'en' : 'zh-CN'} />
      <meta name='robots' content='follow, index' />
      <meta charSet='UTF-8' />
      {BLOG.seo.googleSiteVerification && (
        <meta
          name='google-site-verification'
          content={BLOG.seo.googleSiteVerification}
        />
      )}
      {BLOG.seo.keywords && (
        <meta name='keywords' content={BLOG.seo.keywords.join(', ')} />
      )}
      <meta name='description' content={description} />
      <link rel='canonical' href={meta.slug ? `${base}/${meta.slug}` : canonical} />
      <link rel='alternate' hrefLang='zh-CN' href={`${base}${zhPath || '/'}`} />
      <link rel='alternate' hrefLang='en' href={`${base}${enPath === '/en' ? '/en' : enPath}`} />
      <link rel='alternate' hrefLang='x-default' href={`${base}${zhPath || '/'}`} />
      <meta property='og:locale' content={ogLocale} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta
        property='og:url'
        content={meta.slug ? `${base}/${meta.slug}` : canonical}
      />
      <meta property='og:image' content={ogImage || BLOG.defaultCover} />
      <meta property='og:type' content={meta.type} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:image' content={ogImage || BLOG.defaultCover} />
      {meta.type === 'article' && (
        <>
          <meta property='article:published_time' content={meta.date} />
          <meta property='article:author' content={BLOG.author} />
        </>
      )}
    </Head>
  )
}

export default SEO
