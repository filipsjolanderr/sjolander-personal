import { cn } from "~/lib/utils"
import { AuthCard } from "@daveyplate/better-auth-ui"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$pathname")({
  component: RouteComponent
})

function RouteComponent() {
  console.log("RouteComponent")
  console.log(Route.useParams())
  const { pathname } = Route.useParams() as { pathname: string }

  return (
    <main className="flex grow flex-col items-center justify-center gap-4 p-4 max-w-md mx-auto">
      <AuthCard pathname={pathname} />

      <p
        className={cn(
          ["callback", "settings", "sign-out"].includes(pathname) && "hidden",
          "text-muted-foreground text-xs"
        )}
      >
      </p>
    </main>
  )
}
