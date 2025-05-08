import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'

interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string | null
    createdAt: Date
    author: string | null
}

interface BlogListProps {
    posts: BlogPost[]
}

export function BlogList({ posts }: BlogListProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
                <Link key={post.id} to="/blog/$slug" params={{ slug: post.slug }}>
                    <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>
                                By {post.author} • {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
} 
