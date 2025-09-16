"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JournalService, type MoodEntry } from "@/lib/journal"
import { Plus, BookOpen, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { MoodCalendar } from "@/components/mood-calendar"
import { QuickMoodEntry } from "@/components/quick-mood-entry"
import { JournalEntryCard } from "@/components/journal-entry-card"

export default function JournalPage() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [showQuickEntry, setShowQuickEntry] = useState(false)

  useEffect(() => {
    if (user) {
      const userEntries = JournalService.getEntries(user.id)
      setEntries(userEntries)
    }
  }, [user])

  const refreshEntries = () => {
    if (user) {
      const userEntries = JournalService.getEntries(user.id)
      setEntries(userEntries)
    }
  }

  const todaysEntry = user ? JournalService.getTodaysEntry(user.id) : null
  const recentEntries = entries.slice(0, 5)

  const stats = user ? JournalService.getMoodStats(user.id, 30) : null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mood Journal</h1>
              <p className="text-muted-foreground">Track your emotions and reflect on your daily experiences</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowQuickEntry(true)} variant="outline" className="group bg-transparent">
                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Quick Entry
              </Button>
              <Button asChild className="group">
                <Link href="/journal/add">
                  <BookOpen className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                  New Entry
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Calendar & Stats */}
            <div className="space-y-6">
              {/* Today's Status */}
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today's Mood
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todaysEntry ? (
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{todaysEntry.mood.emoji}</div>
                      <div>
                        <p className="font-semibold">{todaysEntry.mood.name}</p>
                        <p className="text-sm text-muted-foreground">Energy: {todaysEntry.energy}/5</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-3">No entry for today yet</p>
                      <Button size="sm" onClick={() => setShowQuickEntry(true)}>
                        Log Your Mood
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Stats */}
              {stats && stats.totalEntries > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-5 h-5 text-secondary" />
                      30-Day Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-muted/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{stats.averageMood.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Avg Mood</div>
                      </div>
                      <div className="text-center p-3 bg-muted/20 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{stats.averageEnergy.toFixed(1)}</div>
                        <div className="text-xs text-muted-foreground">Avg Energy</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge variant="secondary">{stats.totalEntries} entries logged</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mood Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mood Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodCalendar entries={entries} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Entries */}
            <div className="lg:col-span-2 space-y-6">
              {entries.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Start Your Journal</h3>
                    <p className="text-muted-foreground mb-6">
                      Begin tracking your moods and reflecting on your daily experiences
                    </p>
                    <Button asChild>
                      <Link href="/journal/add">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Entry
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Recent Entries</h2>
                    <Button variant="ghost" asChild>
                      <Link href="/journal/history">View All</Link>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recentEntries.map((entry) => (
                      <JournalEntryCard
                        key={entry.id}
                        entry={entry}
                        onUpdate={refreshEntries}
                        onDelete={refreshEntries}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>

        {/* Quick Mood Entry Modal */}
        <QuickMoodEntry open={showQuickEntry} onClose={() => setShowQuickEntry(false)} onSave={refreshEntries} />
      </div>
    </AuthGuard>
  )
}
