import { Workout, WorkoutExerciseWithDetails } from 'domain/entities/workout.entity'
import { create } from 'zustand'

interface WorkoutState {
  workouts: Workout[]
  activeWorkout: Workout | null
  workoutDetails: WorkoutExerciseWithDetails[]
  isLoading: boolean
  error: string | null

  setWorkouts: (workouts: Workout[]) => void
  setActiveWorkout: (workout: Workout | null) => void
  setWorkoutDetails: (details: WorkoutExerciseWithDetails[]) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useWorkoutStore = create<WorkoutState>()((set) => ({
  workouts: [],
  activeWorkout: null,
  workoutDetails: [],
  isLoading: false,
  error: null,

  setWorkouts: (workouts: Workout[]) => set({ workouts }),
  setActiveWorkout: (workout: Workout | null) => set({ activeWorkout: workout }),
  setWorkoutDetails: (details: WorkoutExerciseWithDetails[]) => set({ workoutDetails: details }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
