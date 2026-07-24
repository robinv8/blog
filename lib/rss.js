import { Feed } from 'feed'
import BLOG from '@/blog.config'
import { pickLocale } from '@/lib/locale'

export function generateRss(posts) {
  const year = new Date().getFullYear()
  const feed = new Feed({
    title: BLOG.title,
    description: pickLocale(BLOG.description, 'zh'),
    id: `${BLOG.link}/${BLOG.path}`,
    link: `${BLOG.link}/${BLOG.path}`,
    language: BLOG.lang,
    favicon: `${BLOG.link}/avatar.webp`,
    copyright: `All rights reserved ${year}, ${BLOG.author}`,
    generator: 'by Notion',
    author: {
      name: BLOG.author,
      email: BLOG.email,
      link: BLOG.link
    }
  })
  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${BLOG.link}/${post.slug}`,
      link: `${BLOG.link}/${post.slug}`,
      description: post.summary,
      date: new Date(post.date)
    })
  })
  return feed.rss2()
}
