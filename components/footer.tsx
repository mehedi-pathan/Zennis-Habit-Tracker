"use client"

import type React from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, MapPin, Phone, Github, Instagram, Coins, Facebook } from "lucide-react"

export function Footer() {
  const [email, setEmail] = useState("")
  const { theme } = useTheme()

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log("Newsletter signup:", email)
    setEmail("")
    // Show success message
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={theme === "light" ? "/images/zennis-logo-light.png" : "/images/zennis-logo-dark.png"}
                  alt="Zennis Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <p className="text-muted-foreground text-sm text-pretty leading-relaxed">
              Transform your life with elegant habit tracking and mood journaling. Build better habits, one day at a
              time.
            </p>
            <div className="flex space-x-2">
              {/* Social Media Buttons */}
              <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
                <a href="https://facebook.com/zennis" target="_blank" rel="noopener noreferrer">
                  <Facebook className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
                <a href="https://instagram.com/zennis" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8" asChild>
                <a href="https://github.com/zennis" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            </div>
            {/* Donation Button */}
            <div className="pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300"
                asChild
              >
                <a
                  href="https://www.binance.com/en/my/wallet/account/payment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2"
                >
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Support Our Work</span>
                </a>
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">Help us keep Zennis free and open-source</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Dashboard
              </Link>
              <Link href="/habits" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Habit Tracker
              </Link>
              <Link
                href="/journal"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Mood Journal
              </Link>
              <Link
                href="/analytics"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Analytics
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm break-all">hello@zennis.app</span>
              </div>
              <div className="flex items-start space-x-2 text-muted-foreground">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Crisis Support</p>
                <p className="text-xs text-muted-foreground mt-1">Call 988 for mental health support</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Get wellness tips and app updates delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background text-sm"
              />
              <Button type="submit" className="w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t bg-muted/20">
  <div className="container mx-auto px-4 py-4 sm:py-6">
    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
      <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
        © {currentYear} Zennis Habit Tracker. All rights reserved.
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left order-last sm:order-none">
        Design & Developed by{" "}
        <a
          href="https://mehedipathan.online"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Mehedi Pathan
        </a>
      </div>
      <div className="flex justify-center sm:justify-end space-x-4 text-xs sm:text-sm">
        <Link
          href="/privacy"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </div>
  </div>
</div>

    </footer>
  )
}
