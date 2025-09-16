"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Habit, HabitsService } from "@/lib/habits"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface HabitProgressChartProps {
  habits: Habit[]
}

export function HabitProgressChart({ habits }: HabitProgressChartProps) {
  // Generate data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  const chartData = last7Days.map((date) => {
    const dateStr = date.toISOString().split("T")[0]
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

    const completedCount = habits.filter((habit) => {
      const completions = HabitsService.getHabitCompletions(habit.id)
      return completions.some((c) => c.date === dateStr && c.completed)
    }).length

    return {
      day: dayName,
      completed: completedCount,
      total: habits.length,
      percentage: habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0,
    }
  })

  const averageCompletion = chartData.reduce((sum, day) => sum + day.percentage, 0) / chartData.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Habit Completion Trend
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Weekly average: {Math.round(averageCompletion)}% completion rate
        </p>
      </CardHeader>
      <CardContent>
        {habits.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-card border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-muted-foreground">
                          {data.completed}/{data.total} habits completed
                        </p>
                        <p className="text-sm font-medium text-primary">{data.percentage}% completion</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="percentage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No habits to track yet</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
