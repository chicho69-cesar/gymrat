import { CircuitWorkoutDto, RoutineDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout, Routine } from 'domain/entities/routine.entity'

export abstract class RoutineDataSource {
  abstract getRoutineById(id: string): Promise<Routine | null>
  abstract getAllRoutines(): Promise<Routine[]>
  abstract createRoutine(routine: RoutineDto): Promise<Routine>
  abstract updateRoutine(id: string, routine: RoutineDto): Promise<Routine>
  abstract deleteRoutine(id: string): Promise<void>

  abstract getCircuitWorkoutsByRoutineId(routineId: string): Promise<CircuitWorkout[]>
  abstract createCircuitWorkout(circuitWorkout: CircuitWorkoutDto): Promise<CircuitWorkout>
  abstract updateCircuitWorkout(id: string, circuitWorkout: CircuitWorkoutDto): Promise<CircuitWorkout>
  abstract deleteCircuitWorkout(id: string): Promise<void>
}
