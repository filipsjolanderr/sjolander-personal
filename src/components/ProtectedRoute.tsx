import { useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { authClient } from "~/lib/auth-client"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await authClient.getSession()
            if (!data?.user) {
                navigate({ to: "/sign-in" })
            }
            setIsLoading(false)
        }
        checkAuth()
    }, [navigate])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return <>{children}</>
} 
