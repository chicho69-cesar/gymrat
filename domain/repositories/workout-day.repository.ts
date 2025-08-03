import { WorkoutDayDto, WorkoutDayExerciseDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDay, WorkoutDayExercise } from 'domain/entities/workout-day.entity'

export abstract class WorkoutDayRepository {
  abstract getWorkoutDayById(id: string): Promise<WorkoutDay | null>
  abstract getAllWorkoutDays(): Promise<WorkoutDay[]>
  abstract getMostFrequentWorkoutDays(limit: number): Promise<WorkoutDay[]>
  abstract createWorkoutDay(workoutDay: WorkoutDayDto): Promise<WorkoutDay>
  abstract updateWorkoutDay(id: string, workoutDay: WorkoutDayDto): Promise<WorkoutDay>
  abstract deleteWorkoutDay(id: string): Promise<void>

  abstract getWorkoutDayExercises(workoutDayId: string): Promise<WorkoutDayExercise[]>
  abstract getWorkoutDayExercisesByExerciseId(exerciseId: string): Promise<WorkoutDayExercise[]>
  abstract createWorkoutDayExercise(workoutDayExercise: WorkoutDayExerciseDto): Promise<WorkoutDayExercise>
  abstract updateWorkoutDayExercise(id: string, workoutDayExercise: WorkoutDayExerciseDto): Promise<WorkoutDayExercise>
  abstract deleteWorkoutDayExercise(id: string): Promise<void>
}
