import { createFileRoute } from '@tanstack/react-router'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { eq } from 'drizzle-orm'
import { notFound } from '@tanstack/react-router'
import MDEditor from '@uiw/react-md-editor'
import { formatDate } from '~/utils/formatDate'

export const Route = createFileRoute('/blog/$slug')({
    component: BlogPost,
    loader: async ({ params }) => {
        const post = await db.selectDistinct().from(blogPosts).where(eq(blogPosts.slug, params.slug)).limit(1)

        if (!post || !post[0] || !post[0].published) {
            throw notFound()
        }

        return { post }
    }
})

function BlogPost() {
    const { post } = Route.useLoaderData()

    return (
        <article className="container mx-auto py-12 px-4 max-w-3xl">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post[0].title}</h1>
                <div className="text-muted-foreground">
                    {formatDate(post[0].createdAt)}
                </div>
            </header>

            <div className="prose prose-lg max-w-none">
                <div data-color-mode="light">
                    <MDEditor.Markdown source={post[0].content} />
                </div>
            </div>
        </article>
    )
} 
