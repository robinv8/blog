import Link from 'next/link'
import { useRouter } from 'next/router'

const LangSwitcher = () => {
  const { locale, asPath } = useRouter()
  const isEn = locale === 'en'
  const nextLocale = isEn ? 'zh' : 'en'
  const label = isEn ? '中文' : 'EN'

  return (
    <Link
      passHref
      href={asPath}
      locale={nextLocale}
      scroll={false}
      aria-label={isEn ? 'Switch to Chinese' : 'Switch to English'}
      title={isEn ? '切换到中文' : 'Switch to English'}
      className='px-2 py-1.5 text-[12px] font-medium tracking-wide text-ink-mute dark:text-ink-mute hover:text-ink dark:hover:text-ink-invert transition-colors rounded-md'
    >
      {label}
    </Link>
  )
}

export default LangSwitcher
