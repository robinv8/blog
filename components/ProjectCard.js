import Link from 'next/link'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { lang } from '@/lib/lang'
import { pickLocale } from '@/lib/locale'
import { useRouter } from 'next/router'

const ProjectCard = ({ project }) => {
  const { locale } = useRouter()
  const t = lang[locale] || lang.zh
  const description = pickLocale(project.description, locale)
  const isExternal = /^https?:\/\//.test(project.url || '')

  const content = (
    <article className='group h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/40 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm transition-all p-5 flex flex-col'>
      <div className='flex items-start justify-between gap-3 mb-2'>
        <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors'>
          {project.name}
        </h3>
        <ArrowTopRightOnSquareIcon className='shrink-0 h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors mt-1' />
      </div>
      <p className='text-sm font-light leading-relaxed text-gray-600 dark:text-gray-300 flex-grow'>
        {description}
      </p>
      <div className='flex flex-wrap items-center gap-2 mt-4'>
        {project.tier && (
          <span className='text-xs px-2 py-0.5 rounded-md bg-gray-900/5 dark:bg-white/10 text-gray-700 dark:text-gray-200'>
            {t.PROJECTS.TIER[project.tier] || project.tier}
          </span>
        )}
        {(project.tags || []).map((tag) => (
          <span
            key={tag}
            className='text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )

  if (isExternal) {
    return (
      <a href={project.url} target='_blank' rel='noopener noreferrer' className='block h-full'>
        {content}
      </a>
    )
  }

  return (
    <Link href={project.url || '#'} scroll={false} className='block h-full'>
      {content}
    </Link>
  )
}

export default ProjectCard
