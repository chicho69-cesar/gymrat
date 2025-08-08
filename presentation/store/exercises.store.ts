import { Exercise } from 'domain/entities/exercise.entity'
import { create } from 'zustand'

interface ExerciseState {
  exercises: Exercise[]
  topExercises: Exercise[]
  usedExercises: Exercise[]
  isLoading: boolean
  error: string | null

  setExercises: (exercises: Exercise[]) => void
  setTopExercises: (topExercises: Exercise[]) => void
  setUsedExercises: (usedExercises: Exercise[]) => void
  addExercise: (exercise: Exercise) => void
  updateExercise: (id: string, exercise: Exercise) => void
  removeExercise: (id: string) => void

  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useExercisesStore = create<ExerciseState>()((set) => ({
  exercises: [],
  topExercises: [],
  usedExercises: [],
  isLoading: false,
  error: null,

  setExercises: (exercises: Exercise[]) => set({
    exercises
  }),

  addExercise: (exercise: Exercise) => set((state) => ({
    exercises: [...state.exercises, exercise]
  })),

  updateExercise: (id: string, updatedExercise: Exercise) => set((state) => ({
    exercises: state.exercises.map((exercise) =>
      exercise.id === id ? { ...exercise, ...updatedExercise } : exercise
    )
  })),

  removeExercise: (id: string) => set((state) => ({
    exercises: state.exercises.filter((exercise) => exercise.id !== id)
  })),

  setTopExercises: (topExercises: Exercise[]) => set({
    topExercises
  }),

  setUsedExercises: (usedExercises: Exercise[]) => set({
    usedExercises
  }),

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
