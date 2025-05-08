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
import { ThemeProvider } from '~/components/theme-provider'
import { NavMenu } from '~/components/nav-menu'

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
        title: 'Filip Sjölander',
        description: `Filip Sjölander's personal website`,
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
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <NavMenu />
          <div className="container mx-auto py-6">
            {children}
          </div>
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
