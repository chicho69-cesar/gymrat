import { RoutineDataSource } from 'domain/datasources/routine.datasource'
import { CircuitWorkoutDto, RoutineDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout, Routine } from 'domain/entities/routine.entity'
import { RoutineRepository } from 'domain/repositories/routine.repository'

export class RoutineRepositoryImpl implements RoutineRepository {
  private readonly dataSource: RoutineDataSource

  constructor(dataSource: RoutineDataSource) {
    this.dataSource = dataSource
  }

  getRoutineById(id: string): Promise<Routine | null> {
    return this.dataSource.getRoutineById(id)
  }

  getAllRoutines(): Promise<Routine[]> {
    return this.dataSource.getAllRoutines()
  }

  createRoutine(routine: RoutineDto): Promise<Routine> {
    return this.dataSource.createRoutine(routine)
  }

  updateRoutine(id: string, routine: RoutineDto): Promise<Routine> {
    return this.dataSource.updateRoutine(id, routine)
  }

  deleteRoutine(id: string): Promise<void> {
    return this.dataSource.deleteRoutine(id)
  }

  getCircuitWorkout(routineId: string): Promise<CircuitWorkout[]> {
    return this.dataSource.getCircuitWorkoutsByRoutineId(routineId)
  }

  createCircuitWorkout(circuitWorkout: CircuitWorkoutDto): Promise<CircuitWorkout> {
    return this.dataSource.createCircuitWorkout(circuitWorkout)
  }

  updateCircuitWorkout(id: string, circuitWorkout: CircuitWorkoutDto): Promise<CircuitWorkout> {
    return this.dataSource.updateCircuitWorkout(id, circuitWorkout)
  }

  deleteCircuitWorkout(id: string): Promise<void> {
    return this.dataSource.deleteCircuitWorkout(id)
  }
}
