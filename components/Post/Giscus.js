import BLOG from '@/blog.config'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Giscus = () => {
  const router = useRouter()
  const { asPath } = router

  useEffect(() => {
    const theme =
      BLOG.appearance === 'auto'
        ? 'preferred_color_scheme'
        : BLOG.appearance === 'light'
          ? 'light'
          : 'dark'

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', BLOG.comment.giscusConfig.repo)
    script.setAttribute('data-repo-id', BLOG.comment.giscusConfig.repoId)
    script.setAttribute('data-category', BLOG.comment.giscusConfig.category)
    script.setAttribute('data-category-id', BLOG.comment.giscusConfig.categoryId)
    script.setAttribute('data-mapping', BLOG.comment.giscusConfig.mapping)
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', BLOG.comment.giscusConfig.reactionsEnabled)
    script.setAttribute('data-emit-metadata', BLOG.comment.giscusConfig.emitMetadata)
    script.setAttribute('data-input-position', BLOG.comment.giscusConfig.inputPosition)
    script.setAttribute('data-theme', theme)
    script.setAttribute('data-lang', BLOG.comment.giscusConfig.lang)
    script.setAttribute('crossorigin', BLOG.comment.giscusConfig.crossorigin)
    script.setAttribute('async', true)

    const anchor = document.getElementById('comments')
    if (anchor) {
      anchor.innerHTML = ''
      anchor.appendChild(script)
    }

    return () => {
      if (anchor) {
        anchor.innerHTML = ''
      }
    }
  }, [asPath])

  return (
    <div
      id='comments'
      className='mt-10'
    />
  )
}

export default Giscus

