import { Workout } from 'domain/entities/workout.entity'
import { create } from 'zustand'

interface WorkoutState {
  workouts: Workout[]
  isLoading: boolean
  error: string | null

  setWorkouts: (workouts: Workout[]) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useWorkoutStore = create<WorkoutState>()((set) => ({
  workouts: [],
  isLoading: false,
  error: null,

  setWorkouts: (workouts: Workout[]) => set({ workouts }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
