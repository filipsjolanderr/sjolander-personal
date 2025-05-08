import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { seo } from '~/utils/seo'
import { authClient } from '~/lib/auth-client'
import appCss from "~/styles/app.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Your App Name',
        description: `Your app description`,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument isAuthenticated={false} setIsAuthenticated={() => { }}>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
})

function RootComponent() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await authClient.getSession()
      setIsAuthenticated(!!data?.user)
    }
    checkAuth()
  }, [])

  return (
    <RootDocument isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({
  children,
  isAuthenticated,
  setIsAuthenticated
}: {
  children: React.ReactNode
  isAuthenticated: boolean
  setIsAuthenticated: (value: boolean) => void
}) {
  const handleSignOut = async () => {
    const { error } = await authClient.signOut()
    if (!error) {
      setIsAuthenticated(false)
    }
  }

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="p-2 flex gap-2 text-lg items-center">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>{' '}
          <Link
            to="/posts"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Posts
          </Link>{' '}
          <Link
            to="/users"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Users
          </Link>{' '}
          {!isAuthenticated ? (
            <>
              <Link
                to="/sign-in"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Sign In
              </Link>{' '}
              <Link
                to="/sign-up"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="text-red-500 hover:text-red-700"
            >
              Sign Out
            </button>
          )}
        </div>
        <hr />
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
