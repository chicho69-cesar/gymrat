import { WorkoutDay, WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { create } from 'zustand'

interface WorkoutDaysState {
  workoutDays: WorkoutDay[]
  mostFrequents: WorkoutDay[]
  workoutDayExercises: WorkoutDayExercise[]
  isLoading: boolean
  error: string | null

  setWorkoutDays: (workoutDays: WorkoutDay[]) => void
  setMostFrequents: (mostFrequents: WorkoutDay[]) => void
  setWorkoutDayExercises: (exercises: WorkoutDayExercise[]) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useWorkoutDaysStore = create<WorkoutDaysState>()((set) => ({
  workoutDays: [],
  mostFrequents: [],
  workoutDayExercises: [],
  isLoading: false,
  error: null,

  setWorkoutDays: (workoutDays: WorkoutDay[]) => set({ workoutDays }),
  setMostFrequents: (mostFrequents: WorkoutDay[]) => set({ mostFrequents }),
  setWorkoutDayExercises: (exercises: WorkoutDayExercise[]) => set({ workoutDayExercises: exercises }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
