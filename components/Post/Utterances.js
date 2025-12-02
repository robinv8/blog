import BLOG from '@/blog.config'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Utterances = ({ issueTerm, layout }) => {
  const router = useRouter()
  const { asPath } = router

  useEffect(() => {
    const theme =
      BLOG.appearance === 'auto'
        ? 'preferred-color-scheme'
        : BLOG.appearance === 'light'
          ? 'github-light'
          : 'github-dark'
    
    const anchor = document.getElementById('comments')
    if (!anchor) return

    // 清除之前的内容
    anchor.innerHTML = ''

    const script = document.createElement('script')
    script.setAttribute('src', 'https://utteranc.es/client.js')
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('async', true)
    script.setAttribute('repo', BLOG.comment.utterancesConfig.repo)
    // 使用 pathname 作为 issue-term，这样每篇文章对应一个 issue
    script.setAttribute('issue-term', issueTerm || asPath)
    script.setAttribute('theme', theme)
    script.setAttribute('label', 'comment')
    
    anchor.appendChild(script)

    return () => {
      if (anchor) {
        anchor.innerHTML = ''
      }
    }
  }, [asPath, issueTerm])
  return (
    <>
      <div
        id='comments'
        className={layout && layout === 'fullWidth' ? '' : ''}
      >
        <div className='utterances-frame'></div>
      </div>
    </>
  )
}

export default Utterances
