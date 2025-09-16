"use client"

import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { MotivationSection } from "@/components/motivation-section"
import { InstallPrompt } from "@/components/install-prompt"
import { registerServiceWorker } from "@/lib/pwa"
import { useEffect } from "react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <FeaturesSection />
        <MotivationSection />
      </main>
      <InstallPrompt />
      <PWAInitializer />
    </div>
  )
}

function PWAInitializer() {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return null
}
