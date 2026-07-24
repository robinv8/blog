import { useEffect, useCallback, useState, useRef } from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'
import { lang } from '@/lib/lang'
import { useRouter } from 'next/router'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Social from '../Common/Social.js'
import ThemeSwitcher from './ThemeSwitcher.js'
import LangSwitcher from './LangSwitcher.js'

const NavBar = () => {
  const router = useRouter()
  const { locale } = useRouter()
  const t = lang[locale] || lang.zh
  const [showMenu, setShowMenu] = useState(false)

  let activeMenu = ''
  if (router.query.slug) {
    activeMenu = '/' + router.query.slug
  } else {
    activeMenu = router.pathname
  }

  const links = [
    {
      id: 0,
      name: t.NAV.INDEX,
      to: BLOG.path || '/',
      show: true
    },
    {
      id: 1,
      name: t.NAV.PROJECTS,
      to: '/projects',
      show: BLOG.pagesShow.projects
    },
    {
      id: 2,
      name: t.NAV.WRITING,
      to: '/writing',
      show: true
    },
    {
      id: 3,
      name: t.NAV.CONTACT,
      to: '/contact',
      show: BLOG.pagesShow.contact
    }
  ]

  return (
    <div className='flex items-center gap-1 sm:gap-2'>
      {/* Desktop links */}
      <nav className='hidden md:flex items-center gap-0.5' aria-label='Primary'>
        {links.map(
          (link) =>
            link.show && (
              <Link
                key={link.id}
                href={link.to}
                scroll={false}
                className={`${
                  activeMenu === link.to
                    ? 'text-ink dark:text-ink-invert'
                    : 'text-ink-mute hover:text-ink dark:hover:text-ink-invert'
                } text-[13px] font-normal px-2.5 py-1.5 transition-colors`}
              >
                {link.name}
              </Link>
            )
        )}
      </nav>

      <div className='flex items-center gap-0.5'>
        <ThemeSwitcher />
        <LangSwitcher />
      </div>

      {/* Mobile menu */}
      <div className='relative md:hidden'>
        <button
          type='button'
          aria-label='Menu'
          aria-expanded={showMenu}
          onClick={() => setShowMenu((v) => !v)}
          className='flex items-center justify-center h-9 w-9 text-ink-soft hover:text-ink dark:hover:text-ink-invert transition-colors'
        >
          <Bars3Icon className='h-5 w-5' />
        </button>
        {showMenu && (
          <div className='absolute right-0 top-full mt-2 w-44 z-20 bg-paper-raised dark:bg-paper-dark border border-ink-line rounded-md shadow-lg outline-none'>
            <div className='py-1'>
              {links.map(
                (link) =>
                  link.show && (
                    <Link
                      key={link.id}
                      href={link.to}
                      scroll={false}
                      onClick={() => setShowMenu(false)}
                      className='block w-full px-4 py-2.5 text-left text-sm text-ink-soft hover:text-ink dark:hover:text-ink-invert'
                    >
                      {link.name}
                    </Link>
                  )
              )}
            </div>
            <div className='px-4 py-3 border-t border-ink-line'>
              <Social />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const Header = ({ navBarTitle, fullWidth }) => {
  const [showTitle, setShowTitle] = useState(false)
  const useSticky = !BLOG.autoCollapsedNavBar
  const navRef = useRef(/** @type {HTMLDivElement} */ (null))
  const sentinelRef = useRef(/** @type {HTMLDivElement} */ (null))

  const handler = useCallback(
    ([entry]) => {
      if (useSticky && navRef.current) {
        navRef.current.classList.toggle('sticky-nav-full', !entry.isIntersecting)
      } else if (navRef.current) {
        navRef.current.classList.add('remove-sticky')
      }
    },
    [useSticky]
  )

  useEffect(() => {
    const sentinelEl = sentinelRef.current
    if (!sentinelEl) return
    const observer = new window.IntersectionObserver(handler)
    observer.observe(sentinelEl)

    const onScroll = () => {
      setShowTitle(window.pageYOffset > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.unobserve(sentinelEl)
      window.removeEventListener('scroll', onScroll)
    }
  }, [handler])

  // Match main content width: wide pages use max-w-xl; default max-w-2xl
  const widthClass = fullWidth
    ? 'px-4 md:px-24'
    : 'max-w-xl px-5 sm:px-6'

  return (
    <>
      <div className='observer-element h-4 md:h-8' ref={sentinelRef} />
      <header
        className={`sticky-nav m-auto w-full flex items-center justify-between gap-4 mb-6 md:mb-10 py-4 ${widthClass}`}
        id='sticky-nav'
        ref={navRef}
      >
        <div className='flex items-center min-w-0 gap-3'>
          <Link
            href='/'
            scroll={false}
            aria-label={BLOG.title}
            className='text-[15px] font-medium leading-none text-ink dark:text-ink-invert tracking-tight hover:opacity-70 transition-opacity shrink-0'
          >
            {BLOG.author}
          </Link>
          {navBarTitle ? (
            <p
              className={`text-sm text-ink-mute truncate ${
                !showTitle ? 'hidden' : 'hidden xl:block'
              }`}
            >
              {navBarTitle}
            </p>
          ) : null}
        </div>
        <NavBar />
      </header>
    </>
  )
}

export default Header
