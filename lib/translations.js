/**
 * English content helpers.
 * Prefer Notion pages with Lang=en (full blocks).
 * Fall back to content/en/*.json markdown translations.
 */
import fs from 'fs'
import path from 'path'

const EN_DIR = path.join(process.cwd(), 'content', 'en')

let fileCatalog = null

function safeSlug(slug) {
  return String(slug || '').replace(/[^\w\-\.]+/g, '_')
}

function loadFileCatalog() {
  if (fileCatalog) return fileCatalog
  fileCatalog = {}
  try {
    if (!fs.existsSync(EN_DIR)) return fileCatalog
    for (const file of fs.readdirSync(EN_DIR)) {
      if (!file.endsWith('.json')) continue
      try {
        const data = JSON.parse(fs.readFileSync(path.join(EN_DIR, file), 'utf8'))
        if (!data?.slug || !data?.title || !data?.markdown) continue
        fileCatalog[data.slug] = data
        fileCatalog[safeSlug(data.slug)] = data
      } catch (e) {
        console.error('bad translation file', file, e.message)
      }
    }
  } catch (err) {
    console.error('Failed to load EN translation files', err.message)
  }
  return fileCatalog
}

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
    // Untagged posts: treat as Chinese originals
    return key === 'zh'
  }
  const vals = Array.isArray(lang) ? lang : [lang]
  if (vals.some((v) => v === 'both' || v === 'all' || v === '双语')) return true
  if (key === 'en') return vals.some((v) => v === 'en' || v.startsWith('en'))
  return vals.some(
    (v) => v === 'zh' || v.startsWith('zh') || v === 'cn' || v === 'chinese' || v === '中文'
  )
}

export function getEnglishTranslation(slug) {
  if (!slug) return null
  const map = loadFileCatalog()
  return map[slug] || map[safeSlug(slug)] || null
}

export function hasEnglishTranslation(slug) {
  return Boolean(getEnglishTranslation(slug))
}

/**
 * Filter + localize post lists for a locale.
 * EN: Notion Lang=en posts first; if none, fall back to file translations overlaid on zh posts.
 * ZH: Notion Chinese posts (Lang=zh / both / untagged).
 */
export function localizePosts(posts, locale) {
  if (!posts?.length) return []

  if (locale !== 'en') {
    return posts.filter((p) => postMatchesLocale(p, 'zh'))
  }

  const notionEn = posts.filter((p) => postMatchesLocale(p, 'en'))
  if (notionEn.length) {
    // Prefer English Notion pages; drop Chinese duplicates by slug
    const bySlug = new Map()
    for (const p of notionEn) {
      if (!p.slug) continue
      // prefer explicit Lang=en over both
      const prev = bySlug.get(p.slug)
      const lang = getPostLang(p)
      const isEn = Array.isArray(lang) ? lang.includes('en') : lang === 'en'
      if (!prev || isEn) bySlug.set(p.slug, p)
    }
    return [...bySlug.values()].sort((a, b) => (b.date || 0) - (a.date || 0))
  }

  // Fallback: Chinese posts + file translations
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

/**
 * Resolve a single post for a slug + locale.
 */
export function resolvePostForLocale(posts, slug, locale) {
  const candidates = (posts || []).filter((p) => p.slug === slug)
  if (!candidates.length) return null

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
