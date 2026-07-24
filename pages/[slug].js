import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import NotFound from '@/components/NotFound'
import { resolvePostForLocale } from '@/lib/translations'

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
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params: { slug }, locale }) {
  try {
    const posts = await getAllPosts({ onlyNewsletter: false })
    const resolved = resolvePostForLocale(posts, slug, locale)

    if (!resolved?.post?.id && !resolved?.post?.useFileTranslation) {
      return {
        props: { post: null, blockMap: null, translationMarkdown: null },
        revalidate: 60
      }
    }

    // File-based English translation (no Notion EN page)
    if (resolved.source === 'file-en' && resolved.post.translationMarkdown) {
      return {
        props: {
          post: resolved.post,
          blockMap: null,
          translationMarkdown: resolved.post.translationMarkdown
        },
        revalidate: 3600
      }
    }

    // Notion page (zh original or en twin)
    const post = resolved.post
    if (!post?.id) {
      return {
        props: { post: null, blockMap: null, translationMarkdown: null },
        revalidate: 60
      }
    }

    const blockMap = await getPostBlocks(post.id)
    if (!blockMap) {
      // EN file fallback if Notion blocks fail
      if (locale === 'en') {
        const fileResolved = resolvePostForLocale(
          posts.filter((p) => p.slug === slug),
          slug,
          'en'
        )
        // force file path
        const { getEnglishTranslation } = await import('@/lib/translations')
        const tr = getEnglishTranslation(slug)
        if (tr) {
          const zh = posts.find((p) => p.slug === slug)
          return {
            props: {
              post: {
                ...zh,
                sourceTitle: zh?.title,
                title: tr.title,
                summary: tr.summary || zh?.summary,
                hasEnglishTranslation: true
              },
              blockMap: null,
              translationMarkdown: tr.markdown
            },
            revalidate: 300
          }
        }
      }
      return {
        props: { post: null, blockMap: null, translationMarkdown: null },
        revalidate: 60
      }
    }

    return {
      props: {
        post,
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
