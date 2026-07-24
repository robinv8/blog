import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import BLOG from '@/blog.config'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import NotFound from '@/components/NotFound'
import { localizePost } from '@/lib/translations'

const Post = ({ post, blockMap, translationMarkdown }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <Loading />
  }
  if (!post) {
    return <NotFound statusCode={404} />
  }
  return (
    <Layout
      blockMap={blockMap}
      frontMatter={post}
      fullWidth={post.fullWidth}
      translationMarkdown={translationMarkdown}
    />
  )
}

export async function getStaticPaths() {
  // Avoid prerendering every post (Notion 429). Generate on first request.
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params: { slug }, locale }) {
  try {
    const posts = await getAllPosts({ onlyNewsletter: false })
    const raw = posts.find((t) => t.slug === slug)

    if (!raw?.id) {
      return { props: { post: null, blockMap: null, translationMarkdown: null }, revalidate: 60 }
    }

    const post = localizePost(raw, locale)
    const isEn = locale === 'en'
    const translationMarkdown = post.translationMarkdown || null

    // English with translation: no need to fetch Notion blocks
    if (isEn && translationMarkdown) {
      return {
        props: {
          post: {
            ...post,
            sourceTitle: post.sourceTitle || raw.title
          },
          blockMap: null,
          translationMarkdown
        },
        revalidate: 3600
      }
    }

    // English without translation yet: 404 on EN site (list also hides these)
    if (isEn && !translationMarkdown) {
      return { props: { post: null, blockMap: null, translationMarkdown: null }, revalidate: 300 }
    }

    const blockMap = await getPostBlocks(raw.id)
    if (!blockMap) {
      return { props: { post: null, blockMap: null, translationMarkdown: null }, revalidate: 60 }
    }
    return {
      props: {
        post: raw,
        blockMap,
        translationMarkdown: null
      },
      revalidate: 1
    }
  } catch (err) {
    console.error(err)
    return {
      props: { post: null, blockMap: null, translationMarkdown: null },
      revalidate: 60
    }
  }
}

export default Post
