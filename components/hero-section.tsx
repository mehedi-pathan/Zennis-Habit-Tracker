"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Target, TrendingUp, Calendar, BarChart3 } from "lucide-react"

const motivationalQuotes = [
  "Small habits, big changes.",
  "Progress, not perfection.",
  "Your future self will thank you.",
  "Consistency is the key to success.",
  "Every day is a fresh start.",
]

export function HeroSection() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary rounded-full blur-3xl animate-pulse-gentle delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl animate-pulse-gentle delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Icon */}
          <div className="mb-6 sm:mb-8 animate-bounce-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative flex items-center justify-center">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white/90" />
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white/70 absolute -bottom-1 -right-1" />
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in text-balance text-foreground leading-tight">
            Build <span className="text-primary">Better Habits</span>
            <br />
            Track Your <span className="text-secondary">Wellness</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-foreground/90 mb-6 sm:mb-8 animate-slide-up max-w-2xl mx-auto text-pretty px-2">
            Transform your life with Zennis - the elegant habit tracker and mood journal that helps you build lasting
            positive changes, one day at a time.
          </p>

          {/* Motivational Quote */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <p className="text-base sm:text-lg font-medium text-foreground italic px-4" key={currentQuote}>
              "{motivationalQuotes[currentQuote]}"
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 animate-slide-up px-4">
            <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group w-full sm:w-auto">
              <Link href="/auth">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 h-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-transparent text-foreground w-full sm:w-auto"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto animate-slide-up px-4">
            <div className="flex items-center justify-center space-x-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border hover:bg-card/80 transition-colors">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <span className="font-medium text-foreground text-sm sm:text-base">Habit Tracking</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border hover:bg-card/80 transition-colors">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-secondary flex-shrink-0" />
              <span className="font-medium text-foreground text-sm sm:text-base">Mood Journal</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border hover:bg-card/80 transition-colors">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" />
              <span className="font-medium text-foreground text-sm sm:text-base">Progress Analytics</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 animate-fade-in px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">10K+</div>
              <div className="text-xs sm:text-sm text-foreground/80">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-secondary">50K+</div>
              <div className="text-xs sm:text-sm text-foreground/80">Habits Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">95%</div>
              <div className="text-xs sm:text-sm text-foreground/80">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">4.9★</div>
              <div className="text-xs sm:text-sm text-foreground/80">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-4 sm:left-10 animate-bounce-in delay-1000">
        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary/60" />
      </div>
      <div className="absolute top-1/3 right-4 sm:right-10 animate-bounce-in delay-2000">
        <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-secondary/60" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 animate-bounce-in delay-3000">
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-accent/60" />
      </div>
    </section>
  )
}
