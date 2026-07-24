import BLOG from '@/blog.config'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { NotionRenderer as Renderer } from 'react-notion-x'

// Lazy-load some heavy components & override the renderers of some block types
const components = {
  // Code block
  Code: dynamic(() => {
    return import('react-notion-x/build/third-party/code').then(async module => {
      // Additional prismjs syntax (wrapped in try/catch for React 19 compat)
      await Promise.all(
        [
          'prismjs/components/prism-bash',
          'prismjs/components/prism-c',
          'prismjs/components/prism-cpp',
          'prismjs/components/prism-docker',
          'prismjs/components/prism-diff',
          'prismjs/components/prism-git',
          'prismjs/components/prism-go',
          'prismjs/components/prism-graphql',
          'prismjs/components/prism-makefile',
          'prismjs/components/prism-markdown',
          'prismjs/components/prism-python',
          'prismjs/components/prism-rust',
          'prismjs/components/prism-solidity',
          'prismjs/components/prism-sql',
          'prismjs/components/prism-swift',
          'prismjs/components/prism-wasm',
          'prismjs/components/prism-yaml'
        ].map(async (path) => {
          try {
            await import(path)
          } catch (err) {
            // Ignore prism language loading errors
          }
        })
      )
      return module.Code
    })
  }),
  // Database block
  Collection: dynamic(() => {
    return import('react-notion-x/build/third-party/collection').then(module => module.Collection)
  }),
  // Equation block & inline variant
  Equation: dynamic(() => {
    return import('react-notion-x/build/third-party/equation').then(module => module.Equation)
  })
}

/**
 * Notion page renderer
 *
 * A wrapper of react-notion-x/NotionRenderer with predefined `components` and `mapPageUrl`
 *
 * @param props - Anything that react-notion-x/NotionRenderer supports
 */
export default function NotionRenderer (props) {
  const { locale } = useRouter()
  if (!props.blockMap) {
    return null
  }
  const mapPageUrl = (id) => {
    // console.log('mapPageUrl', BLOG.lang.split('-')[0])
    if (locale === BLOG.lang.split('-')[0]) {
      return '/s/' + id.replace(/-/g, '')
    } else {
      return '/' + locale + '/s/' + id.replace(/-/g, '')
    }
  }
  return (
    <Renderer
      components={components}
      mapPageUrl={mapPageUrl}
      recordMap={props.blockMap}
      {...props}
    />
  )
}

NotionRenderer.propTypes = {
  frontMatter: PropTypes.object.isRequired,
  blockMap: PropTypes.object.isRequired
}
