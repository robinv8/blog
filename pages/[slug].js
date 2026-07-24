import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import NotFound from '@/components/NotFound'
import { resolvePostForLocale, getEnglishTranslation } from '@/lib/translations'

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

    if (!resolved?.post) {
      return {
        props: { post: null, blockMap: null, translationMarkdown: null },
        revalidate: 60
      }
    }

    // File-based English (bundled translations)
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

    const post = resolved.post
    if (!post?.id) {
      // Last resort: pure file EN
      const tr = getEnglishTranslation(slug)
      if (locale === 'en' && tr) {
        return {
          props: {
            post: {
              slug,
              title: tr.title,
              summary: tr.summary || '',
              date: Date.now(),
              type: ['Post'],
              tags: tr.tags || [],
              sourceTitle: tr.sourceTitle
            },
            blockMap: null,
            translationMarkdown: tr.markdown
          },
          revalidate: 3600
        }
      }
      return {
        props: { post: null, blockMap: null, translationMarkdown: null },
        revalidate: 60
      }
    }

    const blockMap = await getPostBlocks(post.id)
    if (!blockMap) {
      // Notion failed: EN file fallback
      const tr = getEnglishTranslation(slug)
      if (locale === 'en' && tr) {
        return {
          props: {
            post: {
              ...post,
              sourceTitle: post.title,
              title: tr.title,
              summary: tr.summary || post.summary
            },
            blockMap: null,
            translationMarkdown: tr.markdown
          },
          revalidate: 300
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
    // EN file fallback on hard errors
    if (locale === 'en') {
      const tr = getEnglishTranslation(slug)
      if (tr) {
        return {
          props: {
            post: {
              slug,
              title: tr.title,
              summary: tr.summary || '',
              date: Date.now(),
              type: ['Post'],
              tags: tr.tags || [],
              sourceTitle: tr.sourceTitle
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
}

export default Post
