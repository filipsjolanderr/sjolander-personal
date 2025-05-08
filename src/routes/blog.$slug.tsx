import { createFileRoute, notFound } from '@tanstack/react-router'
import { BlogPost } from '~/components/blog/BlogPost'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { user } from '~/db/schema/auth-schema'
import { and, eq } from 'drizzle-orm'

export const Route = createFileRoute('/blog/$slug')({
    component: BlogPostPage,
    loader: async ({ params }) => {
        const post = await db
            .select({
                title: blogPosts.title,
                content: blogPosts.content,
                createdAt: blogPosts.createdAt,
                author: user.name,
            })
            .from(blogPosts)
            .leftJoin(user, eq(blogPosts.authorId, user.id))
            .where(and(eq(blogPosts.published, true), eq(blogPosts.slug, params.slug)))
            .limit(1)

        if (!post[0]) {
            throw notFound()
        }

        return { post: post[0] }
    },
})

function BlogPostPage() {
    const { post } = Route.useLoaderData()

    return (
        <div className="container py-8">
            <BlogPost post={post} />
        </div>
    )
} 
