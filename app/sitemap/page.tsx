import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, LayoutDashboard, Target, BookOpen, BarChart3, Info, Mail, UserPlus, Plus, Settings } from "lucide-react"

const pages = [
  {
    title: "Home",
    href: "/",
    description: "Welcome page with hero section, features, and motivation",
    icon: Home,
    category: "Public",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Main user dashboard with habit overview and quick actions",
    icon: LayoutDashboard,
    category: "App",
  },
  {
    title: "Habits",
    href: "/habits",
    description: "Manage and track your daily habits",
    icon: Target,
    category: "App",
  },
  {
    title: "Add Habit",
    href: "/habits/add",
    description: "Create new habits with custom settings",
    icon: Plus,
    category: "App",
  },
  {
    title: "Journal",
    href: "/journal",
    description: "Mood journaling and reflection entries",
    icon: BookOpen,
    category: "App",
  },
  {
    title: "Add Journal Entry",
    href: "/journal/add",
    description: "Create new journal entries and mood logs",
    icon: Plus,
    category: "App",
  },
  {
    title: "Analytics",
    href: "/analytics",
    description: "Detailed insights and progress tracking",
    icon: BarChart3,
    category: "App",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn about Zennis and our mission",
    icon: Info,
    category: "Public",
  },
  {
    title: "Contact",
    href: "/contact",
    description: "Get in touch with our support team",
    icon: Mail,
    category: "Public",
  },
  {
    title: "Authentication",
    href: "/auth",
    description: "Sign up or log in to your account",
    icon: UserPlus,
    category: "Auth",
  },
  {
    title: "Sitemap",
    href: "/sitemap",
    description: "Complete overview of all pages and features",
    icon: Settings,
    category: "Utility",
  },
]

const categories = ["Public", "App", "Auth", "Utility"]

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Site Map</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete overview of all pages and features in the Zennis Habit Tracker application
          </p>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {category}
              </Badge>
              Pages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages
                .filter((page) => page.category === category)
                .map((page) => {
                  const Icon = page.icon
                  return (
                    <Card key={page.href} className="hover:shadow-lg transition-shadow group">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <Link href={page.href} className="hover:text-primary transition-colors">
                            {page.title}
                          </Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">{page.description}</CardDescription>
                        <div className="mt-4">
                          <Link href={page.href} className="text-sm text-primary hover:underline font-medium">
                            Visit Page →
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        ))}

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                If you can't find what you're looking for, feel free to reach out to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    Contact Support
                  </button>
                </Link>
                <Link href="/about">
                  <button className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                    Learn More
                  </button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
