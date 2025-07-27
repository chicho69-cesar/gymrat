export interface WorkoutDay {
  id: string
  name: string
  description?: string
}

export interface WorkoutDayExercise {
  id: string
  workoutDayId: string
  exerciseId: string
  sets: number
  heatingSets: number
}
