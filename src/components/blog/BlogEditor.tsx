import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '~/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'

interface BlogEditorProps {
    initialData?: {
        title: string
        content: string
        excerpt: string
    }
    onSubmit: (data: { title: string; content: string; excerpt: string }) => void
    isSubmitting?: boolean
}

export function BlogEditor({ initialData, onSubmit, isSubmitting }: BlogEditorProps) {
    const [title, setTitle] = useState(initialData?.title ?? '')
    const [content, setContent] = useState(initialData?.content ?? '')
    const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ title, content, excerpt })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter post title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Enter a brief excerpt"
                    className="h-20"
                />
            </div>

            <div className="space-y-2">
                <Label>Content</Label>
                <Tabs defaultValue="edit" className="w-full">
                    <TabsList>
                        <TabsTrigger value="edit">Edit</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post content in markdown..."
                            className="min-h-[400px] font-mono"
                            required
                        />
                    </TabsContent>
                    <TabsContent value="preview">
                        <div className="min-h-[400px] rounded-md border p-4">
                            <article className="prose prose-slate dark:prose-invert max-w-none">
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </article>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Post'}
            </Button>
        </form>
    )
} 
