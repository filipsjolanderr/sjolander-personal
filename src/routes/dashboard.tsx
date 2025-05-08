import { createFileRoute, redirect } from '@tanstack/react-router'
import { BlogEditor } from '~/components/blog/BlogEditor'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { desc, eq } from 'drizzle-orm'
import { Button } from '~/components/ui/button'
import { Link } from '@tanstack/react-router'
import { authClient } from '~/lib/auth-client'
import { useSession } from '~/hooks/auth-hooks'

export const Route = createFileRoute('/dashboard')({



    component: DashboardPage,
    beforeLoad: async ({ context }) => {
        if (!(await authClient.getSession()).data?.user) {
            throw redirect({
                to: '/auth/sign-in',
            })
        }
    },
    loader: async ({ context }) => {
        const posts = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.authorId, (await authClient.getSession()).data!.user!.id))
            .orderBy(desc(blogPosts.createdAt))

        return { posts }
    },
})

function DashboardPage() {
    const { posts } = Route.useLoaderData()
    const {
        data: sessionData,
        session,
        user,
        isPending,
        refetch,
        error
    } = useSession()
    const handleCreatePost = async (data: { title: string; content: string; excerpt: string }) => {
        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        await db.insert(blogPosts).values({
            title: data.title,
            slug,
            content: data.content,
            excerpt: data.excerpt,
            authorId: user!.id,
            published: false,
        })

        // Refresh the page to show the new post
        window.location.reload()
    }

    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <Button asChild>
                    <Link to="/dashboard/new">New Post</Link>
                </Button>
            </div>

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
                    <div className="grid gap-4">
                        {posts.map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div>
                                    <h3 className="font-medium">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {post.published ? 'Published' : 'Draft'}
                                    </p>
                                </div>
                                <Button asChild variant="outline">
                                    <Link to="/dashboard/$postId" params={{ postId: post.id }}>
                                        Edit
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Create New Post</h2>
                    <BlogEditor onSubmit={handleCreatePost} />
                </div>
            </div>
        </div>
    )
} 
