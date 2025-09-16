"use client"

export interface Habit {
  id: string
  userId: string
  title: string
  description?: string
  category: string
  color: string
  icon: string
  frequency: "daily" | "weekly" | "custom"
  targetDays?: number[] // For weekly habits (0-6, Sunday-Saturday)
  streak: number
  longestStreak: number
  completedDates: string[] // ISO date strings
  createdAt: string
  isActive: boolean
}

export interface HabitCompletion {
  habitId: string
  date: string
  completed: boolean
  timestamp: string
}

const HABITS_STORAGE_KEY = "zennis_habits"
const COMPLETIONS_STORAGE_KEY = "zennis_habit_completions"

export class HabitsService {
  static getHabits(userId: string): Habit[] {
    if (typeof window === "undefined") return []

    const habits = localStorage.getItem(HABITS_STORAGE_KEY)
    const allHabits: Habit[] = habits ? JSON.parse(habits) : []
    return allHabits.filter((habit) => habit.userId === userId && habit.isActive)
  }

  static getHabit(habitId: string): Habit | null {
    if (typeof window === "undefined") return null

    const habits = localStorage.getItem(HABITS_STORAGE_KEY)
    const allHabits: Habit[] = habits ? JSON.parse(habits) : []
    return allHabits.find((habit) => habit.id === habitId) || null
  }

  static createHabit(
    userId: string,
    habitData: Omit<Habit, "id" | "userId" | "streak" | "longestStreak" | "completedDates" | "createdAt" | "isActive">,
  ): Habit {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId,
      ...habitData,
      streak: 0,
      longestStreak: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
      isActive: true,
    }

    const habits = this.getHabits(userId)
    const allHabits = this.getAllHabits()
    const updatedHabits = [...allHabits.filter((h) => h.userId !== userId || h.id !== newHabit.id), ...habits, newHabit]

    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(updatedHabits))
    return newHabit
  }

  static updateHabit(habitId: string, updates: Partial<Habit>): Habit | null {
    const allHabits = this.getAllHabits()
    const habitIndex = allHabits.findIndex((h) => h.id === habitId)

    if (habitIndex === -1) return null

    const updatedHabit = { ...allHabits[habitIndex], ...updates }
    allHabits[habitIndex] = updatedHabit

    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(allHabits))
    return updatedHabit
  }

  static deleteHabit(habitId: string): boolean {
    const allHabits = this.getAllHabits()
    const habitIndex = allHabits.findIndex((h) => h.id === habitId)

    if (habitIndex === -1) return false

    // Soft delete
    allHabits[habitIndex].isActive = false
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(allHabits))

    // Also remove completions
    const completions = this.getAllCompletions()
    const filteredCompletions = completions.filter((c) => c.habitId !== habitId)
    localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(filteredCompletions))

    return true
  }

  static toggleHabitCompletion(habitId: string, date: string): { completed: boolean; newStreak: number } {
    const habit = this.getHabit(habitId)
    if (!habit) return { completed: false, newStreak: 0 }

    const completions = this.getAllCompletions()
    const existingCompletion = completions.find((c) => c.habitId === habitId && c.date === date)

    let completed: boolean
    let updatedCompletions: HabitCompletion[]

    if (existingCompletion) {
      // Toggle existing completion
      completed = !existingCompletion.completed
      updatedCompletions = completions.map((c) =>
        c.habitId === habitId && c.date === date ? { ...c, completed, timestamp: new Date().toISOString() } : c,
      )
    } else {
      // Create new completion
      completed = true
      const newCompletion: HabitCompletion = {
        habitId,
        date,
        completed: true,
        timestamp: new Date().toISOString(),
      }
      updatedCompletions = [...completions, newCompletion]
    }

    localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(updatedCompletions))

    // Update habit streak and completed dates
    const updatedHabit = this.calculateStreaks(
      habit,
      updatedCompletions.filter((c) => c.habitId === habitId),
    )
    this.updateHabit(habitId, updatedHabit)

    return { completed, newStreak: updatedHabit.streak }
  }

  static getHabitCompletions(habitId: string): HabitCompletion[] {
    const completions = this.getAllCompletions()
    return completions.filter((c) => c.habitId === habitId)
  }

  static isHabitCompletedToday(habitId: string): boolean {
    const today = new Date().toISOString().split("T")[0]
    const completions = this.getHabitCompletions(habitId)
    const todayCompletion = completions.find((c) => c.date === today)
    return todayCompletion?.completed || false
  }

  static getStreakInfo(habitId: string): { current: number; longest: number } {
    const habit = this.getHabit(habitId)
    if (!habit) return { current: 0, longest: 0 }

    return { current: habit.streak, longest: habit.longestStreak }
  }

  private static getAllHabits(): Habit[] {
    if (typeof window === "undefined") return []

    const habits = localStorage.getItem(HABITS_STORAGE_KEY)
    return habits ? JSON.parse(habits) : []
  }

  private static getAllCompletions(): HabitCompletion[] {
    if (typeof window === "undefined") return []

    const completions = localStorage.getItem(COMPLETIONS_STORAGE_KEY)
    return completions ? JSON.parse(completions) : []
  }

  private static calculateStreaks(habit: Habit, completions: HabitCompletion[]): Partial<Habit> {
    const sortedCompletions = completions
      .filter((c) => c.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (sortedCompletions.length === 0) {
      return { streak: 0, longestStreak: habit.longestStreak, completedDates: [] }
    }

    const completedDates = sortedCompletions.map((c) => c.date)
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Calculate current streak (from today backwards)
    const today = new Date()
    const checkDate = new Date(today)

    while (true) {
      const dateStr = checkDate.toISOString().split("T")[0]
      const isCompleted = completedDates.includes(dateStr)

      if (isCompleted) {
        currentStreak++
      } else if (dateStr === today.toISOString().split("T")[0]) {
        // Today is not completed, but that's okay for current streak
        // Continue checking yesterday
      } else {
        // Found a gap, stop counting current streak
        break
      }

      checkDate.setDate(checkDate.getDate() - 1)

      // Prevent infinite loop
      if (checkDate < new Date(habit.createdAt)) break
    }

    // Calculate longest streak
    tempStreak = 1
    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = new Date(completedDates[i - 1])
      const currDate = new Date(completedDates[i])
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)

      if (dayDiff === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)

    return {
      streak: currentStreak,
      longestStreak: Math.max(longestStreak, habit.longestStreak),
      completedDates,
    }
  }
}

// Predefined habit categories and icons
export const HABIT_CATEGORIES = [
  { id: "health", name: "Health & Fitness", color: "#10B981", icon: "💪" },
  { id: "mindfulness", name: "Mindfulness", color: "#8B5CF6", icon: "🧘" },
  { id: "productivity", name: "Productivity", color: "#F59E0B", icon: "⚡" },
  { id: "learning", name: "Learning", color: "#3B82F6", icon: "📚" },
  { id: "social", name: "Social", color: "#EF4444", icon: "👥" },
  { id: "creativity", name: "Creativity", color: "#EC4899", icon: "🎨" },
  { id: "lifestyle", name: "Lifestyle", color: "#6B7280", icon: "🏠" },
]

export const HABIT_ICONS = [
  "💪",
  "🏃",
  "🧘",
  "📚",
  "💧",
  "🥗",
  "😴",
  "🎯",
  "⚡",
  "🎨",
  "🎵",
  "📝",
  "🌱",
  "🧠",
  "❤️",
  "🌟",
  "🔥",
  "💎",
  "🚀",
  "🎪",
]
