import Container from '@/components/Container'
import BLOG from '@/blog.config'
import { lang } from '@/lib/lang'
import { pickLocale } from '@/lib/locale'
import { useRouter } from 'next/router'

const TIERS = ['oss', 'product', 'lab']

const linkClass =
  'underline underline-offset-[3px] decoration-[color:var(--paper-line)] hover:decoration-[color:var(--paper-ink)] transition-colors text-[color:var(--paper-ink)]'

const Ext = ({ href, children }) => (
  <a href={href} target='_blank' rel='noopener noreferrer' className={linkClass}>
    {children}
  </a>
)

const Projects = () => {
  const { locale } = useRouter()
  const t = lang[locale] || lang.zh
  const projects = BLOG.brand?.projects || []

  return (
    <Container
      title={`${t.PROJECTS.TITLE} - ${BLOG.title}`}
      description={t.PROJECTS.DESCRIPTION}
      wide
    >
      <div className='personal-home max-w-xl mx-auto pb-16 md:pb-24 pt-6 md:pt-10 text-[15px] md:text-base leading-[1.75]'>
        <h1 className='text-xl md:text-2xl font-medium text-[color:var(--paper-ink)] mb-3'>
          {t.PROJECTS.TITLE}
        </h1>
        <p className='mb-10 text-[color:var(--paper-soft)]'>{t.PROJECTS.DESCRIPTION}</p>

        <div className='space-y-10'>
          {TIERS.map((tier) => {
            const items = projects.filter((p) => p.tier === tier)
            if (!items.length) return null
            return (
              <section key={tier}>
                <h2 className='text-base font-medium text-[color:var(--paper-ink)] mb-3'>
                  {t.PROJECTS.TIER[tier]}
                </h2>
                <ul className='space-y-3'>
                  {items.map((project) => (
                    <li key={project.name} className='leading-relaxed'>
                      <Ext href={project.url}>{project.name}</Ext>
                      <span className='text-[color:var(--paper-mute)]'>
                        {' — '}
                        {pickLocale(project.description, locale)}
                      </span>
                      {project.storeUrl && (
                        <>
                          {' · '}
                          <Ext href={project.storeUrl}>App Store</Ext>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>
    </Container>
  )
}

export default Projects
