"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HabitsService, HABIT_CATEGORIES, HABIT_ICONS } from "@/lib/habits"
import { ArrowLeft, Target } from "lucide-react"
import Link from "next/link"

export default function AddHabitPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    color: "#8B5CF6",
    icon: "🎯",
    frequency: "daily" as "daily" | "weekly" | "custom",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)

    try {
      const categoryData = HABIT_CATEGORIES.find((cat) => cat.id === formData.category)

      HabitsService.createHabit(user.id, {
        title: formData.title,
        description: formData.description,
        category: categoryData?.name || formData.category,
        color: categoryData?.color || formData.color,
        icon: formData.icon,
        frequency: formData.frequency,
      })

      router.push("/habits")
    } catch (error) {
      console.error("Failed to create habit:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = HABIT_CATEGORIES.find((cat) => cat.id === formData.category)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 group">
              <Link href="/habits">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Habits
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">Create New Habit</h1>
            <p className="text-muted-foreground">Start building a positive habit that will improve your daily life</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Habit Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Habit Name *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Drink 8 glasses of water"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add more details about your habit..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {HABIT_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Icon */}
                  <div className="space-y-2">
                    <Label>Choose an Icon</Label>
                    <div className="grid grid-cols-10 gap-2">
                      {HABIT_ICONS.map((icon) => (
                        <Button
                          key={icon}
                          type="button"
                          variant={formData.icon === icon ? "default" : "outline"}
                          className="aspect-square p-0 text-lg"
                          onClick={() => setFormData({ ...formData, icon })}
                        >
                          {icon}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value: "daily" | "weekly" | "custom") =>
                        setFormData({ ...formData, frequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preview */}
                  <div className="p-4 border rounded-lg bg-muted/20">
                    <h3 className="font-medium mb-3">Preview</h3>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{
                          backgroundColor: `${selectedCategory?.color || formData.color}20`,
                          color: selectedCategory?.color || formData.color,
                        }}
                      >
                        {formData.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{formData.title || "Your habit name"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {selectedCategory?.name || "Category"} • {formData.frequency}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading} className="flex-1">
                      {isLoading ? "Creating..." : "Create Habit"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/habits">Cancel</Link>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
