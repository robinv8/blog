/**
 * English post helpers.
 * - Prefer Notion pages with Lang=en (rendered via notion blocks).
 * - Fall back to bundled file translations (lib/en-posts.generated.js).
 */
// Bundled at build time — reliable on Vercel (no fs path issues).
// eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
const fileCatalog = require('./en-posts.generated.js')

export function getPostLang(post) {
  const raw = post?.lang ?? post?.Lang ?? post?.language ?? post?.Language
  if (raw == null || raw === '') return null
  if (Array.isArray(raw)) {
    return raw.map((v) => String(v).toLowerCase())
  }
  return String(raw).toLowerCase()
}

export function postMatchesLocale(post, locale) {
  const key = locale === 'en' ? 'en' : 'zh'
  const lang = getPostLang(post)
  if (lang == null) {
    return key === 'zh'
  }
  const vals = Array.isArray(lang) ? lang : [lang]
  if (vals.some((v) => v === 'both' || v === 'all' || v === '双语')) return true
  if (key === 'en') return vals.some((v) => v === 'en' || v.startsWith('en'))
  return vals.some(
    (v) =>
      v === 'zh' ||
      v.startsWith('zh') ||
      v === 'cn' ||
      v === 'chinese' ||
      v === '中文'
  )
}

export function getEnglishTranslation(slug) {
  if (!slug) return null
  return fileCatalog[slug] || null
}

export function hasEnglishTranslation(slug) {
  return Boolean(getEnglishTranslation(slug))
}

export function listEnglishTranslationSlugs() {
  return Object.keys(fileCatalog || {})
}

/**
 * EN: Notion Lang=en pages if any; else Chinese posts overlaid with file translations.
 * ZH: Chinese Notion posts only.
 */
export function localizePosts(posts, locale) {
  if (!posts?.length) return []

  if (locale !== 'en') {
    return posts.filter((p) => postMatchesLocale(p, 'zh'))
  }

  const notionEn = posts.filter((p) => postMatchesLocale(p, 'en'))
  if (notionEn.length) {
    const bySlug = new Map()
    for (const p of notionEn) {
      if (!p.slug) continue
      const prev = bySlug.get(p.slug)
      const lang = getPostLang(p)
      const isEn = Array.isArray(lang) ? lang.includes('en') : lang === 'en'
      if (!prev || isEn) bySlug.set(p.slug, p)
    }
    return [...bySlug.values()].sort((a, b) => (b.date || 0) - (a.date || 0))
  }

  // File translation fallback
  const out = []
  for (const post of posts.filter((p) => postMatchesLocale(p, 'zh'))) {
    const tr = getEnglishTranslation(post.slug)
    if (!tr) continue
    out.push({
      ...post,
      title: tr.title,
      summary: tr.summary || post.summary,
      hasEnglishTranslation: true,
      useFileTranslation: true
    })
  }
  return out
}

export function resolvePostForLocale(posts, slug, locale) {
  const candidates = (posts || []).filter((p) => p.slug === slug)
  if (!candidates.length) {
    // Still allow pure file EN even if Notion list failed
    if (locale === 'en') {
      const tr = getEnglishTranslation(slug)
      if (tr) {
        return {
          post: {
            id: null,
            slug,
            title: tr.title,
            summary: tr.summary || '',
            date: tr.date ? new Date(tr.date).getTime() : Date.now(),
            type: ['Post'],
            tags: tr.tags || [],
            sourceTitle: tr.sourceTitle,
            translationMarkdown: tr.markdown,
            hasEnglishTranslation: true,
            useFileTranslation: true
          },
          source: 'file-en'
        }
      }
    }
    return null
  }

  if (locale === 'en') {
    const en = candidates.find((p) => postMatchesLocale(p, 'en'))
    if (en) return { post: en, source: 'notion-en' }

    const zh = candidates.find((p) => postMatchesLocale(p, 'zh')) || candidates[0]
    const tr = getEnglishTranslation(slug)
    if (tr) {
      return {
        post: {
          ...zh,
          sourceTitle: zh.title,
          title: tr.title,
          summary: tr.summary || zh.summary,
          translationMarkdown: tr.markdown,
          hasEnglishTranslation: true,
          useFileTranslation: true
        },
        source: 'file-en'
      }
    }
    return null
  }

  const zh = candidates.find((p) => postMatchesLocale(p, 'zh')) || candidates[0]
  return { post: zh, source: 'notion-zh' }
}

export function localizePost(post, locale) {
  if (!post) return post
  if (locale !== 'en') return { ...post, translationMarkdown: null }
  if (postMatchesLocale(post, 'en') && !post.useFileTranslation) {
    return { ...post, translationMarkdown: null }
  }
  const tr = getEnglishTranslation(post.slug)
  if (!tr) return { ...post, translationMarkdown: null, missingTranslation: true }
  return {
    ...post,
    sourceTitle: post.title,
    title: tr.title,
    summary: tr.summary || post.summary,
    translationMarkdown: tr.markdown,
    hasEnglishTranslation: true,
    useFileTranslation: true
  }
}
