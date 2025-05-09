import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { desc } from 'drizzle-orm'
import { Link } from '@tanstack/react-router'
import { formatDate } from '~/utils/formatDate'

export const Route = createFileRoute('/dashboard/blog')({
    component: BlogDashboard,
    loader: async () => {
        const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt))
        return { posts }
    }
})

function BlogDashboard() {
    const { posts } = Route.useLoaderData()

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Link to="/dashboard/blog/new">
                    <Button>Create New Post</Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {posts.map((post) => (
                    <Card key={post.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{post.title}</CardTitle>
                                    <CardDescription>
                                        {formatDate(post.createdAt)} • {post.published ? 'Published' : 'Draft'}
                                    </CardDescription>
                                </div>
                                <Link to={`/dashboard/blog/${post.id}/edit`}>
                                    <Button variant="outline">Edit</Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{post.excerpt}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
} 
