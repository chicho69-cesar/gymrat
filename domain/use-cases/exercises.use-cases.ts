import { ExerciseDto } from 'domain/dtos/exercise.dto'
import { Exercise } from 'domain/entities/exercise.entity'
import { ExerciseRepository } from 'domain/repositories/exercise.repository'
import { WorkoutDayRepository } from 'domain/repositories/workout-day.repository'

export class ExercisesUseCases {
  static async getById(repository: ExerciseRepository, id: string): Promise<Exercise | null> {
    return repository.getExerciseById(id)
  }

  static async getAll(repository: ExerciseRepository): Promise<Exercise[]> {
    return repository.getAllExercises()
  }

  static async getTop(repository: ExerciseRepository, limit: number): Promise<Exercise[]> {
    return repository.getTopExercises(limit)
  }

  static async getUsed(repository: ExerciseRepository): Promise<Exercise[]> {
    return repository.getUsedExercises()
  }

  static async create(repository: ExerciseRepository, exercise: ExerciseDto): Promise<Exercise> {
    if (exercise.rest < 0) {
      throw new Error('Rest time must be a non-negative number')
    }

    if (exercise.rest > 300) {
      throw new Error('Rest time must not exceed 300 seconds (5 minutes)')
    }

    return repository.createExercise(exercise)
  }

  static async update(repository: ExerciseRepository, id: string, exercise: ExerciseDto): Promise<Exercise> {
    if (exercise.rest < 0) {
      throw new Error('Rest time must be a non-negative number')
    }

    if (exercise.rest > 300) {
      throw new Error('Rest time must not exceed 300 seconds (5 minutes)')
    }

    return repository.updateExercise(id, exercise)
  }

  static async delete(
    repository: ExerciseRepository,
    workoutRepository: WorkoutDayRepository,
    id: string
  ): Promise<void> {
    try {
      const exercises = await workoutRepository.getWorkoutDayExercisesByExerciseId(id)

      if (exercises.length > 0) {
        throw new Error('No se puede eliminar el ejercicio porque está siendo utilizado en uno o más días de entrenamiento')
      }

      return repository.deleteExercise(id)
    } catch (error) {
      console.error('Error deleting exercise:', error)
      throw error
    }
  }
}
