export interface Workout {
  id: string
  date: string
  routineId: string
  workoutDayId: string
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
