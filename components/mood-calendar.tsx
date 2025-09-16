"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { type MoodEntry, MOOD_TYPES } from "@/lib/journal"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MoodCalendarProps {
  entries: MoodEntry[]
  selectedDate: string
  onDateSelect: (date: string) => void
}

export function MoodCalendar({ entries, selectedDate, onDateSelect }: MoodCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEntryForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return entries.find((entry) => entry.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigateMonth("prev")}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold">{monthName}</h3>
        <Button variant="ghost" size="icon" onClick={() => navigateMonth("next")}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="aspect-square" />
          }

          const dateStr = day.toISOString().split("T")[0]
          const entry = getEntryForDate(day)
          const isSelected = dateStr === selectedDate
          const isToday = dateStr === new Date().toISOString().split("T")[0]

          return (
            <Button
              key={dateStr}
              variant="ghost"
              className={cn(
                "aspect-square p-0 h-auto relative text-xs hover:bg-muted/50",
                isSelected && "ring-2 ring-primary",
                isToday && "bg-primary/10",
              )}
              onClick={() => onDateSelect(dateStr)}
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <span className={cn("text-xs", isToday && "font-bold")}>{day.getDate()}</span>
                {entry && (
                  <div
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: entry.mood.color }}
                    title={entry.mood.name}
                  />
                )}
              </div>
            </Button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs">
        {MOOD_TYPES.slice(0, 5).map((mood) => (
          <div key={mood.id} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: mood.color }} />
            <span className="text-muted-foreground">{mood.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
