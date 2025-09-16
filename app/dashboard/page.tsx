"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { HabitsService, type Habit } from "@/lib/habits"
import { JournalService, type MoodEntry } from "@/lib/journal"
import { Target, Heart, TrendingUp, Plus, Flame, Trophy, Sparkles } from "lucide-react"
import Link from "next/link"
import { DashboardStats } from "@/components/dashboard-stats"
import { HabitProgressChart } from "@/components/habit-progress-chart"
import { MoodTrendChart } from "@/components/mood-trend-chart"
import { QuickActions } from "@/components/quick-actions"

const MOTIVATIONAL_QUOTES = [
  "Small habits, big changes.",
  "Progress, not perfection.",
  "Your future self will thank you.",
  "Consistency is the key to success.",
  "Every day is a fresh start.",
  "You are what you repeatedly do.",
  "Success is the sum of small efforts.",
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Don't watch the clock; do what it does. Keep going.",
  "A journey of a thousand miles begins with a single step.",
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [journalEntries, setJournalEntries] = useState<MoodEntry[]>([])
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    if (user) {
      const userHabits = HabitsService.getHabits(user.id)
      const userEntries = JournalService.getEntries(user.id)
      setHabits(userHabits)
      setJournalEntries(userEntries)
    }
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length)
    }, 10000) // Change quote every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    if (user) {
      const userHabits = HabitsService.getHabits(user.id)
      const userEntries = JournalService.getEntries(user.id)
      setHabits(userHabits)
      setJournalEntries(userEntries)
    }
  }

  // Calculate today's progress
  const todayCompletedHabits = habits.filter((habit) => HabitsService.isHabitCompletedToday(habit.id)).length
  const todayProgress = habits.length > 0 ? (todayCompletedHabits / habits.length) * 100 : 0

  // Get today's mood entry
  const todaysMoodEntry = user ? JournalService.getTodaysEntry(user.id) : null

  // Calculate streaks
  const activeStreaks = habits.filter((habit) => HabitsService.getStreakInfo(habit.id).current > 0)
  const longestStreak = Math.max(...habits.map((habit) => HabitsService.getStreakInfo(habit.id).longest), 0)

  // Get recent entries for summary
  const recentEntries = journalEntries.slice(0, 7)
  const weeklyMoodStats = user ? JournalService.getMoodStats(user.id, 7) : null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Friend"}! 👋</h1>
                <p className="text-muted-foreground">Here's your wellness journey overview</p>
              </div>
              <QuickActions onUpdate={refreshData} />
            </div>
          </div>

          {/* Daily Motivational Quote */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Daily Inspiration</span>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-lg font-medium italic animate-fade-in" key={currentQuote}>
                "{MOTIVATIONAL_QUOTES[currentQuote]}"
              </p>
            </CardContent>
          </Card>

          {/* Today's Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Today's Progress */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-primary" />
                  Today's Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{Math.round(todayProgress)}%</span>
                    <Badge variant={todayProgress === 100 ? "default" : "secondary"}>
                      {todayCompletedHabits}/{habits.length}
                    </Badge>
                  </div>
                  <Progress value={todayProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {todayProgress === 100 && habits.length > 0
                      ? "Perfect day! 🎉"
                      : `${habits.length - todayCompletedHabits} habits remaining`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Today's Mood */}
            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-secondary" />
                  Today's Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysMoodEntry ? (
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{todaysMoodEntry.mood.emoji}</div>
                    <div>
                      <p className="font-semibold">{todaysMoodEntry.mood.name}</p>
                      <p className="text-sm text-muted-foreground">Energy: {todaysMoodEntry.energy}/5</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-muted-foreground mb-2">No mood logged yet</p>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/journal">Log Mood</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Streaks */}
            <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Flame className="w-5 h-5 text-orange-500" />
                  Active Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-orange-500">{activeStreaks.length}</div>
                  <p className="text-sm text-muted-foreground">
                    {activeStreaks.length === 0
                      ? "Start your first streak!"
                      : `${activeStreaks.length} habit${activeStreaks.length === 1 ? "" : "s"} on track`}
                  </p>
                  {longestStreak > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <Trophy className="w-3 h-3 text-yellow-500" />
                      <span>Best: {longestStreak} days</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {weeklyMoodStats ? (
                    <>
                      <div className="text-2xl font-bold text-accent">{weeklyMoodStats.totalEntries}</div>
                      <p className="text-sm text-muted-foreground">journal entries</p>
                      <div className="text-xs">Avg mood: {weeklyMoodStats.averageMood.toFixed(1)}/5</div>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-accent">0</div>
                      <p className="text-sm text-muted-foreground">journal entries</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <HabitProgressChart habits={habits} />
            <MoodTrendChart entries={journalEntries} />
          </div>

          {/* Detailed Stats */}
          <DashboardStats habits={habits} journalEntries={journalEntries} />

          {/* Quick Habit Check-in */}
          {habits.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Quick Habit Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habits.slice(0, 6).map((habit) => {
                    const isCompleted = HabitsService.isHabitCompletedToday(habit.id)
                    const streakInfo = HabitsService.getStreakInfo(habit.id)

                    return (
                      <div
                        key={habit.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          isCompleted ? "bg-primary/5 border-primary/20" : "bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                              style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                            >
                              {habit.icon}
                            </div>
                            <span className="font-medium text-sm">{habit.title}</span>
                          </div>
                          <Button
                            size="sm"
                            variant={isCompleted ? "default" : "outline"}
                            onClick={() => {
                              const today = new Date().toISOString().split("T")[0]
                              HabitsService.toggleHabitCompletion(habit.id, today)
                              refreshData()
                            }}
                            className="h-6 px-2 text-xs"
                          >
                            {isCompleted ? "✓" : "○"}
                          </Button>
                        </div>
                        {streakInfo.current > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span>{streakInfo.current} day streak</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {habits.length === 0 && journalEntries.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Welcome to Zennis!</h3>
                <p className="text-muted-foreground mb-6">
                  Start your wellness journey by creating your first habit or journal entry
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link href="/habits/add">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Habit
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/journal/add">
                      <Heart className="w-4 h-4 mr-2" />
                      Journal Entry
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  )
}
