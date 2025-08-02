import { ExerciseDataSource } from 'domain/datasources/exercise.datasource'
import { ExerciseDto } from 'domain/dtos/exercise.dto'
import { Exercise } from 'domain/entities/exercise.entity'
import { ExerciseRepository } from 'domain/repositories/exercise.repository'

export class ExerciseRepositoryImpl implements ExerciseRepository {
  private readonly dataSource: ExerciseDataSource

  constructor(dataSource: ExerciseDataSource) {
    this.dataSource = dataSource
  }

  getExerciseById(id: string): Promise<Exercise | null> {
    return this.dataSource.getExerciseById(id)
  }

  getAllExercises(): Promise<Exercise[]> {
    return this.dataSource.getAllExercises()
  }

  getTopExercises(limit: number): Promise<Exercise[]> {
    return this.dataSource.getTopExercises(limit)
  }

  createExercise(exercise: ExerciseDto): Promise<Exercise> {
    return this.dataSource.createExercise(exercise)
  }

  updateExercise(id: string, exercise: ExerciseDto): Promise<Exercise> {
    return this.dataSource.updateExercise(id, exercise)
  }

  deleteExercise(id: string): Promise<void> {
    return this.dataSource.deleteExercise(id)
  }
}