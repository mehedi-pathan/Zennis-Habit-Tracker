"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MoodEntry } from "@/lib/journal"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Heart } from "lucide-react"

interface MoodTrendChartProps {
  entries: MoodEntry[]
}

export function MoodTrendChart({ entries }: MoodTrendChartProps) {
  // Generate data for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date
  }).reverse()

  const chartData = last7Days.map((date) => {
    const dateStr = date.toISOString().split("T")[0]
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

    const dayEntry = entries.find((entry) => entry.date === dateStr)

    return {
      day: dayName,
      mood: dayEntry?.mood.value || null,
      energy: dayEntry?.energy || null,
      moodName: dayEntry?.mood.name || "No entry",
      emoji: dayEntry?.mood.emoji || "—",
    }
  })

  const averageMood = chartData
    .filter((day) => day.mood !== null)
    .reduce((sum, day, _, arr) => sum + (day.mood || 0) / arr.length, 0)

  const averageEnergy = chartData
    .filter((day) => day.energy !== null)
    .reduce((sum, day, _, arr) => sum + (day.energy || 0) / arr.length, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-secondary" />
          Mood & Energy Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Weekly averages: {averageMood.toFixed(1)} mood, {averageEnergy.toFixed(1)} energy
        </p>
      </CardHeader>
      <CardContent>
        {entries.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis domain={[1, 5]} fontSize={12} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-card border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        {data.mood ? (
                          <>
                            <p className="text-sm">
                              {data.emoji} {data.moodName}
                            </p>
                            <p className="text-sm text-muted-foreground">Energy: {data.energy}/5</p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No entry</p>
                        )}
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--secondary))", strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                connectNulls={false}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No mood data to display</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
