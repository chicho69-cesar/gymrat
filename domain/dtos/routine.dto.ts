export interface RoutineDto {
  name: string
  description?: string
}

export interface CircuitWorkoutDto {
  routineId: string
  workoutDayId: string
  orderNumber: number
}
