import { SQLiteDatabase } from 'expo-sqlite'

import { generateId } from 'config/helpers/create-uuid'
import { WorkoutDayDataSource } from 'domain/datasources/workout-day.datasource'
import { WorkoutDayDto, WorkoutDayExerciseDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDay, WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { WorkoutDayExerciseMapper } from 'infrastructure/mappers/workout-day-exercise.mapper'
import { WorkoutDayMapper } from 'infrastructure/mappers/workout-day.mapper'

export class WorkoutDayDatasourceImpl implements WorkoutDayDataSource {
  private readonly db: SQLiteDatabase

  constructor(db: SQLiteDatabase) {
    this.db = db
  }

  async getWorkoutDayById(id: string): Promise<WorkoutDay | null> {
    try {
      const workoutDay = await this.db.getFirstAsync<WorkoutDay>(
        /* sql */`
          SELECT * FROM WorkoutDay WHERE id = ?
        `,
        [id]
      )

      return workoutDay
    } catch (error) {
      console.error('Error fetching workout day by ID:', error)
      return null
    }
  }

  async getAllWorkoutDays(): Promise<WorkoutDay[]> {
    try {
      const workoutDays = await this.db.getAllAsync<WorkoutDay>(
        /* sql */`
          SELECT * FROM WorkoutDay
        `
      )

      return workoutDays
    } catch (error) {
      console.error('Error fetching all workout days:', error)
      return []
    }
  }

  async getMostFrequentWorkoutDays(limit: number): Promise<WorkoutDay[]> {
    try {
      const workoutDays = await this.db.getAllAsync<WorkoutDay>(
        /* sql */`
          SELECT wd.*
          FROM WorkoutDay wd
          INNER JOIN Workout w ON wd.id = w.workoutDayId
          GROUP BY wd.id, wd.name, wd.description
          ORDER BY COUNT(w.id) DESC, wd.name ASC
          LIMIT ?
        `,
        [limit]
      )

      return workoutDays
    } catch (error) {
      console.error('Error fetching most frequent workout days:', error)
      return []
    }
  }

  async getWorkoutDaysByRoutineId(routineId: string): Promise<WorkoutDay[]> {
    try {
      const workoutDays = await this.db.getAllAsync<WorkoutDay>(
        /* sql */`
          SELECT wd.*
          FROM WorkoutDay wd
          INNER JOIN CircuitWorkout cw ON wd.id = cw.workoutDayId
          INNER JOIN Routine r ON cw.routineId = r.id
          WHERE r.id = ?
        `,
        [routineId]
      )

      return workoutDays
    } catch (error) {
      console.error('Error fetching workout days by routine ID:', error)
      return []
    }
  }

  async createWorkoutDay(workoutDay: WorkoutDayDto): Promise<WorkoutDay> {
    try {
      const id = generateId()

      await this.db.runAsync(
        /* sql */`
          INSERT INTO WorkoutDay (id, name, description)
          VALUES (?, ?, ?)
        `,
        [id, workoutDay.name, workoutDay.description || '']
      )

      return WorkoutDayMapper.toEntity(workoutDay, id)
    } catch (error) {
      console.error('Error creating workout day:', error)
      throw new Error('Failed to create workout day')
    }
  }

  async updateWorkoutDay(id: string, workoutDay: WorkoutDayDto): Promise<WorkoutDay> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE WorkoutDay
          SET name = ?, description = ?
          WHERE id = ?
        `,
        [workoutDay.name, workoutDay.description || '', id]
      )

      return WorkoutDayMapper.toEntity(workoutDay, id)
    } catch (error) {
      console.error('Error updating workout day:', error)
      throw new Error('Failed to update workout day')
    }
  }

  async deleteWorkoutDay(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM WorkoutDay WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting workout day:', error)
      throw new Error('Failed to delete workout day')
    }
  }

  async getWorkoutDayExercisesByWorkoutDayId(workoutDayId: string): Promise<WorkoutDayExercise[]> {
    try {
      const exercises = await this.db.getAllAsync<WorkoutDayExercise>(
        /* sql */`
          SELECT * FROM WorkoutDayExercise WHERE workoutDayId = ?
        `,
        [workoutDayId]
      )

      return exercises
    } catch (error) {
      console.error('Error fetching workout day exercises by workout day ID:', error)
      return []
    }
  }

  async getWorkoutDayExercisesByExerciseId(exerciseId: string): Promise<WorkoutDayExercise[]> {
    try {
      const exercises = await this.db.getAllAsync<WorkoutDayExercise>(
        /* sql */`
          SELECT * FROM WorkoutDayExercise WHERE exerciseId = ?
        `,
        [exerciseId]
      )

      return exercises
    } catch (error) {
      console.error('Error fetching workout day exercises by exercise ID:', error)
      return []
    }
  }

  async createWorkoutDayExercise(workoutDayExercise: WorkoutDayExerciseDto): Promise<WorkoutDayExercise> {
    try {
      const id = generateId()

      await this.db.runAsync(
        /* sql */`
          INSERT INTO WorkoutDayExercise (id, sets, heatingSets, workoutDayId, exerciseId)
          VALUES (?, ?, ?, ?, ?)
        `,
        [id, workoutDayExercise.sets, workoutDayExercise.heatingSets, workoutDayExercise.workoutDayId, workoutDayExercise.exerciseId]
      )

      return WorkoutDayExerciseMapper.toEntity(workoutDayExercise, id)
    } catch (error) {
      console.error('Error creating workout day exercise:', error)
      throw new Error('Failed to create workout day exercise')
    }
  }

  async updateWorkoutDayExercise(id: string, workoutDayExercise: WorkoutDayExerciseDto): Promise<WorkoutDayExercise> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE WorkoutDayExercise
          SET sets = ?, heatingSets = ?, workoutDayId = ?, exerciseId = ?
          WHERE id = ?
        `,
        [workoutDayExercise.sets, workoutDayExercise.heatingSets, workoutDayExercise.workoutDayId, workoutDayExercise.exerciseId, id]
      )

      return WorkoutDayExerciseMapper.toEntity(workoutDayExercise, id)
    } catch (error) {
      console.error('Error updating workout day exercise:', error)
      throw new Error('Failed to update workout day exercise')
    }
  }

  async deleteWorkoutDayExercise(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM WorkoutDayExercise WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting workout day exercise:', error)
      throw new Error('Failed to delete workout day exercise')
    }
  }
}
