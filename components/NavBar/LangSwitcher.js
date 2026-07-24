import Link from 'next/link'
import { useRouter } from 'next/router'

const LangSwitcher = () => {
  const { locale, asPath } = useRouter()
  const isEn = locale === 'en'
  const nextLocale = isEn ? 'zh' : 'en'
  const label = isEn ? '中文' : 'EN'

  return (
    <Link
      href={asPath}
      locale={nextLocale}
      scroll={false}
      aria-label={isEn ? 'Switch to Chinese' : 'Switch to English'}
      title={isEn ? '切换到中文' : 'Switch to English'}
      className='inline-flex items-center justify-center h-9 min-w-9 px-2 text-[12px] font-medium tracking-wide text-ink-mute hover:text-ink dark:hover:text-ink-invert transition-colors'
    >
      {label}
    </Link>
  )
}

export default LangSwitcher
