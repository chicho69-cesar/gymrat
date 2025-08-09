import { ExerciseSetDto, WorkoutDto, WorkoutExerciseDto } from 'domain/dtos/workout.dto'
import { ExerciseSet, Workout, WorkoutDetails, WorkoutExercise, WorkoutStats, WorkoutWithDay } from 'domain/entities/workout.entity'

export abstract class WorkoutDataSource {
  abstract getWorkoutById(id: string): Promise<Workout | null>
  abstract getAllWorkout(): Promise<Workout[]>
  abstract getWorkoutByRoutineId(routineId: string): Promise<WorkoutWithDay[]>
  abstract createWorkout(workout: WorkoutDto): Promise<Workout>
  abstract updateWorkout(id: string, workout: WorkoutDto): Promise<Workout>
  abstract deleteWorkout(id: string): Promise<void>

  abstract getWorkoutExercisesByWorkoutId(workoutId: string): Promise<WorkoutExercise[]>
  abstract createWorkoutExercise(workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise>
  abstract updateWorkoutExercise(id: string, workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise>
  abstract deleteWorkoutExercise(id: string): Promise<void>

  abstract getExercisesSetsByWorkoutId(workoutId: string): Promise<ExerciseSet[]>
  abstract createExerciseSet(exerciseSet: ExerciseSetDto): Promise<ExerciseSet>
  abstract updateExerciseSet(id: string, exerciseSet: ExerciseSetDto): Promise<ExerciseSet>
  abstract deleteExerciseSet(id: string): Promise<void>

  abstract getWorkoutStats(exerciseId: string): Promise<WorkoutStats[]>
  abstract getWorkoutExercisesDetails(workoutId: string): Promise<WorkoutDetails[]>
}
