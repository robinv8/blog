import Container from '@/components/Container'
import BuilderHome from '@/components/Home/BuilderHome'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'
import { filterPostsByLocale } from '@/lib/locale'

export async function getStaticProps({ locale }) {
  const all = await getAllPosts({ onlyPost: true })
  const posts = filterPostsByLocale(all, locale)
  return {
    props: {
      posts: posts.slice(0, 6)
    },
    revalidate: 1
  }
}

const Home = ({ posts }) => {
  // SEO description stays bilingual in config; page title is identity
  return (
    <Container title={BLOG.title} description={BLOG.description} wide>
      <BuilderHome posts={posts} />
    </Container>
  )
}

export default Home
