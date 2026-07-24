import { useEffect, useState } from 'react'
import { getPageTitle } from 'notion-utils'
import { motion } from 'framer-motion'

import Container from '@/components/Container'
import Content from '@/components/Post/Content'
import Aside from '@/components/Post/Aside'
import Comments from '@/components/Post/Comments'
import PostFooter from '@/components/Post/PostFooter'

const Layout = ({
  blockMap,
  frontMatter,
  fullWidth = false,
  subPage = false,
  translationMarkdown = null
}) => {
  const [showSubPageTitle, setShowSubPageTitle] = useState(false)
  const useTranslation = Boolean(translationMarkdown)

  const pageTitle = !useTranslation && blockMap ? getPageTitle(blockMap) : frontMatter?.title
  useEffect(() => {
    if (!useTranslation && blockMap && frontMatter.title !== pageTitle) {
      setShowSubPageTitle(true)
    }
  }, [frontMatter, pageTitle, subPage, blockMap, useTranslation])

  if (!useTranslation && !blockMap) {
    return (
      <Container title={frontMatter?.title || 'Post'} description={frontMatter?.summary} type='article'>
        <p className='text-ink-mute py-12'>Content is loading…</p>
      </Container>
    )
  }

  return (
    <Container
      title={`${frontMatter.title}${frontMatter.title === pageTitle ? '' : ' | ' + pageTitle}`}
      description={frontMatter.summary}
      type='article'
      fullWidth={fullWidth}
    >
      <motion.div className='flex flex-row'>
        <Content
          frontMatter={frontMatter}
          blockMap={blockMap}
          pageTitle={showSubPageTitle ? pageTitle : null}
          translationMarkdown={translationMarkdown}
        />
        {!useTranslation && (
          <Aside
            frontMatter={frontMatter}
            blockMap={blockMap}
            pageTitle={showSubPageTitle ? pageTitle : null}
          />
        )}
      </motion.div>
      <PostFooter />
      <Comments frontMatter={frontMatter} />
    </Container>
  )
}

export default Layout
