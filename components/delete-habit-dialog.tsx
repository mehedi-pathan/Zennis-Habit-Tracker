"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Habit } from "@/lib/habits"

interface DeleteHabitDialogProps {
  habit: Habit | null
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteHabitDialog({ habit, open, onClose, onConfirm }: DeleteHabitDialogProps) {
  if (!habit) return null

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Habit</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{habit.title}"? This action cannot be undone and will remove all progress
            data for this habit.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive hover:bg-destructive/90">
            Delete Habit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
