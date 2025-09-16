"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Zap, Target, Trophy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function MotivationSection() {
  const motivationalStats = [
    {
      icon: <Zap className="w-6 h-6" />,
      number: "21",
      label: "Days to Form a Habit",
      description: "Science-backed approach to lasting change",
    },
    {
      icon: <Target className="w-6 h-6" />,
      number: "85%",
      label: "Success Rate",
      description: "Users who track daily see better results",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      number: "10K+",
      label: "Goals Achieved",
      description: "Community milestones reached together",
    },
  ]

  const workoutImages = [
    {
      src: "/images/workout-1.jpeg",
      alt: "Woman doing strength training with dumbbells",
      title: "Strength & Power",
    },
    {
      src: "/images/workout-2.jpeg",
      alt: "Woman doing plank exercise on beach",
      title: "Mindful Movement",
    },
    {
      src: "/images/workout-3.jpeg",
      alt: "Man doing pull-ups outdoors",
      title: "Outdoor Fitness",
    },
    {
      src: "/images/workout-4.jpeg",
      alt: "Man doing box jumps in gym",
      title: "High Intensity",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Transform Your Life Through{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Consistent Action
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Every champion was once a beginner who refused to give up. Your fitness journey starts with a single step,
            tracked with intention and celebrated with purpose.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {motivationalStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-2">{stat.label}</div>
                <p className="text-muted-foreground text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {workoutImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl aspect-[3/4]">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {image.title}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center space-y-6 p-8 bg-card/50 backdrop-blur-sm rounded-2xl border">
            <h3 className="text-2xl font-bold">Ready to Start Your Journey?</h3>
            <p className="text-muted-foreground max-w-md text-center">
              Join thousands who have transformed their lives through consistent habit tracking and mindful wellness
              practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link href="/auth">
                  Start Tracking Today
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
