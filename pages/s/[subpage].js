import BLOG from '@/blog.config'
import Layout from '@/layouts/layout'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { useRouter } from 'next/router'

import { getAllPagesInSpace, getPageBreadcrumbs, idToUuid } from 'notion-utils'
import { defaultMapPageUrl } from 'notion-utils'

import Loading from '@/components/Loading'
import NotFound from '@/components/NotFound'

const Post = ({ post, blockMap }) => {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <Loading notionSlug={router.asPath.split('/')[2]} />
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
  // Avoid hammering Notion at build time (429). Pages are rendered on demand via ISR.
  return {
    paths: [],
    fallback: true
  }
}

export async function getStaticProps({ params: { subpage } }) {
  const posts = await getAllPosts({ onlyNewsletter: false })

  let blockMap, post
  try {
    blockMap = await getPostBlocks(subpage)
    if (!blockMap) {
      return { props: { post: null, blockMap: null }, revalidate: 60 }
    }
    const id = idToUuid(subpage)

    const breadcrumbs = getPageBreadcrumbs(blockMap, id)
    post = posts.find((t) => t.id === breadcrumbs[0].block.id)
    // When the page is not in the notion database, manually initialize the post
    if (!post) {
      post = {
        type: ['Page'],
        title: breadcrumbs[0].title
      }
    }
    // console.log("debug: ", breadcrumbs, post)
  } catch (err) {
    console.error(err)
    return { props: { post: null, blockMap: null }, revalidate: 60 }
  }

  // Allow only pages in your own space
  const NOTION_SPACES_ID = BLOG.notionSpacesId
  const pageAllowed = (page) => {
    // When page block space_id = NOTION_SPACES_ID
    let allowed = false
    Object.values(page.block).forEach(block => {
      if (!allowed && block.value && block.value.space_id) {
        allowed = NOTION_SPACES_ID.includes(block.value.space_id)
      }
    })
    return allowed
  }

  if (!pageAllowed(blockMap)) {
    return { props: { post: null, blockMap: null }, revalidate: 60 }
  } else {
    return {
      props: { post, blockMap },
      revalidate: 1
    }
  }
}

export default Post
