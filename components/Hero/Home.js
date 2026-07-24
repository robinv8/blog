import BLOG from '@/blog.config'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Avatar from './Avatar.js'
import Social from '../Common/Social.js'
import { lang } from '@/lib/lang'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  EnvelopeIcon,
  RssIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const MeshGradient = dynamic(
  () => import('@paper-design/shaders-react').then((mod) => mod.MeshGradient),
  { ssr: false }
)

const pickLocale = (value, locale) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale] || value.zh || value.en || ''
}

const Hero = () => {
  const [showCopied, setShowCopied] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { locale } = useRouter()
  const { resolvedTheme } = useTheme()
  const t = lang[locale] || lang.zh
  const brand = BLOG.brand || {}

  useEffect(() => {
    setMounted(true)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(media.matches)
    const handler = (e) => setReduceMotion(e.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const clickCopy = async () => {
    setShowCopied(true)
    navigator.clipboard.writeText(BLOG.link + '/feed')
    setTimeout(() => {
      setShowCopied(false)
    }, 1000)
  }

  const shaderColors = {
    light: ['#FFF7ED', '#FFEDD5', '#F97316', '#8B5CF6'],
    dark: ['#1C1917', '#292524', '#FB923C', '#A78BFA']
  }

  const headline = pickLocale(brand.headline, locale)
  const tagline = pickLocale(brand.tagline, locale)
  const highlights = brand.highlights?.[locale] || brand.highlights?.zh || []

  return (
    <>
      <div className='relative overflow-hidden rounded-2xl mb-10'>
        {mounted && !reduceMotion && (
          <div className='absolute inset-0 -z-10 opacity-55'>
            <MeshGradient
              colors={resolvedTheme === 'dark' ? shaderColors.dark : shaderColors.light}
              speed={0.15}
              distortion={0.6}
              swirl={0.4}
              className='w-full h-full'
            />
          </div>
        )}
        <div className='container mx-auto flex px-5 py-6 md:py-8 md:flex-row flex-col items-center relative z-10'>
          <div className='flex flex-col md:w-3/5 md:items-start mb-6 md:mb-0 text-left'>
            <p className='text-sm font-medium tracking-wide text-orange-600 dark:text-orange-400 mb-3'>
              {t.HERO.HOME.GREETING}{' '}
              <span className='text-gray-900 dark:text-gray-100'>{brand.name || BLOG.author}</span>
            </p>
            <h1 className='text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight text-gray-900 dark:text-gray-50 mb-4'>
              {headline}
            </h1>
            <p className='text-base md:text-lg font-light leading-relaxed text-gray-600 dark:text-gray-300 mb-5 max-w-xl'>
              {tagline}
            </p>
            {highlights.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-5'>
                {highlights.map((item) => (
                  <span
                    key={item}
                    className='text-xs md:text-sm px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-600 text-gray-700 dark:text-gray-200'
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            <Social />
            <div className='flex flex-col sm:flex-row sm:flex-wrap gap-3 mt-6 w-full sm:w-auto'>
              <Link passHref href='/projects' scroll={false}>
                <button
                  type='button'
                  className='w-full sm:w-auto cursor-pointer bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:opacity-90 inline-flex py-3 px-5 rounded-lg items-center'
                >
                  <SparklesIcon className='inline-block h-6 w-6' />
                  <span className='ml-3 flex items-start flex-col leading-none text-left'>
                    <span className='text-xs opacity-70 mb-1'>
                      {t.HERO.HOME.PROJECTS_BUTTON_DES}
                    </span>
                    <span className='font-medium'>{t.HERO.HOME.PROJECTS_BUTTON}</span>
                  </span>
                </button>
              </Link>
              <Link passHref href='/contact' scroll={false}>
                <button
                  type='button'
                  className='w-full sm:w-auto cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 inline-flex py-3 px-5 rounded-lg items-center'
                >
                  <EnvelopeIcon className='inline-block text-gray-600 dark:text-day h-6 w-6' />
                  <span className='ml-3 flex items-start flex-col leading-none text-left'>
                    <span className='text-xs text-gray-600 dark:text-day mb-1'>
                      {t.HERO.HOME.CONTACT_BUTTON_DES}
                    </span>
                    <span className='font-medium'>{t.HERO.HOME.CONTACT_BUTTON}</span>
                  </span>
                </button>
              </Link>
              {showCopied ? (
                <button
                  type='button'
                  disabled
                  className='w-full sm:w-auto bg-gray-200 dark:bg-gray-600 inline-flex py-3 px-5 rounded-lg items-center'
                >
                  <ClipboardDocumentCheckIcon className='inline-block text-gray-600 dark:text-day h-6 w-6' />
                  <span className='ml-3 flex items-start flex-col leading-none text-left'>
                    <span className='text-xs text-gray-600 dark:text-day mb-1'>
                      {t.HERO.RSS_BUTTON_DES_COPIED}
                    </span>
                    <span className='font-medium'>{t.HERO.RSS_BUTTON_COPIED}</span>
                  </span>
                </button>
              ) : (
                <button
                  type='button'
                  onClick={() => clickCopy()}
                  className='w-full sm:w-auto cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 inline-flex py-3 px-5 rounded-lg items-center'
                >
                  <RssIcon className='inline-block text-gray-600 dark:text-day h-6 w-6' />
                  <span className='ml-3 flex items-start flex-col leading-none text-left'>
                    <span className='text-xs text-gray-600 dark:text-day mb-1'>
                      {t.HERO.RSS_BUTTON_DES}
                    </span>
                    <span className='font-medium'>{t.HERO.HOME.RSS_BUTTON}</span>
                  </span>
                </button>
              )}
            </div>
          </div>
          <Avatar className='flex items-center justify-center' />
        </div>
      </div>
    </>
  )
}

export default Hero
