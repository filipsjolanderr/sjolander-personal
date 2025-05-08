import { createFileRoute } from '@tanstack/react-router'
import { BlogList } from '~/components/blog/BlogList'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { user } from '~/db/schema/auth-schema'
import { desc, eq } from 'drizzle-orm'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
  loader: async () => {
    const posts = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        createdAt: blogPosts.createdAt,
        author: user.name,
      })
      .from(blogPosts)
      .leftJoin(user, eq(blogPosts.authorId, user.id))
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt))

    return { posts }
  },
})

function BlogPage() {
  const { posts } = Route.useLoaderData()

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList posts={posts} />
    </div>
  )
}
