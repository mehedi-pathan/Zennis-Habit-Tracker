"use client"

export interface MoodEntry {
  id: string
  userId: string
  date: string // ISO date string (YYYY-MM-DD)
  mood: MoodType
  energy: number // 1-5 scale
  notes: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface MoodType {
  id: string
  name: string
  emoji: string
  color: string
  value: number // 1-5 scale for analytics
}

export const MOOD_TYPES: MoodType[] = [
  { id: "amazing", name: "Amazing", emoji: "😍", color: "#10B981", value: 5 },
  { id: "happy", name: "Happy", emoji: "😊", color: "#34D399", value: 4 },
  { id: "good", name: "Good", emoji: "🙂", color: "#60A5FA", value: 3 },
  { id: "okay", name: "Okay", emoji: "😐", color: "#A78BFA", value: 2 },
  { id: "sad", name: "Sad", emoji: "😢", color: "#F87171", value: 1 },
  { id: "anxious", name: "Anxious", emoji: "😰", color: "#FBBF24", value: 2 },
  { id: "angry", name: "Angry", emoji: "😠", color: "#EF4444", value: 1 },
  { id: "excited", name: "Excited", emoji: "🤩", color: "#F59E0B", value: 4 },
  { id: "calm", name: "Calm", emoji: "😌", color: "#8B5CF6", value: 3 },
  { id: "grateful", name: "Grateful", emoji: "🙏", color: "#EC4899", value: 4 },
]

export const ENERGY_LEVELS = [
  { value: 1, label: "Very Low", color: "#EF4444" },
  { value: 2, label: "Low", color: "#F97316" },
  { value: 3, label: "Moderate", color: "#EAB308" },
  { value: 4, label: "High", color: "#22C55E" },
  { value: 5, label: "Very High", color: "#10B981" },
]

export const COMMON_TAGS = [
  "work",
  "family",
  "friends",
  "exercise",
  "sleep",
  "stress",
  "achievement",
  "challenge",
  "relaxation",
  "creativity",
  "health",
  "travel",
  "learning",
  "gratitude",
  "reflection",
]

const JOURNAL_STORAGE_KEY = "zennis_journal_entries"

export class JournalService {
  static getEntries(userId: string): MoodEntry[] {
    if (typeof window === "undefined") return []

    const entries = localStorage.getItem(JOURNAL_STORAGE_KEY)
    const allEntries: MoodEntry[] = entries ? JSON.parse(entries) : []
    return allEntries
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  static getEntry(userId: string, date: string): MoodEntry | null {
    const entries = this.getEntries(userId)
    return entries.find((entry) => entry.date === date) || null
  }

  static createEntry(
    userId: string,
    entryData: Omit<MoodEntry, "id" | "userId" | "createdAt" | "updatedAt">,
  ): MoodEntry {
    const newEntry: MoodEntry = {
      id: crypto.randomUUID(),
      userId,
      ...entryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const allEntries = this.getAllEntries()
    const updatedEntries = [...allEntries.filter((e) => !(e.userId === userId && e.date === entryData.date)), newEntry]

    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries))
    return newEntry
  }

  static updateEntry(entryId: string, updates: Partial<MoodEntry>): MoodEntry | null {
    const allEntries = this.getAllEntries()
    const entryIndex = allEntries.findIndex((e) => e.id === entryId)

    if (entryIndex === -1) return null

    const updatedEntry = {
      ...allEntries[entryIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    allEntries[entryIndex] = updatedEntry
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(allEntries))
    return updatedEntry
  }

  static deleteEntry(entryId: string): boolean {
    const allEntries = this.getAllEntries()
    const filteredEntries = allEntries.filter((e) => e.id !== entryId)

    if (filteredEntries.length === allEntries.length) return false

    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(filteredEntries))
    return true
  }

  static getEntriesForDateRange(userId: string, startDate: string, endDate: string): MoodEntry[] {
    const entries = this.getEntries(userId)
    return entries.filter((entry) => entry.date >= startDate && entry.date <= endDate)
  }

  static getMoodStats(
    userId: string,
    days = 30,
  ): {
    averageMood: number
    averageEnergy: number
    moodCounts: Record<string, number>
    totalEntries: number
  } {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - days)

    const entries = this.getEntriesForDateRange(
      userId,
      startDate.toISOString().split("T")[0],
      endDate.toISOString().split("T")[0],
    )

    if (entries.length === 0) {
      return {
        averageMood: 0,
        averageEnergy: 0,
        moodCounts: {},
        totalEntries: 0,
      }
    }

    const totalMoodValue = entries.reduce((sum, entry) => sum + entry.mood.value, 0)
    const totalEnergy = entries.reduce((sum, entry) => sum + entry.energy, 0)

    const moodCounts: Record<string, number> = {}
    entries.forEach((entry) => {
      moodCounts[entry.mood.id] = (moodCounts[entry.mood.id] || 0) + 1
    })

    return {
      averageMood: totalMoodValue / entries.length,
      averageEnergy: totalEnergy / entries.length,
      moodCounts,
      totalEntries: entries.length,
    }
  }

  static getTodaysEntry(userId: string): MoodEntry | null {
    const today = new Date().toISOString().split("T")[0]
    return this.getEntry(userId, today)
  }

  static hasEntryForDate(userId: string, date: string): boolean {
    return this.getEntry(userId, date) !== null
  }

  private static getAllEntries(): MoodEntry[] {
    if (typeof window === "undefined") return []

    const entries = localStorage.getItem(JOURNAL_STORAGE_KEY)
    return entries ? JSON.parse(entries) : []
  }
}
