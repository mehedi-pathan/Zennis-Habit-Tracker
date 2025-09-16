"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, requireAuth, router])

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center animate-pulse-gentle">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Loading...</h2>
              <p className="text-muted-foreground">Please wait while we prepare your experience</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
