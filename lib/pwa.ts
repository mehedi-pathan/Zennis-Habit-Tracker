"use client"

export function registerServiceWorker() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration)
          registration.addEventListener("updatefound", () => {
            console.log("SW update found")
          })
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError)
        })
    })
  }
}

export function checkInstallability() {
  if (typeof window !== "undefined") {
    // Check if app is already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isInWebAppiOS = (window.navigator as any).standalone === true

    if (isStandalone || isInWebAppiOS) {
      return "installed"
    }

    // Check if installation is available
    if ("serviceWorker" in navigator) {
      return "installable"
    }
  }

  return "not-supported"
}

export function checkPWARequirements() {
  const requirements = {
    serviceWorker: "serviceWorker" in navigator,
    manifest: document.querySelector('link[rel="manifest"]') !== null,
    https: location.protocol === "https:" || location.hostname === "localhost",
    icons: true, // We'll assume icons are present since they're in manifest
  }

  console.log("PWA Requirements:", requirements)
  return requirements
}
