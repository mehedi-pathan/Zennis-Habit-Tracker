"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()

    // Don't show prompt if already installed
    if (isInstalled) return

    const handler = (e: Event) => {
      console.log("[v0] beforeinstallprompt event received")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowInstallPrompt(true), 3000)
    }

    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", () => {
      console.log("[v0] App was installed via prompt")
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      window.removeEventListener("appinstalled", () => {})
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log("[v0] No deferred prompt available")
      return
    }

    try {
      console.log("[v0] Showing install prompt")
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log("[v0] User choice:", outcome)

      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
      }
    } catch (error) {
      console.error("[v0] Install prompt error:", error)
    }
  }

  // Don't show if installed or no prompt available
  if (!showInstallPrompt || isInstalled) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80 animate-slide-up shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Install Zennis Habit Tracker</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Install our app for a better experience with offline access!
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleInstall} className="flex-1">
                <Download className="w-4 h-4 mr-1" />
                Install
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowInstallPrompt(false)}>
                Later
              </Button>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="h-6 w-6 ml-2" onClick={() => setShowInstallPrompt(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
