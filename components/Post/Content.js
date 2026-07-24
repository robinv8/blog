import BLOG from '@/blog.config'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'

import FormattedDate from '@/components/Common/FormattedDate'
import TagItem from '@/components/Common/TagItem'
import NotionRenderer from '@/components/Post/NotionRenderer'
import MarkdownBody from '@/components/Post/MarkdownBody'

import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function Content(props) {
  const { frontMatter, blockMap, pageTitle, translationMarkdown } = props
  const { locale } = useRouter()
  const type0 = Array.isArray(frontMatter.type) ? frontMatter.type[0] : frontMatter.type

  return (
    <article className='flex-none md:overflow-x-visible overflow-x-scroll w-full'>
      {pageTitle && (
        <Link
          passHref
          href={`${BLOG.path}/${frontMatter.slug}`}
          scroll={false}
          className='block md:-ml-6 mb-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'
        >
          <ChevronLeftIcon className='inline-block mb-1 h-5 w-5' />
          <span className='m-1'>{frontMatter.title}</span>
        </Link>
      )}
      <h1 className='font-bold text-3xl text-black dark:text-white'>
        {pageTitle ? pageTitle : frontMatter.title}
      </h1>
      {type0 !== 'Page' && (
        <nav className='flex mt-5 mb-6 items-start text-gray-500 dark:text-gray-400'>
          <div className='mr-2 mb-4 md:ml-0'>
            <FormattedDate date={frontMatter.date} />
          </div>
          {frontMatter.tags && (
            <div className='flex flex-nowrap max-w-full overflow-x-auto article-tags'>
              {frontMatter.tags.map((tag) => (
                <TagItem key={tag} tag={tag} />
              ))}
            </div>
          )}
        </nav>
      )}
      {translationMarkdown && locale === 'en' && (
        <p className='mb-6 text-sm text-ink-mute'>
          English translation of the original Chinese post
          {frontMatter.sourceTitle ? ` “${frontMatter.sourceTitle}”` : ''}.
        </p>
      )}
      <div className='-mt-1 relative'>
        {translationMarkdown ? (
          <MarkdownBody markdown={translationMarkdown} />
        ) : (
          <NotionRenderer
            blockMap={blockMap}
            previewImages={BLOG.previewImagesEnabled}
            {...props}
          />
        )}
      </div>
    </article>
  )
}

Content.propTypes = {
  frontMatter: PropTypes.object.isRequired,
  blockMap: PropTypes.object,
  pageTitle: PropTypes.string,
  translationMarkdown: PropTypes.string
}
