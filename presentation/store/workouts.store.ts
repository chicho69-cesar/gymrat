import { Workout } from 'domain/entities/workout.entity'
import { create } from 'zustand'

interface WorkoutState {
  workouts: Workout[]
  activeWorkout: Workout | null
  isLoading: boolean
  error: string | null

  setWorkouts: (workouts: Workout[]) => void
  setActiveWorkout: (workout: Workout | null) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useWorkoutStore = create<WorkoutState>()((set) => ({
  workouts: [],
  activeWorkout: null,
  isLoading: false,
  error: null,

  setWorkouts: (workouts: Workout[]) => set({ workouts }),
  setActiveWorkout: (workout: Workout | null) => set({ activeWorkout: workout }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
