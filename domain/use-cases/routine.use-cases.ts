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
    const createdRoutine = await repository.createRoutine(routine)

    const circuitWorkoutPromises = circuitWorkouts.map((circuit) => {
      return repository.createCircuitWorkout(
        CircuitWorkoutMapper.toDto({
          ...circuit,
          routineId: createdRoutine.id,
        })
      )
    })

    if (circuitWorkoutPromises.length > 0) {
      await Promise.all(circuitWorkoutPromises)
    }

    return createdRoutine
  }

  static async update(
    repository: RoutineRepository,
    id: string,
    routine: RoutineDto,
    circuitWorkouts: CircuitWorkout[] = []
  ): Promise<Routine> {
    const updatedRoutine = await repository.updateRoutine(id, routine)

    const existingCircuitWorkouts = await repository.getCircuitWorkout(id)
    const existingCircuitWorkoutIds = new Set(existingCircuitWorkouts.map((cw) => cw.id))

    const updatedCircuitWorkouts = circuitWorkouts.filter((cw) => cw.id !== 'new' && existingCircuitWorkoutIds.has(cw.id))
    const circuitWorkoutsToDelete = existingCircuitWorkouts.filter((cw) => !updatedCircuitWorkouts.some((ucw) => ucw.id === cw.id))

    if (circuitWorkoutsToDelete.length > 0) {
      await Promise.all(circuitWorkoutsToDelete.map((cw) => repository.deleteCircuitWorkout(cw.id)))
    }

    const circuitWorkoutPromises = updatedCircuitWorkouts.map((circuit) => {
      if (circuit.id === 'new') {
        return repository.createCircuitWorkout(
          CircuitWorkoutMapper.toDto({
            ...circuit,
            routineId: updatedRoutine.id,
          })
        )
      } else {
        return repository.updateCircuitWorkout(circuit.id, CircuitWorkoutMapper.toDto(circuit))
      }
    })

    if (circuitWorkouts.length > 0) {
      await Promise.all(circuitWorkoutPromises)
    }

    return updatedRoutine
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
