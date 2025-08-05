import { CircuitWorkout, Routine } from 'domain/entities/routine.entity'
import { WorkoutDay } from 'domain/entities/workout-day.entity'
import { create } from 'zustand'

interface RoutinesState {
  routines: Routine[]
  lastRoutines: Routine[]
  routineCircuits: CircuitWorkout[]
  isLoading: boolean
  error: string | null

  setRoutines: (workoutDays: WorkoutDay[]) => void
  setLastRoutines: (mostFrequents: WorkoutDay[]) => void
  setRoutineCircuits: (circuits: CircuitWorkout[]) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useRoutineStore = create<RoutinesState>()((set) => ({
  routines: [],
  lastRoutines: [],
  routineCircuits: [],
  isLoading: false,
  error: null,

  setRoutines: (routines: Routine[]) => set({ routines }),
  setLastRoutines: (lastRoutines: Routine[]) => set({ lastRoutines }),
  setRoutineCircuits: (routineCircuits: CircuitWorkout[]) => set({ routineCircuits }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}))
