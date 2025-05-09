import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { Switch } from '~/components/ui/switch'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { eq } from 'drizzle-orm'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

export const Route = createFileRoute('/dashboard/blog/$postId/edit')({
    component: EditBlogPost,
    loader: async ({ params }) => {
        if (params.postId === 'new') return { post: null }
        const post = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, params.postId)
        })
        return { post }
    }
})

function EditBlogPost() {
    const { post } = Route.useLoaderData()
    const navigate = useNavigate()
    const [title, setTitle] = useState(post?.title ?? '')
    const [content, setContent] = useState(post?.content ?? '')
    const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
    const [published, setPublished] = useState(post?.published ?? false)
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            const postData = {
                title,
                slug,
                content,
                excerpt,
                published,
                updatedAt: new Date()
            }

            if (post) {
                await db.update(blogPosts)
                    .set(postData)
                    .where(eq(blogPosts.id, post.id))
            } else {
                await db.insert(blogPosts).values({
                    ...postData,
                    createdAt: new Date()
                })
            }

            navigate({ to: '/dashboard/blog' })
        } catch (error) {
            console.error('Failed to save post:', error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>{post ? 'Edit Post' : 'Create New Post'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <div data-color-mode="light">
                                <MDEditor
                                    value={content}
                                    onChange={(value) => setContent(value ?? '')}
                                    height={400}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="published"
                                checked={published}
                                onCheckedChange={setPublished}
                            />
                            <Label htmlFor="published">Published</Label>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate({ to: '/dashboard/blog' })}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save Post'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
} 
