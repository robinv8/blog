/**
 * Minimal markdown renderer for English translations.
 * Supports headings, paragraphs, lists, quotes, fenced code, horizontal rules.
 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineFormat(text) {
  let s = escapeHtml(text)
  // bold **x**
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // italic *x*
  s = s.replace(/(^|[^*])\*(?!\s)(.+?)(?!\s)\*(?!\*)/g, '$1<em>$2</em>')
  // inline code
  s = s.replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[0.9em]">$1</code>')
  // links [t](u)
  s = s.replace(
    /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline underline-offset-2">$1</a>'
  )
  return s
}

export default function MarkdownBody({ markdown }) {
  if (!markdown) return null
  const lines = String(markdown).replace(/\r\n/g, '\n').split('\n')
  const html = []
  let i = 0
  let inCode = false
  let codeLang = ''
  let codeBuf = []
  let listType = null // 'ul' | 'ol'
  let listBuf = []

  const flushList = () => {
    if (!listType || !listBuf.length) {
      listType = null
      listBuf = []
      return
    }
    const tag = listType
    html.push(
      `<${tag} class="my-4 pl-5 ${tag === 'ul' ? 'list-disc' : 'list-decimal'} space-y-1">` +
        listBuf.map((item) => `<li class="leading-relaxed">${inlineFormat(item)}</li>`).join('') +
        `</${tag}>`
    )
    listType = null
    listBuf = []
  }

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      if (!inCode) {
        flushList()
        inCode = true
        codeLang = line.slice(3).trim()
        codeBuf = []
      } else {
        html.push(
          `<pre class="my-5 overflow-x-auto rounded-lg bg-black/[0.04] dark:bg-white/[0.06] p-4 text-sm leading-relaxed"><code>${escapeHtml(
            codeBuf.join('\n')
          )}</code></pre>`
        )
        inCode = false
        codeBuf = []
        codeLang = ''
      }
      i++
      continue
    }

    if (inCode) {
      codeBuf.push(line)
      i++
      continue
    }

    if (!line.trim()) {
      flushList()
      i++
      continue
    }

    if (line === '---') {
      flushList()
      html.push('<hr class="my-8 border-ink-line" />')
      i++
      continue
    }

    if (line.startsWith('### ')) {
      flushList()
      html.push(`<h3 class="text-lg font-medium mt-8 mb-3 text-ink dark:text-ink-invert">${inlineFormat(line.slice(4))}</h3>`)
      i++
      continue
    }
    if (line.startsWith('## ')) {
      flushList()
      html.push(`<h2 class="text-xl font-medium mt-10 mb-3 text-ink dark:text-ink-invert">${inlineFormat(line.slice(3))}</h2>`)
      i++
      continue
    }
    if (line.startsWith('# ')) {
      flushList()
      html.push(`<h1 class="text-2xl font-medium mt-10 mb-4 text-ink dark:text-ink-invert">${inlineFormat(line.slice(2))}</h1>`)
      i++
      continue
    }

    if (line.startsWith('> ')) {
      flushList()
      html.push(
        `<blockquote class="my-4 border-l-2 border-ink-line pl-4 text-ink-soft italic">${inlineFormat(
          line.slice(2)
        )}</blockquote>`
      )
      i++
      continue
    }

    const ul = line.match(/^[-*]\s+(.+)$/)
    if (ul) {
      if (listType && listType !== 'ul') flushList()
      listType = 'ul'
      listBuf.push(ul[1])
      i++
      continue
    }
    const ol = line.match(/^\d+\.\s+(.+)$/)
    if (ol) {
      if (listType && listType !== 'ol') flushList()
      listType = 'ol'
      listBuf.push(ol[1])
      i++
      continue
    }

    // image placeholder skip empty
    if (line.startsWith('![') && line.includes('](')) {
      flushList()
      // skip bare placeholders without src
      const m = line.match(/!\[([^\]]*)\]\(([^)]*)\)/)
      if (m && m[2]) {
        html.push(
          `<figure class="my-6"><img src="${escapeHtml(m[2])}" alt="${escapeHtml(
            m[1] || ''
          )}" class="max-w-full rounded-lg" /></figure>`
        )
      }
      i++
      continue
    }

    flushList()
    html.push(`<p class="my-4 leading-[1.8] text-ink-soft dark:text-ink-soft">${inlineFormat(line)}</p>`)
    i++
  }
  flushList()
  if (inCode && codeBuf.length) {
    html.push(
      `<pre class="my-5 overflow-x-auto rounded-lg bg-black/[0.04] dark:bg-white/[0.06] p-4 text-sm"><code>${escapeHtml(
        codeBuf.join('\n')
      )}</code></pre>`
    )
  }

  return (
    <div
      className='markdown-body personal-home max-w-none'
      dangerouslySetInnerHTML={{ __html: html.join('\n') }}
    />
  )
}
