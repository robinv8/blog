import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import NotFound from '@/components/NotFound'

const Post = ({ post, blockMap }) => {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Loading />
    )
  }
  if (!post) {
    return <NotFound statusCode={404} />
  }
  return (
    <Layout blockMap={blockMap} frontMatter={post} fullWidth={post.fullWidth} />
  )
}

export async function getStaticPaths() {
  // Don't prerender every post at build time — Notion rate-limits hard (429).
  // Posts are generated on demand via ISR/fallback.
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params: { slug } }) {
  try {
    const posts = await getAllPosts({ onlyNewsletter: false })
    const post = posts.find((t) => t.slug === slug)

    if (!post?.id) {
      return { props: { post: null, blockMap: null }, revalidate: 60 }
    }

    const blockMap = await getPostBlocks(post.id)
    if (!blockMap) {
      // Layout requires blockMap; fail soft and retry later via ISR.
      return { props: { post: null, blockMap: null }, revalidate: 60 }
    }
    return {
      props: {
        post,
        blockMap
      },
      revalidate: 1
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        post: null,
        blockMap: null
      },
      revalidate: 60
    }
  }
}

export default Post
