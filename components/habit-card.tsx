"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type Habit, HabitsService } from "@/lib/habits"
import { Check, Flame, Trophy, Edit, Trash2, Calendar } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface HabitCardProps {
  habit: Habit
  onToggle: () => void
  onDelete: () => void
}

export function HabitCard({ habit, onToggle, onDelete }: HabitCardProps) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [streakInfo, setStreakInfo] = useState({ current: 0, longest: 0 })

  useEffect(() => {
    setIsCompleted(HabitsService.isHabitCompletedToday(habit.id))
    setStreakInfo(HabitsService.getStreakInfo(habit.id))
  }, [habit.id])

  const handleToggle = () => {
    setIsAnimating(true)
    onToggle()

    // Update local state
    setIsCompleted(!isCompleted)

    // Update streak info after toggle
    setTimeout(() => {
      setStreakInfo(HabitsService.getStreakInfo(habit.id))
      setIsAnimating(false)
    }, 300)
  }

  const completionPercentage =
    habit.frequency === "daily" ? (streakInfo.current > 0 ? Math.min((streakInfo.current / 7) * 100, 100) : 0) : 50

  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        isCompleted && "ring-2 ring-primary/20 bg-primary/5",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
              style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
            >
              {habit.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{habit.title}</h3>
              {habit.description && <p className="text-sm text-muted-foreground mt-1">{habit.description}</p>}
            </div>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/habits/edit/${habit.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Completion Button */}
        <Button
          onClick={handleToggle}
          variant={isCompleted ? "default" : "outline"}
          className={cn(
            "w-full group/button transition-all duration-300",
            isCompleted && "bg-primary hover:bg-primary/90",
            isAnimating && "scale-95",
          )}
        >
          <Check
            className={cn(
              "w-4 h-4 mr-2 transition-all duration-300",
              isCompleted ? "scale-100" : "scale-0",
              isAnimating && "animate-bounce-in",
            )}
          />
          {isCompleted ? "Completed Today!" : "Mark as Done"}
        </Button>

        {/* Streak Information */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{streakInfo.current} day streak</span>
          </div>
          {streakInfo.longest > 0 && (
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-muted-foreground">Best: {streakInfo.longest}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Weekly Progress</span>
            <span>{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {habit.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{habit.frequency}</span>
          </div>
        </div>

        {/* Celebration for streaks */}
        {streakInfo.current > 0 && streakInfo.current % 7 === 0 && (
          <div className="text-center p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg animate-bounce-in">
            <div className="text-lg">🎉</div>
            <p className="text-xs font-medium text-primary">{streakInfo.current} days strong! Keep it up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
