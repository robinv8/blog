import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'
import { localizePosts } from '@/lib/translations'

const Page = ({ postsToShow, page, showNext }) => {
  return (
    <Container>
      {postsToShow &&
        postsToShow.map((post) => <BlogPost key={post.id} post={post} />)}
      <Pagination page={page} showNext={showNext} />
    </Container>
  )
}

export async function getStaticProps(context) {
  const { page } = context.params // Get Current Page No.
  const locale = context.locale
  const all = await getAllPosts({ onlyNewsletter: false })
  const posts = localizePosts(all.filter((p) => p.type?.[0] === 'Post' || p.type === 'Post'), locale)
  const postsToShow = posts.slice(
    BLOG.postsPerPage * (page - 1),
    BLOG.postsPerPage * page
  )
  const totalPosts = posts.length
  const showNext = page * BLOG.postsPerPage < totalPosts
  return {
    props: {
      page, // Current Page
      postsToShow,
      showNext
    },
    revalidate: 1
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts({ onlyNewsletter: false })
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / BLOG.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
