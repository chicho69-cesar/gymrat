import { CircuitWorkout, Routine } from 'domain/entities/routine.entity'
import { RoutineRepository } from 'domain/repositories/routine.repository'

export class RoutineUseCases {
  static async getRoutine(repository: RoutineRepository, id: string): Promise<Routine | null> {
    return repository.getRoutineById(id)
  }

  static async getAllRoutines(repository: RoutineRepository): Promise<Routine[]> {
    return repository.getAllRoutines()
  }

  static async createRoutine(
    repository: RoutineRepository,
    routine: Routine,
    circuitWorkouts: CircuitWorkout[] = []
  ): Promise<Routine> {
    const circuitWorkoutPromises = circuitWorkouts.map(repository.createCircuitWorkout)

    if (circuitWorkouts.length > 0) {
      await Promise.all(circuitWorkoutPromises)
    }

    return repository.createRoutine(routine)
  }

  static async updateRoutine(
    repository: RoutineRepository,
    id: string,
    routine: Routine,
    circuitWorkouts: CircuitWorkout[] = []
  ): Promise<Routine> {
    const circuitWorkoutPromises = circuitWorkouts.map((cw) => repository.updateCircuitWorkout(cw.id, cw))

    if (circuitWorkouts.length > 0) {
      await Promise.all(circuitWorkoutPromises)
    }

    return repository.updateRoutine(id, routine)
  }

  static async deleteRoutine(repository: RoutineRepository, id: string): Promise<void> {
    const circuitWorkouts = await repository.getCircuitWorkout(id)

    if (circuitWorkouts.length > 0) {
      await Promise.all(circuitWorkouts.map((cw) => repository.deleteCircuitWorkout(cw.id)))
    }

    return repository.deleteRoutine(id)
  }

  static async getCircuitWorkout(repository: RoutineRepository, routineId: string): Promise<CircuitWorkout[]> {
    return repository.getCircuitWorkout(routineId)
  }

  static async createCircuitWorkout(
    repository: RoutineRepository,
    circuitWorkout: CircuitWorkout
  ): Promise<CircuitWorkout> {
    return repository.createCircuitWorkout(circuitWorkout)
  }

  static async updateCircuitWorkout(
    repository: RoutineRepository,
    id: string,
    circuitWorkout: CircuitWorkout
  ): Promise<CircuitWorkout> {
    return repository.updateCircuitWorkout(id, circuitWorkout)
  }

  static async deleteCircuitWorkout(repository: RoutineRepository, id: string): Promise<void> {
    return repository.deleteCircuitWorkout(id)
  }
}
