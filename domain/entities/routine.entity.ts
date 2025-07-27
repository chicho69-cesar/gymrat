export interface Routine {
  id: string
  name: string
  description?: string
}

export interface CircuitWorkout {
  id: string
  routineId: string
  workoutDayId: string
  orderNumber: number
}
