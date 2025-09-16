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
import { Badge } from "@/components/ui/badge"
import { JournalService, MOOD_TYPES, ENERGY_LEVELS, COMMON_TAGS } from "@/lib/journal"
import { ArrowLeft, Heart, Zap, Tag, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AddJournalEntryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    moodId: "",
    energy: 3,
    notes: "",
    tags: [] as string[],
    customTag: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.moodId) return

    setIsLoading(true)

    try {
      const mood = MOOD_TYPES.find((m) => m.id === formData.moodId)
      if (!mood) return

      JournalService.createEntry(user.id, {
        date: formData.date,
        mood,
        energy: formData.energy,
        notes: formData.notes.trim(),
        tags: formData.tags,
      })

      router.push("/journal")
    } catch (error) {
      console.error("Failed to create journal entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] })
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  const addCustomTag = () => {
    if (formData.customTag.trim()) {
      addTag(formData.customTag.trim().toLowerCase())
      setFormData({ ...formData, customTag: "" })
    }
  }

  const selectedMood = MOOD_TYPES.find((m) => m.id === formData.moodId)
  const selectedEnergyLevel = ENERGY_LEVELS.find((l) => l.value === formData.energy)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4 group">
              <Link href="/journal">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Journal
              </Link>
            </Button>
            <h1 className="text-3xl font-bold mb-2">New Journal Entry</h1>
            <p className="text-muted-foreground">Reflect on your day and track your emotional well-being</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Journal Entry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  {/* Mood Selection */}
                  <div className="space-y-3">
                    <Label>How are you feeling? *</Label>
                    <div className="grid grid-cols-5 gap-3">
                      {MOOD_TYPES.map((mood) => (
                        <Button
                          key={mood.id}
                          type="button"
                          variant={formData.moodId === mood.id ? "default" : "outline"}
                          className={cn(
                            "aspect-square p-0 text-2xl hover:scale-110 transition-all flex flex-col gap-1",
                            formData.moodId === mood.id && "ring-2 ring-offset-2",
                          )}
                          style={{
                            ringColor: formData.moodId === mood.id ? mood.color : undefined,
                          }}
                          onClick={() => setFormData({ ...formData, moodId: mood.id })}
                        >
                          <span>{mood.emoji}</span>
                          <span className="text-xs font-normal">{mood.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Energy Level */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Energy Level
                    </Label>
                    <div className="flex gap-2">
                      {ENERGY_LEVELS.map((level) => (
                        <Button
                          key={level.value}
                          type="button"
                          variant={formData.energy === level.value ? "default" : "outline"}
                          className={cn(
                            "flex-1 flex flex-col gap-1 h-16",
                            formData.energy === level.value && "ring-2 ring-offset-1",
                          )}
                          style={{
                            backgroundColor: formData.energy === level.value ? level.color : undefined,
                            ringColor: formData.energy === level.value ? level.color : undefined,
                          }}
                          onClick={() => setFormData({ ...formData, energy: level.value })}
                        >
                          <span className="text-lg font-bold">{level.value}</span>
                          <span className="text-xs">{level.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes & Reflections</Label>
                    <Textarea
                      id="notes"
                      placeholder="What happened today? How are you feeling? What are you grateful for?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={6}
                      className="resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </Label>

                    {/* Selected Tags */}
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Common Tags */}
                    <div className="flex flex-wrap gap-2">
                      {COMMON_TAGS.filter((tag) => !formData.tags.includes(tag)).map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs bg-transparent"
                          onClick={() => addTag(tag)}
                        >
                          + {tag}
                        </Button>
                      ))}
                    </div>

                    {/* Custom Tag Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom tag..."
                        value={formData.customTag}
                        onChange={(e) => setFormData({ ...formData, customTag: e.target.value })}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={addCustomTag}>
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Preview */}
                  {selectedMood && (
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <h3 className="font-medium mb-3">Preview</h3>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${selectedMood.color}20` }}
                        >
                          {selectedMood.emoji}
                        </div>
                        <div>
                          <h4 className="font-semibold">{selectedMood.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {selectedEnergyLevel?.label} Energy • {formData.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading || !formData.moodId} className="flex-1">
                      {isLoading ? "Saving..." : "Save Entry"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/journal">Cancel</Link>
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
