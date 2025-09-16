"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { type Habit, HabitsService } from "@/lib/habits"
import { type MoodEntry, MOOD_TYPES } from "@/lib/journal"
import { BarChart3, Trophy, TrendingUp } from "lucide-react"

interface DashboardStatsProps {
  habits: Habit[]
  journalEntries: MoodEntry[]
}

export function DashboardStats({ habits, journalEntries }: DashboardStatsProps) {
  // Calculate habit completion stats for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  const weeklyCompletionData = last7Days.map((date) => {
    const completedCount = habits.filter((habit) => {
      const completions = HabitsService.getHabitCompletions(habit.id)
      return completions.some((c) => c.date === date && c.completed)
    }).length

    return {
      date,
      completed: completedCount,
      total: habits.length,
      percentage: habits.length > 0 ? (completedCount / habits.length) * 100 : 0,
    }
  })

  const weeklyAverage = weeklyCompletionData.reduce((sum, day) => sum + day.percentage, 0) / 7

  // Calculate mood distribution
  const moodCounts = journalEntries.reduce(
    (acc, entry) => {
      acc[entry.mood.id] = (acc[entry.mood.id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topMoods = Object.entries(moodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([moodId, count]) => ({
      mood: MOOD_TYPES.find((m) => m.id === moodId)!,
      count,
    }))

  // Calculate streaks
  const allStreaks = habits.map((habit) => HabitsService.getStreakInfo(habit.id))
  const totalActiveStreaks = allStreaks.filter((s) => s.current > 0).length
  const averageStreak =
    allStreaks.length > 0 ? allStreaks.reduce((sum, s) => sum + s.current, 0) / allStreaks.length : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Weekly Habit Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-primary" />
            Weekly Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{Math.round(weeklyAverage)}%</div>
            <p className="text-sm text-muted-foreground">Average completion</p>
          </div>

          <div className="space-y-2">
            {weeklyCompletionData.slice(-3).map((day, index) => {
              const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })
              return (
                <div key={day.date} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{dayName}</span>
                  <div className="flex items-center gap-2 flex-1 ml-3">
                    <Progress value={day.percentage} className="h-2 flex-1" />
                    <span className="text-xs w-8 text-right">{Math.round(day.percentage)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mood Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-secondary" />
            Mood Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topMoods.length > 0 ? (
            <>
              <div className="text-center">
                <div className="text-2xl">{topMoods[0]?.mood.emoji}</div>
                <p className="text-sm text-muted-foreground">Most common mood</p>
              </div>

              <div className="space-y-2">
                {topMoods.map(({ mood, count }) => (
                  <div key={mood.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{mood.emoji}</span>
                      <span className="text-sm">{mood.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">No mood data yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Streak Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Streak Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{totalActiveStreaks}</div>
              <p className="text-xs text-muted-foreground">Active streaks</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{Math.round(averageStreak)}</div>
              <p className="text-xs text-muted-foreground">Avg streak</p>
            </div>
          </div>

          {habits.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Top Performers</p>
              {habits
                .map((habit) => ({
                  habit,
                  streak: HabitsService.getStreakInfo(habit.id).current,
                }))
                .sort((a, b) => b.streak - a.streak)
                .slice(0, 3)
                .map(({ habit, streak }) => (
                  <div key={habit.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">{habit.icon}</span>
                      <span className="truncate">{habit.title}</span>
                    </div>
                    <Badge variant={streak > 0 ? "default" : "secondary"} className="text-xs">
                      {streak}d
                    </Badge>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
