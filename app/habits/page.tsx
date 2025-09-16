"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { HabitsService, type Habit } from "@/lib/habits"
import { Plus, Target, Trophy } from "lucide-react"
import Link from "next/link"
import { HabitCard } from "@/components/habit-card"
import { DeleteHabitDialog } from "@/components/delete-habit-dialog"

export default function HabitsPage() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [deleteHabit, setDeleteHabit] = useState<Habit | null>(null)

  useEffect(() => {
    if (user) {
      const userHabits = HabitsService.getHabits(user.id)
      setHabits(userHabits)
    }
  }, [user])

  const handleToggleHabit = (habitId: string) => {
    const today = new Date().toISOString().split("T")[0]
    const result = HabitsService.toggleHabitCompletion(habitId, today)

    // Refresh habits to update streaks
    if (user) {
      const updatedHabits = HabitsService.getHabits(user.id)
      setHabits(updatedHabits)
    }
  }

  const handleDeleteHabit = (habit: Habit) => {
    setDeleteHabit(habit)
  }

  const confirmDeleteHabit = () => {
    if (deleteHabit) {
      HabitsService.deleteHabit(deleteHabit.id)
      if (user) {
        const updatedHabits = HabitsService.getHabits(user.id)
        setHabits(updatedHabits)
      }
      setDeleteHabit(null)
    }
  }

  const todayCompletedCount = habits.filter((habit) => HabitsService.isHabitCompletedToday(habit.id)).length

  const completionPercentage = habits.length > 0 ? (todayCompletedCount / habits.length) * 100 : 0

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Habits</h1>
              <p className="text-muted-foreground">Track your daily habits and build lasting positive changes</p>
            </div>
            <Button asChild className="group">
              <Link href="/habits/add">
                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Add New Habit
              </Link>
            </Button>
          </div>

          {/* Today's Progress */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {todayCompletedCount} of {habits.length} habits completed
                  </span>
                  <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>
                    {Math.round(completionPercentage)}%
                  </Badge>
                </div>
                <Progress value={completionPercentage} className="h-2" />
                {completionPercentage === 100 && habits.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-primary animate-bounce-in">
                    <Trophy className="w-4 h-4" />
                    Perfect day! All habits completed!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Habits List */}
          {habits.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
                <p className="text-muted-foreground mb-6">Start building better habits by creating your first one!</p>
                <Button asChild>
                  <Link href="/habits/add">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Habit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={() => handleToggleHabit(habit.id)}
                  onDelete={() => handleDeleteHabit(habit)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Delete Confirmation Dialog */}
        <DeleteHabitDialog
          habit={deleteHabit}
          open={!!deleteHabit}
          onClose={() => setDeleteHabit(null)}
          onConfirm={confirmDeleteHabit}
        />
      </div>
    </AuthGuard>
  )
}
