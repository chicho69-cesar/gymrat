import { Exercise } from "./exercise.entity"
import { WorkoutDayExercise } from "./workout-day.entity"

export interface Workout {
  id: string
  date: string
  routineId: string
  workoutDayId: string
}

export interface WorkoutWithDay extends Workout {
  workoutDayName?: string
}

export interface WorkoutExercise {
  id: string
  workoutId: string
  workoutDayExerciseId: string
}

export interface ExerciseSet {
  id: string
  workoutExerciseId: string
  weight: number
  reps: number
  unit: 'Kg' | 'LB'
  setNumber: number
}

export interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise?: Exercise
  workoutDayExercise?: WorkoutDayExercise
  sets: ExerciseSet[]
}

export interface WorkoutStats {
  workoutId: string
  date: string
  weight: number
  reps: number
  unit: 'Kg' | 'LB'
  volume: number
}

export interface WorkoutDetails {
  workoutExerciseId: string
  workoutId: string
  workoutDayExerciseId: string
  exerciseId: string
  exerciseName: string
  exerciseDescription: string
  exerciseRest: number
  workoutDayId: string
  plannedSets: number
  heatingSets: number
  setId: string | null
  weight: number | null
  reps: number | null
  unit: 'Kg' | 'LB'
  setNumber: number | null
}
