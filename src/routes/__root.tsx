import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router"
import type { ReactNode } from "react"

import appCss from "~/styles/app.css?url"
import { Providers } from "~/providers"
import { NavMenu } from "~/components/nav-menu"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Better Auth TanStack Starter"
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" }
    ]
  }),
  component: RootComponent
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="initial-scale=1, viewport-fit=cover, width=device-width"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="oklch(1 0 0)"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="oklch(0.145 0 0)"
        />

        <HeadContent />
      </head>

      <body suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-svh flex-col">
            <NavMenu />

            {children}
          </div>
        </Providers>

        <Scripts />
      </body>
    </html>
  )
}
