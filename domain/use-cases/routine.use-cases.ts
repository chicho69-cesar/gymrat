import { CircuitWorkoutDto, RoutineDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout, Routine } from 'domain/entities/routine.entity'
import { RoutineRepository } from 'domain/repositories/routine.repository'
import { CircuitWorkoutMapper } from 'infrastructure/mappers/circuit-workout.mapper'

export class RoutineUseCases {
  static async getById(repository: RoutineRepository, id: string): Promise<Routine | null> {
    return repository.getRoutineById(id)
  }

  static async getAll(repository: RoutineRepository): Promise<Routine[]> {
    return repository.getAllRoutines()
  }

  static async getLast(repository: RoutineRepository, limit: number): Promise<Routine[]> {
    return repository.getLastRoutines(limit)
  }

  static async create(
    repository: RoutineRepository,
    routine: RoutineDto,
    circuitWorkouts: CircuitWorkout[] = []
  ): Promise<Routine> {
    const circuitWorkoutPromises = circuitWorkouts
      .map((circuitWorkout) => repository.createCircuitWorkout(
        CircuitWorkoutMapper.toDto(circuitWorkout)
      ))

    if (circuitWorkouts.length > 0) {
      await Promise.all(circuitWorkoutPromises)
    }

    return repository.createRoutine(routine)
  }

  static async update(
    repository: RoutineRepository,
    id: string,
    routine: RoutineDto,
    circuitWorkouts: CircuitWorkout[] = []
  ): Promise<Routine> {
    const circuitWorkoutPromises = circuitWorkouts.map((cw) => repository.updateCircuitWorkout(
      cw.id, CircuitWorkoutMapper.toDto(cw)
    ))

    if (circuitWorkouts.length > 0) {
      await Promise.all(circuitWorkoutPromises)
    }

    return repository.updateRoutine(id, routine)
  }

  static async delete(repository: RoutineRepository, id: string): Promise<void> {
    const circuitWorkouts = await repository.getCircuitWorkout(id)

    if (circuitWorkouts.length > 0) {
      await Promise.all(circuitWorkouts.map((cw) => repository.deleteCircuitWorkout(cw.id)))
    }

    return repository.deleteRoutine(id)
  }

  static async getCircuit(repository: RoutineRepository, routineId: string): Promise<CircuitWorkout[]> {
    return repository.getCircuitWorkout(routineId)
  }

  static async createCircuit(
    repository: RoutineRepository,
    circuitWorkout: CircuitWorkoutDto
  ): Promise<CircuitWorkout> {
    return repository.createCircuitWorkout(circuitWorkout)
  }

  static async updateCircuit(
    repository: RoutineRepository,
    id: string,
    circuitWorkout: CircuitWorkoutDto
  ): Promise<CircuitWorkout> {
    return repository.updateCircuitWorkout(id, circuitWorkout)
  }

  static async deleteCircuit(repository: RoutineRepository, id: string): Promise<void> {
    return repository.deleteCircuitWorkout(id)
  }
}
