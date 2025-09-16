"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useEffect } from "react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function DesktopShortcut() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()

    const handler = (e: Event) => {
      console.log("[v0] beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handler)
    window.addEventListener("appinstalled", () => {
      console.log("[v0] App was installed")
      setIsInstalled(true)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
      window.removeEventListener("appinstalled", () => {})
    }
  }, [])

  const handleInstall = async () => {
    console.log("[v0] Install button clicked, deferredPrompt:", !!deferredPrompt)

    if (isInstalled) {
      console.log("[v0] App is already installed")
      return
    }

    if (deferredPrompt) {
      try {
        console.log("[v0] Showing install prompt")
        await deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log("[v0] User choice:", outcome)

        if (outcome === "accepted") {
          setDeferredPrompt(null)
        }
      } catch (error) {
        console.error("[v0] Install prompt error:", error)
      }
    } else {
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)
      const isEdge = /Edg/.test(navigator.userAgent)
      const isFirefox = /Firefox/.test(navigator.userAgent)
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)

      let message = "To install Zennis Habit Tracker:\n"

      if (isChrome || isEdge) {
        message +=
          "1. Click the install icon (⊕) in your address bar\n2. Or go to browser menu > Install Zennis Habit Tracker"
      } else if (isFirefox) {
        message += "1. Go to browser menu (☰)\n2. Look for 'Install' option"
      } else if (isSafari) {
        message += "1. Tap the Share button (□↗)\n2. Select 'Add to Home Screen'"
      } else {
        message += "1. Go to your browser menu\n2. Look for 'Install' or 'Add to Home Screen' option"
      }

      alert(message)
    }
  }

  if (isInstalled) {
    return null // Don't show install button if already installed
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleInstall} className="h-8 w-8 hover:bg-primary/10">
            <Download className="h-4 w-4" />
            <span className="sr-only">Install Desktop App</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Install Desktop App</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
