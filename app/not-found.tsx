"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft, Search, RefreshCw } from "lucide-react"
import { useTheme } from "next-themes"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted
    ? resolvedTheme === "light"
      ? "/images/zennis-logo-light.png"
      : "/images/zennis-logo-dark.png"
    : "/images/zennis-logo-dark.png"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center">
          <Card className="shadow-2xl border-border/50 animate-slide-up">
            <CardHeader className="space-y-6">
              {/* Logo */}
              <div className="w-24 h-20 mx-auto flex items-center justify-center">
                <Image
                  src={logoSrc || "/placeholder.svg"}
                  alt="Zennis Habit Tracker"
                  width={140}
                  height={80}
                  className="object-contain"
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    const fallback = e.currentTarget.parentElement?.querySelector(".fallback-text")
                    if (fallback) fallback.classList.remove("hidden")
                  }}
                />
                <div className="fallback-text hidden text-2xl font-bold text-primary">Zennis</div>
              </div>

              {/* 404 Error */}
              <div className="space-y-2">
                <h1 className="text-6xl font-bold text-primary animate-bounce">404</h1>
                <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Oops! The page you're looking for doesn't exist or has been moved.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Helpful suggestions */}
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Check the URL for typos
                </p>
                <p className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Try refreshing the page
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>

                <Button variant="outline" asChild className="w-full bg-transparent">
                  <Link href="/dashboard">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>

              {/* Contact support */}
              <div className="pt-4 border-t">
                <p className="text-xs text-center text-muted-foreground">
                  Still having trouble?{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
