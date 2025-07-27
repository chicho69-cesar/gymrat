export interface WorkoutDto {
  date: string
  routineId: string
  workoutDayId: string
}

export interface WorkoutExerciseDto {
  workoutId: string
  workoutDayExerciseId: string
}

export interface ExerciseSetDto {
  workoutExerciseId: string
  weight: number
  reps: number
  unit: 'Kg' | 'LB'
  setNumber: number
}
