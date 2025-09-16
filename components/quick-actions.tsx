"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Target, Heart } from "lucide-react"
import Link from "next/link"
import { QuickMoodEntry } from "@/components/quick-mood-entry"

interface QuickActionsProps {
  onUpdate: () => void
}

export function QuickActions({ onUpdate }: QuickActionsProps) {
  const [showQuickMood, setShowQuickMood] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button onClick={() => setShowQuickMood(true)} variant="outline" size="sm" className="bg-transparent">
          <Heart className="w-4 h-4 mr-2" />
          Quick Mood
        </Button>
        <Button asChild size="sm">
          <Link href="/habits/add">
            <Target className="w-4 h-4 mr-2" />
            Add Habit
          </Link>
        </Button>
      </div>

      <QuickMoodEntry
        open={showQuickMood}
        onClose={() => setShowQuickMood(false)}
        onSave={() => {
          onUpdate()
          setShowQuickMood(false)
        }}
      />
    </>
  )
}
