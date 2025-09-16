"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HabitsService, type Habit } from "@/lib/habits"
import { JournalService, type MoodEntry } from "@/lib/journal"
import { BarChart3, TrendingUp, Target, Heart } from "lucide-react"
import { HabitProgressChart } from "@/components/habit-progress-chart"
import { MoodTrendChart } from "@/components/mood-trend-chart"
import { DashboardStats } from "@/components/dashboard-stats"

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [journalEntries, setJournalEntries] = useState<MoodEntry[]>([])
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d")

  useEffect(() => {
    if (user) {
      const userHabits = HabitsService.getHabits(user.id)
      const userEntries = JournalService.getEntries(user.id)
      setHabits(userHabits)
      setJournalEntries(userEntries)
    }
  }, [user])

  const stats = user
    ? JournalService.getMoodStats(user.id, timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90)
    : null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
              <p className="text-muted-foreground">Deep dive into your wellness journey with detailed analytics</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
                7 Days
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30d")}
              >
                30 Days
              </Button>
              <Button
                variant={timeRange === "90d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("90d")}
              >
                90 Days
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="habits">Habits</TabsTrigger>
              <TabsTrigger value="mood">Mood</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="w-5 h-5 text-primary" />
                      Total Habits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{habits.length}</div>
                    <p className="text-sm text-muted-foreground">Active habits</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-secondary" />
                      Journal Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-secondary">{stats?.totalEntries || 0}</div>
                    <p className="text-sm text-muted-foreground">In {timeRange}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Avg Mood
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{stats?.averageMood.toFixed(1) || "—"}</div>
                    <p className="text-sm text-muted-foreground">Out of 5.0</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5 text-orange-500" />
                      Avg Energy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{stats?.averageEnergy.toFixed(1) || "—"}</div>
                    <p className="text-sm text-muted-foreground">Out of 5.0</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <HabitProgressChart habits={habits} />
                <MoodTrendChart entries={journalEntries} />
              </div>

              {/* Detailed Stats */}
              <DashboardStats habits={habits} journalEntries={journalEntries} />
            </TabsContent>

            <TabsContent value="habits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Habit Performance</CardTitle>
                  <p className="text-sm text-muted-foreground">Detailed breakdown of your habit completion rates</p>
                </CardHeader>
                <CardContent>
                  {habits.length > 0 ? (
                    <div className="space-y-4">
                      {habits.map((habit) => {
                        const streakInfo = HabitsService.getStreakInfo(habit.id)
                        const completions = HabitsService.getHabitCompletions(habit.id)
                        const totalDays = Math.max(
                          1,
                          Math.ceil(
                            (new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24),
                          ),
                        )
                        const completionRate = (completions.filter((c) => c.completed).length / totalDays) * 100

                        return (
                          <div key={habit.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                                >
                                  {habit.icon}
                                </div>
                                <div>
                                  <h3 className="font-semibold">{habit.title}</h3>
                                  <p className="text-sm text-muted-foreground">{habit.category}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{Math.round(completionRate)}%</div>
                                <div className="text-xs text-muted-foreground">completion rate</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-lg font-semibold text-orange-500">{streakInfo.current}</div>
                                <div className="text-xs text-muted-foreground">Current streak</div>
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-yellow-500">{streakInfo.longest}</div>
                                <div className="text-xs text-muted-foreground">Best streak</div>
                              </div>
                              <div>
                                <div className="text-lg font-semibold text-primary">
                                  {completions.filter((c) => c.completed).length}
                                </div>
                                <div className="text-xs text-muted-foreground">Total completions</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No habits to analyze yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mood" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mood Analysis</CardTitle>
                  <p className="text-sm text-muted-foreground">Insights into your emotional patterns and trends</p>
                </CardHeader>
                <CardContent>
                  {journalEntries.length > 0 ? (
                    <div className="space-y-6">
                      {/* Mood Distribution */}
                      <div>
                        <h3 className="font-semibold mb-3">Mood Distribution</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          {Object.entries(stats?.moodCounts || {}).map(([moodId, count]) => {
                            const mood = journalEntries.find((e) => e.mood.id === moodId)?.mood
                            if (!mood) return null

                            const percentage = ((count / (stats?.totalEntries || 1)) * 100).toFixed(1)

                            return (
                              <div key={moodId} className="text-center p-3 border rounded-lg">
                                <div className="text-2xl mb-1">{mood.emoji}</div>
                                <div className="font-semibold">{count}</div>
                                <div className="text-xs text-muted-foreground">{mood.name}</div>
                                <Badge variant="secondary" className="text-xs mt-1">
                                  {percentage}%
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Recent Entries */}
                      <div>
                        <h3 className="font-semibold mb-3">Recent Entries</h3>
                        <div className="space-y-2">
                          {journalEntries.slice(0, 5).map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="text-xl">{entry.mood.emoji}</div>
                                <div>
                                  <div className="font-medium">{entry.mood.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(entry.date).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm">Energy: {entry.energy}/5</div>
                                {entry.tags.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {entry.tags.slice(0, 2).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No mood data to analyze yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}
