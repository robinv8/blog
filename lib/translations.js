/**
 * English post translations from content/en/*.json
 * Loaded via filesystem from process.cwd() so it works under Next.js builds.
 */
import fs from 'fs'
import path from 'path'

const EN_DIR = path.join(process.cwd(), 'content', 'en')

let catalog = null

function safeSlug(slug) {
  return String(slug || '').replace(/[^\w\-\.]+/g, '_')
}

function loadCatalog() {
  if (catalog) return catalog
  catalog = {}
  try {
    if (!fs.existsSync(EN_DIR)) return catalog
    for (const file of fs.readdirSync(EN_DIR)) {
      if (!file.endsWith('.json')) continue
      try {
        const data = JSON.parse(fs.readFileSync(path.join(EN_DIR, file), 'utf8'))
        if (!data?.slug || !data?.title || !data?.markdown) continue
        catalog[data.slug] = data
        catalog[safeSlug(data.slug)] = data
        catalog[file.replace(/\.json$/, '')] = data
      } catch (e) {
        console.error('bad translation file', file, e.message)
      }
    }
  } catch (err) {
    console.error('Failed to load EN translations', err.message)
  }
  return catalog
}

export function getEnglishTranslation(slug) {
  if (!slug) return null
  const map = loadCatalog()
  return map[slug] || map[safeSlug(slug)] || null
}

export function hasEnglishTranslation(slug) {
  return Boolean(getEnglishTranslation(slug))
}

export function listEnglishTranslationSlugs() {
  const map = loadCatalog()
  const slugs = new Set()
  for (const v of Object.values(map)) {
    if (v?.slug) slugs.add(v.slug)
  }
  return [...slugs]
}

/**
 * EN locale: only posts with a translation file; overlay title/summary.
 * ZH locale: return posts unchanged.
 */
export function localizePosts(posts, locale) {
  if (!posts?.length) return []
  if (locale !== 'en') return posts

  const out = []
  for (const post of posts) {
    const tr = getEnglishTranslation(post.slug)
    if (!tr) continue
    out.push({
      ...post,
      title: tr.title,
      summary: tr.summary || post.summary,
      hasEnglishTranslation: true
    })
  }
  return out
}

export function localizePost(post, locale) {
  if (!post) return post
  if (locale !== 'en') return { ...post, translationMarkdown: null }
  const tr = getEnglishTranslation(post.slug)
  if (!tr) {
    return { ...post, translationMarkdown: null, missingTranslation: true }
  }
  return {
    ...post,
    sourceTitle: post.title,
    title: tr.title,
    summary: tr.summary || post.summary,
    translationMarkdown: tr.markdown,
    hasEnglishTranslation: true
  }
}
