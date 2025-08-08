import { SQLiteDatabase } from 'expo-sqlite'

import { generateId } from 'config/helpers/create-uuid'
import { ExerciseDataSource } from 'domain/datasources/exercise.datasource'
import { ExerciseDto } from 'domain/dtos/exercise.dto'
import { Exercise } from 'domain/entities/exercise.entity'
import { ExerciseMapper } from 'infrastructure/mappers/exercise.mapper'

export class ExerciseDataSourceImpl implements ExerciseDataSource {
  private readonly db: SQLiteDatabase

  constructor(db: SQLiteDatabase) {
    this.db = db
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    try {
      const exercise = await this.db.getFirstAsync<Exercise>(
        /* sql */`
          SELECT * FROM Exercise WHERE id = ?
        `,
        [id]
      )

      return exercise
    } catch (error) {
      console.error('Error fetching exercise by ID:', error)
      return null
    }
  }

  async getAllExercises(): Promise<Exercise[]> {
    try {
      const exercises = await this.db.getAllAsync<Exercise>(
        /* sql */`
          SELECT * FROM Exercise
        `
      )

      return exercises
    } catch (error) {
      console.error('Error fetching all exercises:', error)
      return []
    }
  }

  async getTopExercises(limit: number): Promise<Exercise[]> {
    try {
      const exercises = await this.db.getAllAsync<Exercise>(
        /* sql */`
          SELECT e.*, COUNT(wde.exerciseId) as usage_count
          FROM Exercise e
          LEFT JOIN WorkoutDayExercise wde ON e.id = wde.exerciseId
          GROUP BY e.id, e.name, e.description, e.rest
          ORDER BY usage_count DESC, e.name ASC
          LIMIT ?
        `,
        [limit]
      )

      return exercises
    } catch (error) {
      console.error('Error fetching top exercises:', error)
      return []
    }
  }

  async getUsedExercises(): Promise<Exercise[]> {
    try {
      const exercises = await this.db.getAllAsync<Exercise>(
        /* sql */`
          SELECT DISTINCT e.*
          FROM Exercise e
          INNER JOIN WorkoutDayExercise wde ON e.id = wde.exerciseId 
          INNER JOIN WorkoutExercise we ON wde.workoutExerciseId = we.id
        `
      )

      return exercises
    } catch (error) {
      console.error('Error fetching used exercises:', error)
      return []
    }
  }

  async createExercise(exercise: ExerciseDto): Promise<Exercise> {
    try {
      const id = generateId()

      await this.db.runAsync(
        /* sql */`
          INSERT INTO Exercise (id, name, description, rest)
          VALUES (?, ?, ?, ?)
        `,
        [id, exercise.name, exercise.description || '', exercise.rest]
      )

      return ExerciseMapper.toEntity(exercise, id)
    } catch (error) {
      console.error('Error creating exercise:', error)
      throw new Error('Failed to create exercise')
    }
  }

  async updateExercise(id: string, exercise: ExerciseDto): Promise<Exercise> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE Exercise
          SET name = ?, description = ?, rest = ?
          WHERE id = ?
        `,
        [exercise.name, exercise.description || '', exercise.rest, id]
      )

      return ExerciseMapper.toEntity(exercise, id)
    } catch (error) {
      console.error('Error updating exercise:', error)
      throw new Error('Failed to update exercise')
    }
  }

  async deleteExercise(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM Exercise WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting exercise:', error)
      throw new Error('Failed to delete exercise')
    }
  }
}
