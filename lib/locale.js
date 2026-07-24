/**
 * Pick localized string from { zh, en } map or plain string.
 */
export function pickLocale(value, locale = 'zh') {
  if (value == null) return ''
  if (typeof value === 'string') return value
  const key = locale === 'en' ? 'en' : 'zh'
  return value[key] || value.zh || value.en || ''
}

/** Normalize Next locale to zh | en */
export function normalizeLocale(locale) {
  return locale === 'en' ? 'en' : 'zh'
}

/**
 * If a Notion post has Lang / Language property, filter by locale.
 * Missing property → show in both languages (legacy posts).
 * Values: zh, en, both / all (case-insensitive; multi_select ok).
 */
export function filterPostsByLocale(posts, locale) {
  if (!posts?.length) return []
  const key = normalizeLocale(locale)
  return posts.filter((post) => {
    const raw =
      post.lang ?? post.Lang ?? post.language ?? post.Language ?? post.locale
    if (raw == null || raw === '') return true
    const vals = (Array.isArray(raw) ? raw : [raw]).map((v) =>
      String(v).trim().toLowerCase()
    )
    if (vals.some((v) => v === 'both' || v === 'all' || v === '双语')) return true
    if (key === 'en') {
      return vals.some((v) => v === 'en' || v.startsWith('en'))
    }
    return vals.some(
      (v) =>
        v === 'zh' ||
        v.startsWith('zh') ||
        v === 'cn' ||
        v === 'chinese' ||
        v === '中文'
    )
  })
}
