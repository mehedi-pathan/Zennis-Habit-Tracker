import { Card, CardContent } from "@/components/ui/card"
import { Target, Heart, BarChart3, Calendar, Award, Smartphone, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Smart Habit Tracking",
    description: "Create and track daily habits with intelligent reminders and streak counters.",
    color: "text-primary",
  },
  {
    icon: Heart,
    title: "Mood Journal",
    description: "Log your emotions with our intuitive mood selector and daily reflection notes.",
    color: "text-secondary",
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Visualize your journey with beautiful charts and insightful progress reports.",
    color: "text-accent",
  },
  {
    icon: Calendar,
    title: "Daily Dashboard",
    description: "Get a complete overview of your habits, mood, and progress in one place.",
    color: "text-primary",
  },
  {
    icon: Award,
    title: "Achievement System",
    description: "Earn badges and celebrate milestones to stay motivated on your journey.",
    color: "text-secondary",
  },
  {
    icon: Smartphone,
    title: "Offline Ready",
    description: "Access your habits and journal entries anywhere, even without internet.",
    color: "text-accent",
  },
  {
    icon: Zap,
    title: "Quick Actions",
    description: "Log habits and moods instantly with our streamlined, user-friendly interface.",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays on your device. No cloud storage, complete privacy guaranteed.",
    color: "text-secondary",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Wellness Success
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Discover powerful features designed to help you build lasting habits and track your mental wellness journey
            with ease and elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-balance">{feature.title}</h3>
                <p className="text-muted-foreground text-sm text-pretty">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground mb-4">
            <Shield className="w-4 h-4" />
            <span>100% Private • No Account Required • Works Offline</span>
          </div>
        </div>
      </div>
    </section>
  )
}
