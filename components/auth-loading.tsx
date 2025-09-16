"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { Calendar, BarChart3, CheckCircle } from "lucide-react"

interface AuthLoadingProps {
  type: "login" | "signup"
  onComplete: () => void
}

export default function AuthLoading({ type, onComplete }: AuthLoadingProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = mounted
    ? resolvedTheme === "dark"
      ? "/images/zennis-logo-light.png"
      : "/images/zennis-logo-dark.png"
    : "/images/zennis-logo-dark.png"

  const steps =
    type === "signup"
      ? ["Creating your account...", "Setting up your profile...", "Preparing your dashboard..."]
      : ["Verifying credentials...", "Loading your data...", "Preparing your dashboard..."]

  useEffect(() => {
    const duration = 2500 // 2.5 seconds total
    const stepDuration = duration / steps.length
    const progressInterval = 50 // Update every 50ms

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (duration / progressInterval)

        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        setCurrentStep(Math.min(stepIndex, steps.length - 1))

        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300) // Small delay before completing
          return 100
        }

        return newProgress
      })
    }, progressInterval)

    return () => clearInterval(interval)
  }, [onComplete, steps.length])

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 text-center space-y-8">
        {/* Logo */}
        <div className="w-24 h-20 mx-auto flex items-center justify-center animate-pulse">
          <Image
            src={logoSrc || "/placeholder.svg"}
            alt="Zennis Habit Tracker"
            width={120}
            height={80}
            className="object-contain"
            priority
            onError={(e) => {
              e.currentTarget.style.display = "none"
              const fallback = e.currentTarget.parentElement?.querySelector(".fallback-icon")
              if (fallback) fallback.classList.remove("hidden")
            }}
          />
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl items-center justify-center fallback-icon hidden">
            <div className="relative">
              <Calendar className="w-8 h-8 text-white" />
              <BarChart3 className="w-4 h-4 text-white/80 absolute -bottom-1 -right-1" />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{type === "signup" ? "Welcome to Zennis!" : "Welcome back!"}</h2>

          <div className="space-y-2">
            <p className="text-muted-foreground animate-fade-in">{steps[currentStep]}</p>

            {/* Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Success Checkmark (appears at the end) */}
        {progress >= 95 && (
          <div className="animate-fade-in">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
          </div>
        )}
      </div>
    </div>
  )
}
