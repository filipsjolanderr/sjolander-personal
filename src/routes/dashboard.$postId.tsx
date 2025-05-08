import { createFileRoute, redirect, notFound } from '@tanstack/react-router'
import { BlogEditor } from '~/components/blog/BlogEditor'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { and, eq } from 'drizzle-orm'
import { Button } from '~/components/ui/button'
import { Link } from '@tanstack/react-router'
import { authClient } from '~/lib/auth-client'
import { useSession } from '~/hooks/auth-hooks'

export const Route = createFileRoute('/dashboard/$postId')({
    component: EditPostPage,
    beforeLoad: async ({ context }) => {
        if (!(await authClient.getSession()).data?.user) {
            throw redirect({
                to: '/sign-in',
            })
        }
    },
    loader: async ({ params, context }) => {
        const post = await db
            .select()
            .from(blogPosts)
            .where(and(eq(blogPosts.id, params.postId), eq(blogPosts.authorId, (await authClient.getSession()).data!.user!.id)))
            .limit(1)

        if (!post[0]) {
            throw notFound()
        }

        return { post: post[0] }
    },
})

function EditPostPage() {
    const { post } = Route.useLoaderData()
    const {
        data: sessionData,
        session,
        user,
        isPending,
        refetch,
        error
    } = useSession()

    const handleUpdatePost = async (data: { title: string; content: string; excerpt: string }) => {
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        await db
            .update(blogPosts)
            .set({
                title: data.title,
                slug,
                content: data.content,
                excerpt: data.excerpt,
                updatedAt: new Date(),
            })
            .where(eq(blogPosts.id, post.id))

        // Redirect back to dashboard
        window.location.href = '/dashboard'
    }

    const handlePublish = async () => {
        await db
            .update(blogPosts)
            .set({
                published: true,
                updatedAt: new Date(),
            })
            .where(eq(blogPosts.id, post.id))

        // Redirect back to dashboard
        window.location.href = '/dashboard'
    }

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Edit Post</h1>
                <div className="space-x-4">
                    <Button asChild variant="outline">
                        <Link to="/dashboard">Back to Dashboard</Link>
                    </Button>
                    {!post.published && (
                        <Button onClick={handlePublish}>Publish Post</Button>
                    )}
                </div>
            </div>

            <BlogEditor
                initialData={{
                    title: post.title,
                    content: post.content,
                    excerpt: post.excerpt ?? '',
                }}
                onSubmit={handleUpdatePost}
            />
        </div>
    )
} 
