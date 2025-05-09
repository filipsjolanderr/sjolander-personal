import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export const Route = createFileRoute('/dashboard/_layout')({
    component: DashboardLayout,
})

function DashboardLayout() {
    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-[240px_1fr] gap-8">
                <aside>
                    <Card>
                        <CardHeader>
                            <CardTitle>Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link to="/dashboard/blog">
                                <Button variant="ghost" className="w-full justify-start">
                                    Blog Posts
                                </Button>
                            </Link>
                            <Link to="/dashboard/settings">
                                <Button variant="ghost" className="w-full justify-start">
                                    Settings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </aside>
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
} 
