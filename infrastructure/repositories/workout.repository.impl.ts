import { WorkoutDataSource } from 'domain/datasources/workout.datasource'
import { ExerciseSetDto, WorkoutDto, WorkoutExerciseDto } from 'domain/dtos/workout.dto'
import { ExerciseSet, Workout, WorkoutExercise } from 'domain/entities/workout.entity'
import { WorkoutRepository } from 'domain/repositories/workout.repository'

export class WorkoutRepositoryImpl implements WorkoutRepository {
  private readonly datasource: WorkoutDataSource

  constructor(datasource: WorkoutDataSource) {
    this.datasource = datasource
  }

  getWorkoutById(id: string): Promise<Workout | null> {
    return this.datasource.getWorkoutById(id)
  }

  getAllWorkout(): Promise<Workout[]> {
    return this.datasource.getAllWorkout()
  }

  createWorkout(workout: WorkoutDto): Promise<Workout> {
    return this.datasource.createWorkout(workout)
  }

  updateWorkout(id: string, workout: WorkoutDto): Promise<Workout> {
    return this.datasource.updateWorkout(id, workout)
  }

  deleteWorkout(id: string): Promise<void> {
    return this.datasource.deleteWorkout(id)
  }

  getWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    return this.datasource.getWorkoutExercisesByWorkoutId(workoutId)
  }

  createWorkoutExercise(workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    return this.datasource.createWorkoutExercise(workoutExercise)
  }

  updateWorkoutExercise(id: string, workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    return this.datasource.updateWorkoutExercise(id, workoutExercise)
  }

  deleteWorkoutExercise(id: string): Promise<void> {
    return this.datasource.deleteWorkoutExercise(id)
  }

  getExercisesSets(workoutId: string): Promise<ExerciseSet[]> {
    return this.datasource.getExercisesSetsByWorkoutId(workoutId)
  }

  createExerciseSet(exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    return this.datasource.createExerciseSet(exerciseSet)
  }

  updateExerciseSet(id: string, exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    return this.datasource.updateExerciseSet(id, exerciseSet)
  }

  deleteExerciseSet(id: string): Promise<void> {
    return this.datasource.deleteExerciseSet(id)
  }
}
