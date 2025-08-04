import { WorkoutDayDto, WorkoutDayExerciseDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDay, WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { WorkoutDayRepository } from 'domain/repositories/workout-day.repository'
import { WorkoutDayExerciseMapper } from 'infrastructure/mappers/workout-day-exercise.mapper'

export class WorkoutDayUseCases {
  static async getById(repository: WorkoutDayRepository, id: string): Promise<WorkoutDay | null> {
    return repository.getWorkoutDayById(id)
  }

  static async getAll(repository: WorkoutDayRepository): Promise<WorkoutDay[]> {
    return repository.getAllWorkoutDays()
  }

  static async getMostFrequents(repository: WorkoutDayRepository, limit: number): Promise<WorkoutDay[]> {
    return repository.getMostFrequentWorkoutDays(limit)
  }

  static async create(
    repository: WorkoutDayRepository,
    workoutDay: WorkoutDayDto,
    exercises: WorkoutDayExercise[] = []
  ): Promise<WorkoutDay> {
    const createdWorkoutDay = await repository.createWorkoutDay(workoutDay)

    const exercisePromises = exercises.map((exercise) => {
      return repository.createWorkoutDayExercise(
        WorkoutDayExerciseMapper.toDto({
          ...exercise,
          workoutDayId: createdWorkoutDay.id,
        })
      )
    })

    if (exercises.length > 0) {
      await Promise.all(exercisePromises)
    }

    return createdWorkoutDay
  }

  static async update(
    repository: WorkoutDayRepository,
    id: string,
    workoutDay: WorkoutDayDto,
    exercises: WorkoutDayExercise[] = []
  ): Promise<WorkoutDay> {
    const updatedWorkoutDay = await repository.updateWorkoutDay(id, workoutDay)

    const existingExercises = await repository.getWorkoutDayExercises(id)
    const existingExerciseIds = new Set(existingExercises.map((ex) => ex.id))

    const updatedExercises = exercises.filter((ex) => ex.id !== 'new' && existingExerciseIds.has(ex.id))
    const exercisesToDelete = existingExercises.filter((ex) => !updatedExercises.some((ue) => ue.id === ex.id))

    if (exercisesToDelete.length > 0) {
      await Promise.all(exercisesToDelete.map((ex) => repository.deleteWorkoutDayExercise(ex.id)))
    }

    const exercisePromises = exercises.map((exercise) => {
      if (exercise.id === 'new') {
        return repository.createWorkoutDayExercise(
          WorkoutDayExerciseMapper.toDto({
            ...exercise,
            workoutDayId: updatedWorkoutDay.id,
          })
        )
      } else {
        return repository.updateWorkoutDayExercise(exercise.id, WorkoutDayExerciseMapper.toDto(exercise))
      }
    })

    if (exercises.length > 0) {
      await Promise.all(exercisePromises)
    }

    return updatedWorkoutDay
  }

  static async delete(repository: WorkoutDayRepository, id: string): Promise<void> {
    const exercises = await repository.getWorkoutDayExercises(id)

    if (exercises.length > 0) {
      await Promise.all(exercises.map((exercise) => repository.deleteWorkoutDayExercise(exercise.id)))
    }

    return repository.deleteWorkoutDay(id)
  }

  static async getExercises(repository: WorkoutDayRepository, workoutDayId: string): Promise<WorkoutDayExercise[]> {
    return repository.getWorkoutDayExercises(workoutDayId)
  }

  static async getExercisesByExercise(repository: WorkoutDayRepository, exerciseId: string): Promise<WorkoutDayExercise[]> {
    return repository.getWorkoutDayExercisesByExerciseId(exerciseId)
  }

  static async createExercise(
    repository: WorkoutDayRepository,
    workoutDayExercise: WorkoutDayExerciseDto
  ): Promise<WorkoutDayExercise> {
    return repository.createWorkoutDayExercise(workoutDayExercise)
  }

  static async updateExercise(
    repository: WorkoutDayRepository,
    id: string,
    workoutDayExercise: WorkoutDayExerciseDto
  ): Promise<WorkoutDayExercise> {
    return repository.updateWorkoutDayExercise(id, workoutDayExercise)
  }

  static async deleteExercise(repository: WorkoutDayRepository, id: string): Promise<void> {
    return repository.deleteWorkoutDayExercise(id)
  }
}
