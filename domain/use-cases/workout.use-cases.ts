import { ExerciseSetDto, WorkoutDto, WorkoutExerciseDto } from 'domain/dtos/workout.dto'
import { ExerciseSet, Workout, WorkoutExercise } from 'domain/entities/workout.entity'
import { WorkoutRepository } from 'domain/repositories/workout.repository'

export class WorkoutUseCases {
  static async getById(repository: WorkoutRepository, id: string): Promise<Workout | null> {
    return repository.getWorkoutById(id)
  }

  static async getAll(repository: WorkoutRepository): Promise<Workout[]> {
    return repository.getAllWorkout()
  }

  static async create(repository: WorkoutRepository, workout: WorkoutDto): Promise<Workout> {
    return repository.createWorkout(workout)
  }

  static async update(repository: WorkoutRepository, id: string, workout: WorkoutDto): Promise<Workout> {
    return repository.updateWorkout(id, workout)
  }

  static async delete(repository: WorkoutRepository, id: string): Promise<void> {
    return repository.deleteWorkout(id)
  }

  static async getExercises(repository: WorkoutRepository, workoutId: string): Promise<WorkoutExercise[]> {
    return repository.getWorkoutExercises(workoutId)
  }

  static async createExercise(repository: WorkoutRepository, workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    return repository.createWorkoutExercise(workoutExercise)
  }

  static async updateExercise(repository: WorkoutRepository, id: string, workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    return repository.updateWorkoutExercise(id, workoutExercise)
  }

  static async deleteExercise(repository: WorkoutRepository, id: string): Promise<void> {
    return repository.deleteWorkoutExercise(id)
  }

  static async getSets(repository: WorkoutRepository, workoutId: string): Promise<ExerciseSet[]> {
    return repository.getExercisesSets(workoutId)
  }

  static async createSet(repository: WorkoutRepository, exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    return repository.createExerciseSet(exerciseSet)
  }

  static async updateSet(repository: WorkoutRepository, id: string, exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    return repository.updateExerciseSet(id, exerciseSet)
  }

  static async deleteSet(repository: WorkoutRepository, id: string): Promise<void> {
    return repository.deleteExerciseSet(id)
  }
}