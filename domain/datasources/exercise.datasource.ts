import { ExerciseDto } from 'domain/dtos/exercise.dto'
import { Exercise } from 'domain/entities/exercise.entity'

export abstract class ExerciseDataSource {
  abstract getExerciseById(id: string): Promise<Exercise | null>
  abstract getAllExercises(): Promise<Exercise[]>
  abstract getTopExercises(limit: number): Promise<Exercise[]>
  abstract getUsedExercises(): Promise<Exercise[]>
  abstract createExercise(exercise: ExerciseDto): Promise<Exercise>
  abstract updateExercise(id: string, exercise: ExerciseDto): Promise<Exercise>
  abstract deleteExercise(id: string): Promise<void>
}
