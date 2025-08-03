import { Exercise } from 'domain/entities/exercise.entity'
import { create } from 'zustand'

interface ExerciseState {
  exercises: Exercise[]
  topExercises: Exercise[]
  isLoading: boolean
  error: string | null

  setExercises: (exercises: Exercise[]) => void
  setTopExercises: (topExercises: Exercise[]) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useExercisesStore = create<ExerciseState>()((set) => ({
  exercises: [],
  topExercises: [],
  isLoading: false,
  error: null,

  setExercises: (exercises: Exercise[]) => set({ exercises }),
  setTopExercises: (topExercises: Exercise[]) => set({ topExercises }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
