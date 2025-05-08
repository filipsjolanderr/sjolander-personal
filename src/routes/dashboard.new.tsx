import { createFileRoute, redirect } from '@tanstack/react-router'
import { BlogEditor } from '~/components/blog/BlogEditor'
import { db } from '~/db'
import { blogPosts } from '~/db/schema/schema'
import { Button } from '~/components/ui/button'
import { Link } from '@tanstack/react-router'
import { authClient } from '~/lib/auth-client'

export const Route = createFileRoute('/dashboard/new')({
  component: NewPostPage,
  beforeLoad: async ({ context }) => {
    if (!(await authClient.getSession()).data?.user) {
      throw redirect({
        to: '/auth/sign-in',
      })
    }
  },
})

function NewPostPage() {
  const user = authClient.useSession().data!.user

  const handleCreatePost = async (data: { title: string; content: string; excerpt: string }) => {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')


    await db.insert(blogPosts).values({
      content: data.content,
      title: data.title,
      slug,
      excerpt: data.excerpt,
      authorId: user!.id,
      published: false,
    })

    // Redirect back to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Create New Post</h1>
        <Button asChild variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>

      <BlogEditor onSubmit={handleCreatePost} />
    </div>
  )
}
