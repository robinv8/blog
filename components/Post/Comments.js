import BLOG from '@/blog.config'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { lang } from '@/lib/lang'

const UtterancesComponent = dynamic(
  () => {
    return import('@/components/Post/Utterances')
  },
  { ssr: false }
)
const SupaCommentsComponent = dynamic(
  () => {
    return import('@/components/Post/SupaComments')
  },
  { ssr: false }
)
const GiscusComponent = dynamic(
  () => {
    return import('@/components/Post/Giscus')
  },
  { ssr: false }
)

const Comments = ({ frontMatter }) => {
  const router = useRouter()
  const { locale } = router
  const t = lang[locale] || lang.zh

  if (!BLOG.comment || !BLOG.comment.provider) {
    return null
  }

  return (
    <div className='mt-12 pt-8 border-t border-gray-200 dark:border-gray-700'>
      <h2 className='text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200'>
        {t.LAYOUT.COMMENT_TITLE || '评论区'}
      </h2>
      {BLOG.comment.provider === 'utterances' && (
        <UtterancesComponent issueTerm={frontMatter.id} />
      )}
      {BLOG.comment.provider === 'supacomments' && (
        <SupaCommentsComponent />
      )}
      {BLOG.comment.provider === 'giscus' && (
        <GiscusComponent />
      )}
    </div>
  )
}

export default Comments
