export interface WorkoutDayDto {
  name: string
  description?: string
}

export interface WorkoutDayExerciseDto {
  workoutDayId: string
  exerciseId: string
  sets: number
  heatingSets: number
}
