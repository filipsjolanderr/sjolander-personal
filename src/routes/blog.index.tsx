import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { desc, eq } from 'drizzle-orm'
import { Link } from '@tanstack/react-router'
import { formatDate } from '~/utils/formatDate'
export const Route = createFileRoute('/blog/')({
    component: BlogIndex,
    loader: async () => {
        const posts = await db.select()
            .from(blogPosts)
            .where(eq(blogPosts.published, true))
            .orderBy(desc(blogPosts.createdAt))
        return { posts }
    }
})

function BlogIndex() {
    const { posts } = Route.useLoaderData()

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>

            <div className="grid gap-6">
                {posts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.slug}`}>
                        <Card className="hover:bg-accent/50 transition-colors">
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>
                                    {formatDate(post.createdAt)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{post.excerpt}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
} 
