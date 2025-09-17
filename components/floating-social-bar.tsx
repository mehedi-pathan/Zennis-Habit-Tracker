"use client"

import { Github, Instagram, Facebook, Youtube, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const socialLinks = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://instagram.com/zennis",
    color: "hover:text-black-400",
  },
  {
    icon: Facebook,
    label: "Facebook",
    href: "https://facebook.com/zennis",
    color: "hover:text-black-600",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://youtube.com/zennis",
    color: "hover:text-black-500",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/zennis",
    color: "hover:text-black-400",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:hello@zennis.app",
    color: "hover:text-black-400",
  },
]

export function FloatingSocialBar() {
  return (
    <TooltipProvider>
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col space-y-2 bg-card/80 backdrop-blur-md rounded-full p-2 shadow-lg border">
          {socialLinks.map((social, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`w-10 h-10 rounded-full hover:scale-110 transition-all duration-200 ${social.color}`}
                  asChild
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{social.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
