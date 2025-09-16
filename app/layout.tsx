import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Navigation } from "@/components/navigation"
import { BottomNavigation } from "@/components/bottom-navigation"
import { FloatingSocialBar } from "@/components/floating-social-bar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Zennis Habit Tracker - Build Better Habits",
  description:
    "A modern, elegant habit tracker and mood journal to help you build better habits and track your wellness journey.",
  generator: "Zennis Habit Tracker",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#8B5CF6" },
    { media: "(prefers-color-scheme: dark)", color: "#A855F7" },
  ],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zennis Habit Tracker",
  },
}

function PWAInitializer() {
  if (typeof window !== "undefined") {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[v0] SW registered successfully:", registration.scope)

            // Check for updates
            registration.addEventListener("updatefound", () => {
              console.log("[v0] SW update found")
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    console.log("[v0] New SW installed, refresh recommended")
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error("[v0] SW registration failed:", error)
          })
      })
    }

    const checkPWACriteria = () => {
      const criteria = {
        serviceWorker: "serviceWorker" in navigator,
        manifest: !!document.querySelector('link[rel="manifest"]'),
        https: location.protocol === "https:" || location.hostname === "localhost",
        standalone: window.matchMedia("(display-mode: standalone)").matches,
      }
      console.log("[v0] PWA Criteria:", criteria)
    }

    // Run check after a short delay to ensure DOM is ready
    setTimeout(checkPWACriteria, 1000)
  }
  return null
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zennis Habit Tracker" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange={false}>
            <AuthProvider>
              <Navigation />
              <main className="min-h-screen pb-20 md:pb-0">{children}</main>
              <Footer />
              <BottomNavigation />
              <FloatingSocialBar />
              <Toaster />
              <PWAInitializer />
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
