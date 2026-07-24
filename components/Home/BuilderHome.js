import BLOG from '@/blog.config'
import FormattedDate from '@/components/Common/FormattedDate'
import { pickLocale } from '@/lib/locale'
import { lang } from '@/lib/lang'
import Link from 'next/link'
import { useRouter } from 'next/router'

/**
 * Personal home inspired by leerob.com / sive.rs,
 * with a warm paper color system.
 */

const linkClass =
  'underline underline-offset-[3px] decoration-[color:var(--paper-line)] hover:decoration-[color:var(--paper-ink)] transition-colors text-[color:var(--paper-ink)]'

const Ext = ({ href, children }) => (
  <a href={href} target='_blank' rel='noopener noreferrer' className={linkClass}>
    {children}
  </a>
)

const Bio = ({ locale }) => {
  if (locale === 'en') {
    return (
      <>
        <p>
          I&apos;m a builder and open-source contributor. I come from cross-platform
          and frontend work, and have contributed to{' '}
          <Ext href='https://answer.apache.org'>Apache Answer</Ext> and{' '}
          <Ext href='https://github.com/NervJS/taro'>Taro</Ext>.
        </p>
        <p>
          Right now I&apos;m shipping{' '}
          <Ext href='https://huixin.robinren.me'>Huixin</Ext> — AI for the next
          line when you&apos;re stuck writing — and{' '}
          <Ext href='https://md.robinren.me'>md.robinren.me</Ext>, a hard-document
          toolkit for converting and splitting large files and scans (Markdown,
          searchable PDF, PDF / PPTX / DOCX).
        </p>
        <p>
          You can read my writing, browse work, or email me at{' '}
          <a href={`mailto:${BLOG.email}`} className={linkClass}>
            {BLOG.email}
          </a>
          .
        </p>
      </>
    )
  }

  return (
    <>
      <p>
        我是 builder，也是开源贡献者。跨端与前端出身，参与过{' '}
        <Ext href='https://answer.apache.org'>Apache Answer</Ext>、
        <Ext href='https://github.com/NervJS/taro'>Taro</Ext> 等项目。
      </p>
      <p>
        现在主要在做两件事：
        <Ext href='https://huixin.robinren.me'>会心</Ext>
        ——卡住时帮你写出下一句；以及{' '}
        <Ext href='https://md.robinren.me'>难文档工具箱</Ext>
        （md.robinren.me）——面向大文件与扫描件，做文档转 Markdown、可检索 PDF、拆分
        PDF / PPTX / DOCX。
      </p>
      <p>
        可以读我的写作、看作品，或发邮件到{' '}
        <a href={`mailto:${BLOG.email}`} className={linkClass}>
          {BLOG.email}
        </a>
        。
      </p>
    </>
  )
}

const Section = ({ title, children }) => (
  <section className='mt-12 md:mt-14'>
    <h2 className='text-base font-medium text-[color:var(--paper-ink)] mb-3'>{title}</h2>
    {children}
  </section>
)

const BuilderHome = ({ posts }) => {
  const { locale } = useRouter()
  const t = lang[locale] || lang.zh
  const brand = BLOG.brand || {}
  const now = brand.now || {}
  const proof = brand.proof || {}

  // Open source first, then products
  const workPreview = (brand.projects || [])
    .filter((p) => p.tier === 'oss' || p.tier === 'product')
    .sort((a, b) => (a.tier === 'oss' ? 0 : 1) - (b.tier === 'oss' ? 0 : 1))
    .slice(0, 5)

  const postsPreview = (posts || []).slice(0, 5)

  return (
    <div className='personal-home max-w-xl mx-auto pb-16 md:pb-24 pt-6 md:pt-10 text-[15px] md:text-base leading-[1.75]'>
      <header>
        <h1 className='text-xl md:text-2xl font-medium text-[color:var(--paper-ink)] leading-snug mb-5'>
          {brand.name || BLOG.author}
        </h1>
        <div className='space-y-4' style={{ color: 'var(--paper-soft)' }}>
          <Bio locale={locale} />
        </div>
      </header>

      <Section title={pickLocale(now.label, locale)}>
        <ul className='space-y-3'>
          {(now.items || []).map((item) => (
            <li key={item.id} className='leading-relaxed'>
              <Ext href={item.url}>{pickLocale(item.name, locale)}</Ext>
              <span className='text-[color:var(--paper-mute)]'>
                {' — '}
                {pickLocale(item.description, locale)}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={pickLocale(proof.label, locale)}>
        <ul className='space-y-2'>
          {(proof.items || []).map((item) => (
            <li key={pickLocale(item.title, locale)} className='leading-relaxed'>
              <Ext href={item.url}>{pickLocale(item.title, locale)}</Ext>
              <span className='text-[color:var(--paper-mute)]'>
                {' — '}
                {pickLocale(item.detail, locale)}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t.HOME.WORK_TITLE}>
        <ul className='space-y-2'>
          {workPreview.map((project) => {
            const isExternal = /^https?:\/\//.test(project.url || '')
            const name = <span className={linkClass}>{project.name}</span>
            return (
              <li key={project.name} className='leading-relaxed'>
                {isExternal ? (
                  <a href={project.url} target='_blank' rel='noopener noreferrer'>
                    {name}
                  </a>
                ) : (
                  <Link href={project.url || '#'} scroll={false}>
                    {name}
                  </Link>
                )}
                <span className='text-[color:var(--paper-mute)]'>
                  {' — '}
                  {pickLocale(project.description, locale)}
                </span>
              </li>
            )
          })}
        </ul>
        <p className='mt-3'>
          <Link href='/projects' scroll={false} className={`${linkClass} text-[color:var(--paper-soft)]`}>
            {t.HOME.WORK_MORE}
          </Link>
        </p>
      </Section>

      {postsPreview.length > 0 && (
        <Section title={t.HOME.WRITING_TITLE}>
          <ul className='space-y-2'>
            {postsPreview.map((post) => (
              <li key={post.id} className='flex flex-col sm:flex-row sm:gap-3 leading-relaxed'>
                <span className='shrink-0 text-[color:var(--paper-faint)] tabular-nums text-sm sm:w-28 sm:pt-0.5'>
                  <FormattedDate date={post.date} />
                </span>
                <Link href={`${BLOG.path}/${post.slug}`} scroll={false} className={linkClass}>
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className='mt-3'>
            <Link href='/writing' scroll={false} className={`${linkClass} text-[color:var(--paper-soft)]`}>
              {t.HOME.WRITING_MORE}
            </Link>
          </p>
        </Section>
      )}

      <Section title={locale === 'en' ? 'Online' : '在网上'}>
        <ul className='space-y-1.5'>
          <li>
            <Ext href={BLOG.socialLink.github}>GitHub</Ext>
          </li>
          <li>
            <Ext href={BLOG.socialLink.twitter}>X / Twitter</Ext>
          </li>
          <li>
            <Ext href={BLOG.socialLink.telegram}>Telegram</Ext>
          </li>
          <li>
            <a href={`mailto:${BLOG.email}`} className={linkClass}>
              {BLOG.email}
            </a>
          </li>
        </ul>
      </Section>
    </div>
  )
}

export default BuilderHome
