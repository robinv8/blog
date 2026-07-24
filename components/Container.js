import SEO from '@/components/Common/SEO'
import BLOG from '@/blog.config'
import { pickLocale } from '@/lib/locale'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

const Container = ({ children, fullWidth, wide, ...customMeta }) => {
  const { locale } = useRouter()
  const meta = {
    title: BLOG.title,
    description: pickLocale(BLOG.description, locale),
    type: 'website',
    ...customMeta
  }
  // Keep one content width so header + main stay aligned
  const widthClass = fullWidth
    ? 'px-4 md:px-24'
    : 'max-w-xl px-5 sm:px-6'
  return (
    <>
      <SEO meta={meta} />
      <main className={`m-auto flex-grow w-full transition-all ${widthClass}`}>
        {children}
      </main>
    </>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

export default Container
