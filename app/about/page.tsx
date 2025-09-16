import type { Metadata } from "next"
import { Heart, Target, Users, Shield, Sparkles, Award, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About - Zennis Habit Tracker",
  description:
    "Learn about Zennis, the mindful habit tracking app designed to help you build lasting positive changes in your life.",
}

export default function AboutPage() {
  const features = [
    {
      icon: Target,
      title: "Goal-Oriented Tracking",
      description: "Set meaningful goals and track your progress with visual streaks and achievements.",
      image: "/images/team-workout-1.jpeg",
    },
    {
      icon: Heart,
      title: "Mindful Approach",
      description: "Focus on self-compassion and sustainable habit building rather than perfectionism.",
      image: "/images/team-workout-2.jpeg",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals on their wellness journey.",
      image: "/images/team-workout-3.jpeg",
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your data stays private and secure with local storage and encryption.",
      image: "/images/about-hero.jpeg",
    },
    {
      icon: Sparkles,
      title: "Personalized Experience",
      description: "Customize your tracking experience with themes, categories, and personal insights.",
      image: "/images/team-workout-1.jpeg",
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Celebrate milestones with badges, streaks, and motivational rewards.",
      image: "/images/team-workout-2.jpeg",
    },
  ]

  const team = [
    {
      name: "Sarah Chen",
      role: "Founder & CEO",
      bio: "Former wellness coach passionate about sustainable habit formation and helping people achieve their fitness goals.",
      image: "/images/team-workout-1.jpeg",
      achievements: ["10+ years coaching", "Certified trainer", "Wellness expert"],
    },
    {
      name: "Marcus Johnson",
      role: "Lead Developer",
      bio: "Full-stack developer with expertise in user experience and mental health apps, dedicated to creating intuitive interfaces.",
      image: "/images/team-workout-2.jpeg",
      achievements: ["React specialist", "UX designer", "Health tech expert"],
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Wellness Advisor",
      bio: "Licensed therapist specializing in behavioral psychology and habit formation, ensuring our approach is scientifically sound.",
      image: "/images/team-workout-3.jpeg",
      achievements: ["PhD Psychology", "Licensed therapist", "Research published"],
    },
  ]

  const stats = [
    { number: "50K+", label: "Active Users", description: "Building better habits daily" },
    { number: "1M+", label: "Habits Tracked", description: "Successful completions logged" },
    { number: "95%", label: "User Satisfaction", description: "Love using Zennis" },
    { number: "4.8★", label: "App Rating", description: "Average user rating" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/images/about-hero.jpeg" alt="Fitness motivation" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-secondary/80" />
        </div>

        <div className="relative z-10 text-center text-white px-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-bounce-in">
            <Heart className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Empower Your
            <span className="block bg-gradient-to-r from-white to-secondary-foreground bg-clip-text text-transparent">
              Wellness Journey
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up opacity-90">
            Transform your life through mindful habit tracking, community support, and evidence-based wellness
            practices.
          </p>
          <Button size="lg" variant="secondary" className="animate-slide-up group">
            <Link href="/auth" className="flex items-center">
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Stats Section */}
        <section className="py-20 -mt-20 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center bg-card/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="font-semibold text-foreground mb-1">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We believe that lasting change comes from mindful, consistent action. Zennis is designed to support your
                wellness journey with compassion, not judgment.
              </p>
              <div className="space-y-4">
                {[
                  "Build sustainable, positive habits",
                  "Provide mindful tracking tools",
                  "Foster supportive communities",
                  "Celebrate every small victory",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/team-workout-1.jpeg"
                  alt="Wellness journey"
                  width={600}
                  height={400}
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Why Choose Zennis?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the features that make Zennis the perfect companion for your wellness journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card
                  key={index}
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Passionate experts dedicated to your wellness success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-secondary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.achievements.map((achievement, i) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary via-primary to-secondary text-white overflow-hidden relative animate-slide-up">
            <div className="absolute inset-0 bg-[url('/images/about-hero.jpeg')] bg-cover bg-center opacity-20" />
            <CardContent className="relative p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Life?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of users who are building better habits and achieving their wellness goals with Zennis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link href="/auth" className="flex items-center">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
