"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type MoodEntry, JournalService, ENERGY_LEVELS } from "@/lib/journal"
import { Edit, Trash2, Calendar, Zap } from "lucide-react"
import Link from "next/link"

interface JournalEntryCardProps {
  entry: MoodEntry
  onUpdate: () => void
  onDelete: () => void
}

export function JournalEntryCard({ entry, onUpdate, onDelete }: JournalEntryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return

    setIsDeleting(true)
    try {
      JournalService.deleteEntry(entry.id)
      onDelete()
    } catch (error) {
      console.error("Failed to delete entry:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (dateStr === today.toISOString().split("T")[0]) {
      return "Today"
    } else if (dateStr === yesterday.toISOString().split("T")[0]) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    }
  }

  const energyLevel = ENERGY_LEVELS.find((level) => level.value === entry.energy)

  return (
    <Card className="group hover:shadow-md transition-all duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-sm"
              style={{ backgroundColor: `${entry.mood.color}20` }}
            >
              {entry.mood.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{entry.mood.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(entry.date)}</span>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{entry.energy}/5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/journal/edit/${entry.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {(entry.notes || entry.tags.length > 0) && (
        <CardContent className="pt-0">
          {entry.notes && <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{entry.notes}</p>}

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {energyLevel && (
            <div className="mt-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: energyLevel.color }} />
              <span className="text-xs text-muted-foreground">{energyLevel.label} Energy</span>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
