"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { JournalService, MOOD_TYPES, ENERGY_LEVELS } from "@/lib/journal"
import { Heart, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickMoodEntryProps {
  open: boolean
  onClose: () => void
  onSave: () => void
}

export function QuickMoodEntry({ open, onClose, onSave }: QuickMoodEntryProps) {
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [selectedEnergy, setSelectedEnergy] = useState<number>(3)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedMood) return

    setIsLoading(true)

    try {
      const mood = MOOD_TYPES.find((m) => m.id === selectedMood)
      if (!mood) return

      const today = new Date().toISOString().split("T")[0]

      JournalService.createEntry(user.id, {
        date: today,
        mood,
        energy: selectedEnergy,
        notes: notes.trim(),
        tags: [],
      })

      onSave()
      onClose()

      // Reset form
      setSelectedMood("")
      setSelectedEnergy(3)
      setNotes("")
    } catch (error) {
      console.error("Failed to save mood entry:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Quick Mood Check-in
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Mood Selection */}
          <div className="space-y-3">
            <h3 className="font-medium">How are you feeling?</h3>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_TYPES.slice(0, 10).map((mood) => (
                <Button
                  key={mood.id}
                  type="button"
                  variant={selectedMood === mood.id ? "default" : "outline"}
                  className={cn(
                    "aspect-square p-0 text-2xl hover:scale-110 transition-all",
                    selectedMood === mood.id && "ring-2 ring-offset-2",
                  )}
                  style={{
                    ringColor: selectedMood === mood.id ? mood.color : undefined,
                  }}
                  onClick={() => setSelectedMood(mood.id)}
                  title={mood.name}
                >
                  {mood.emoji}
                </Button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-center text-sm text-muted-foreground animate-fade-in">
                {MOOD_TYPES.find((m) => m.id === selectedMood)?.name}
              </p>
            )}
          </div>

          {/* Energy Level */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Energy Level
            </h3>
            <div className="flex gap-2">
              {ENERGY_LEVELS.map((level) => (
                <Button
                  key={level.value}
                  type="button"
                  variant={selectedEnergy === level.value ? "default" : "outline"}
                  className={cn("flex-1 text-xs h-8", selectedEnergy === level.value && "ring-2 ring-offset-1")}
                  style={{
                    backgroundColor: selectedEnergy === level.value ? level.color : undefined,
                    ringColor: selectedEnergy === level.value ? level.color : undefined,
                  }}
                  onClick={() => setSelectedEnergy(level.value)}
                >
                  {level.value}
                </Button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {ENERGY_LEVELS.find((l) => l.value === selectedEnergy)?.label}
            </p>
          </div>

          {/* Quick Notes */}
          <div className="space-y-2">
            <h3 className="font-medium">Quick note (optional)</h3>
            <Textarea
              placeholder="What's on your mind?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" disabled={!selectedMood || isLoading} className="flex-1">
              {isLoading ? "Saving..." : "Save Entry"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
