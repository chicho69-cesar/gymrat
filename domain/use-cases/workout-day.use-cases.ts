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
    workoutDay: WorkoutDay,
    exercises: WorkoutDayExercise[] = []
  ): Promise<WorkoutDay> {
    const exercisePromises = exercises
      .map((exercise) => repository.createWorkoutDayExercise(
        WorkoutDayExerciseMapper.toDto(exercise)
      ))

    if (exercises.length > 0) {
      await Promise.all(exercisePromises)
    }

    return repository.createWorkoutDay(workoutDay)
  }

  static async update(
    repository: WorkoutDayRepository,
    id: string,
    workoutDay: WorkoutDayDto,
    exercises: WorkoutDayExercise[] = []
  ): Promise<WorkoutDay> {
    const exercisePromises = exercises.map((exercise) => repository.updateWorkoutDayExercise(
      exercise.id, WorkoutDayExerciseMapper.toDto(exercise)
    ))

    if (exercises.length > 0) {
      await Promise.all(exercisePromises)
    }

    return repository.updateWorkoutDay(id, workoutDay)
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
