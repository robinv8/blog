import Link from 'next/link'
import BLOG from '@/blog.config'
import { lang } from '@/lib/lang'
import { useRouter } from 'next/router'
import {
  UserIcon,
  UsersIcon,
  BookOpenIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import Social from '../Common/Social.js'
import { motion } from 'framer-motion'

const Footer = ({ fullWidth }) => {
  const router = useRouter()
  const { locale } = useRouter()
  const t = lang[locale]

  let activeMenu = ''
  if (router.query.slug) {
    activeMenu = '/' + router.query.slug
  } else {
    activeMenu = router.pathname
  }

  const d = new Date()
  const y = d.getFullYear()
  const from = +BLOG.since

  const links = [
    {
      id: 0,
      name: t.NAV.PROJECTS,
      to: '/projects',
      icon: <BookOpenIcon className='inline-block mb-1 h-5 w-5' />,
      show: BLOG.pagesShow.projects
    },
    {
      id: 1,
      name: t.NAV.WRITING,
      to: '/writing',
      icon: <UsersIcon className='inline-block mb-1 h-5 w-5' />,
      show: true
    },
    {
      id: 2,
      name: t.NAV.CONTACT,
      to: '/contact',
      icon: <EnvelopeIcon className='inline-block mb-1 h-5 w-5' />,
      show: BLOG.pagesShow.contact
    },
    {
      id: 3,
      name: 'GitHub',
      to: BLOG.socialLink.github,
      icon: <UserIcon className='inline-block mb-1 h-5 w-5' />,
      show: true,
      external: true
    }
  ]

  return (
    <motion.div
      className={`mt-6 shrink-0 m-auto w-full text-ink-soft dark:text-ink-mute transition-all ${
        !fullWidth ? 'max-w-3xl md:px-8' : 'px-4 md:px-24'
      }`}
    >
      <footer className='max-w-screen-2xl px-4 md:px-8 mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center border-b border-ink-line py-1'>
          <ul className='flex flex-wrap justify-center md:justify-start md:gap-1'>
            {links.map((link) => {
              if (!link.show) return null
              const item = (
                <li
                  className={`${
                    !link.external && activeMenu === link.to
                      ? 'bg-gray-200 dark:bg-gray-700'
                      : ''
                  } hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer rounded-lg block py-1 px-2 nav`}
                >
                  <div className='font-light'>
                    {link.icon}
                    <span className='inline-block m-1'>{link.name}</span>
                  </div>
                </li>
              )
              if (link.external) {
                return (
                  <a
                    key={link.id}
                    href={link.to}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {item}
                  </a>
                )
              }
              return (
                <Link passHref key={link.id} href={link.to} scroll={false}>
                  {item}
                </Link>
              )
            })}
          </ul>
          <div className='hidden md:flex'>
            <Social />
          </div>
        </div>

        <div className='text-ink-faint text-xs font-light py-4'>
          © {from === y || !from ? y : `${from} - ${y}`} | {BLOG.author}
          <p className='md:float-right'>
            {t.FOOTER.COPYRIGHT_START}
            <a className='underline' href={`${t.FOOTER.COPYRIGHT_LINK}`}>
              {t.FOOTER.COPYRIGHT_NAME}
            </a>
            {t.FOOTER.COPYRIGHT_END}
          </p>
        </div>
      </footer>
    </motion.div>
  )
}

export default Footer
