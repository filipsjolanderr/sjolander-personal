import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface BlogPostProps {
    post: {
        title: string
        content: string
        createdAt: Date
        author: string | null
    }
}

export function BlogPost({ post }: BlogPostProps) {
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
                <p className="text-muted-foreground">
                    By {post.author} • {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                </p>
            </CardHeader>
            <CardContent>
                <article className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>
            </CardContent>
        </Card>
    )
} 
