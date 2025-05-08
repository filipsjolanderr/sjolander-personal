import { createRootRoute, createRouter, createRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { createBrowserRouter } from '@tanstack/react-router';

// Create a client
const queryClient = new QueryClient();

// Create the root route
const rootRoute = createRootRoute({
    component: () => (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <a href="/" className="text-xl font-bold text-gray-900">
                                        Your Name
                                    </a>
                                </div>
                                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                    <a href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                                        Home
                                    </a>
                                    <a href="/projects" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                                        Projects
                                    </a>
                                    <a href="/blog" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300">
                                        Blog
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                </header>
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Route content will be rendered here */}
                </main>
            </div>
            <TanStackRouterDevtools />
            <ReactQueryDevtools />
        </QueryClientProvider>
    ),
});

// Create the router
const routeTree = rootRoute.addChildren([
    createRoute({
        getParentRoute: () => rootRoute,
        path: '/',
        component: () => <div>Home Page</div>,
    }),
    createRoute({
        getParentRoute: () => rootRoute,
        path: '/projects',
        component: () => <div>Projects Page</div>,
    }),
    createRoute({
        getParentRoute: () => rootRoute,
        path: '/blog',
        component: () => <div>Blog Page</div>,
    }),
    createRoute({
        getParentRoute: () => rootRoute,
        path: '/admin',
        component: () => <div>Admin Page</div>,
    }),
]);

const router = createRouter({ routeTree });

// Register the router for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return <router.Provider />;
} 
