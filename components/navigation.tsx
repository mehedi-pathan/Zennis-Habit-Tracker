"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DesktopShortcut } from "@/components/desktop-shortcut"
import { Menu, X, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const newsItems = [
  "🌟 New streak celebration animations now available!",
  "💚 Join 10,000+ users building better habits daily",
  "📱 Download our app for offline habit tracking",
  "🎯 Set your wellness goals and track progress",
  "💜 Mental health support: Call 988 for crisis support",
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isMenuOpen])

  const logoSrc = mounted
    ? resolvedTheme === "dark"
      ? "/images/zennis-logo-light.png"
      : "/images/zennis-logo-dark.png"
    : "/images/zennis-logo-dark.png"

  return (
    <>
      {/* Top News Ticker Bar */}
      <div
        className={cn(
          "bg-gradient-to-r from-primary/10 to-secondary/10 border-b transition-all duration-300",
          isScrolled ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
        )}
      >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center text-sm text-foreground">
            <div className="animate-fade-in" key={currentNewsIndex}>
              {newsItems[currentNewsIndex]}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={cn(
          "sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b transition-all duration-300",
          isScrolled ? "shadow-lg" : "",
        )}
        ref={mobileMenuRef}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative h-8 w-[120px]">
                <Image
                  src={logoSrc || "/placeholder.svg"}
                  alt="Zennis Habit Tracker"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                  onError={(e) => {
                    console.log("[v0] Logo failed to load:", logoSrc)
                    // Fallback to text logo
                    e.currentTarget.style.display = "none"
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="sr-only">Zennis</span>
                </div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors relative group">
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/habits" className="text-foreground hover:text-primary transition-colors relative group">
                Habits
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/journal" className="text-foreground hover:text-primary transition-colors relative group">
                Journal
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/analytics" className="text-foreground hover:text-primary transition-colors relative group">
                Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors relative group">
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              <DesktopShortcut />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Phone className="h-4 w-4" />
                <span className="sr-only">Support</span>
              </Button>
              <ThemeToggle />
              <Button asChild className="hidden md:inline-flex">
                <Link href="/auth">Get Started</Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t animate-slide-up">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/habits"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Habits
                </Link>
                <Link
                  href="/journal"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Journal
                </Link>
                <Link
                  href="/analytics"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  href="/about"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-foreground hover:text-primary transition-colors px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Button asChild className="mt-4">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
