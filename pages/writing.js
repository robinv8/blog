import Container from '@/components/Container'
import FormattedDate from '@/components/Common/FormattedDate'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'
import { lang } from '@/lib/lang'
import { localizePosts } from '@/lib/translations'
import Link from 'next/link'
import { useRouter } from 'next/router'

export async function getStaticProps({ locale }) {
  const all = await getAllPosts({ onlyPost: true })
  const posts = localizePosts(all, locale)
  const postsToShow = posts.slice(0, BLOG.postsPerPage)
  const showNext = posts.length > BLOG.postsPerPage
  return {
    props: {
      page: 1,
      postsToShow,
      showNext
    },
    revalidate: 1
  }
}

const linkClass =
  'underline underline-offset-[3px] decoration-[color:var(--paper-line)] hover:decoration-[color:var(--paper-ink)] transition-colors text-[color:var(--paper-ink)]'

const Writing = ({ postsToShow, page, showNext }) => {
  const { locale } = useRouter()
  const t = lang[locale] || lang.zh

  return (
    <Container title={`${t.NAV.WRITING} - ${BLOG.title}`} description={BLOG.description} wide>
      <div className='personal-home max-w-xl mx-auto pb-16 md:pb-24 pt-6 md:pt-10 text-[15px] md:text-base leading-[1.75]'>
        <h1 className='text-xl md:text-2xl font-medium text-[color:var(--paper-ink)] mb-3'>
          {t.NAV.WRITING}
        </h1>
        <p className='mb-10 text-[color:var(--paper-soft)]'>{t.HOME.WRITING_SUB}</p>
        <ul className='space-y-3 mb-10'>
          {postsToShow.map((post) => (
            <li key={post.id} className='flex flex-col sm:flex-row sm:gap-3 leading-relaxed'>
              <span className='shrink-0 text-[color:var(--paper-faint)] tabular-nums text-sm sm:w-28'>
                <FormattedDate date={post.date} />
              </span>
              <Link href={`${BLOG.path}/${post.slug}`} scroll={false} className={linkClass}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        {showNext && <Pagination page={page} showNext={showNext} />}
      </div>
    </Container>
  )
}

export default Writing
