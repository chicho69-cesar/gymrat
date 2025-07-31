import { SQLiteDatabase } from 'expo-sqlite'

import { generateId } from 'config/helpers/create-uuid'
import { WorkoutDataSource } from 'domain/datasources/workout.datasource'
import { ExerciseSetDto, WorkoutDto, WorkoutExerciseDto } from 'domain/dtos/workout.dto'
import { ExerciseSet, Workout, WorkoutExercise } from 'domain/entities/workout.entity'
import { ExerciseSetMapper } from 'infrastructure/mappers/exercise-set.mapper'
import { WorkoutExerciseMapper } from 'infrastructure/mappers/workout-exercise.mapper'
import { WorkoutMapper } from 'infrastructure/mappers/workout.mapper'

export class WorkoutDataSourceImpl implements WorkoutDataSource {
  private readonly db: SQLiteDatabase

  constructor(db: SQLiteDatabase) {
    this.db = db
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    try {
      const workout = await this.db.getFirstAsync<Workout>(
        /* sql */`
          SELECT * FROM Workout WHERE id = ?
        `,
        [id]
      )

      return workout
    } catch (error) {
      console.error('Error fetching workout by ID:', error)
      return null
    }
  }

  async getAllWorkout(): Promise<Workout[]> {
    try {
      const workouts = await this.db.getAllAsync<Workout>(
        /* sql */`
          SELECT * FROM Workout
        `
      )

      return workouts
    } catch (error) {
      console.error('Error fetching all workouts:', error)
      return []
    }
  }

  async createWorkout(workout: WorkoutDto): Promise<Workout> {
    try {
      const id = generateId()

      const newWorkout = await this.db.runAsync(
        /* sql */`
          INSERT INTO Workout (id, date, routineId, workoutDayId)
          VALUES (?, ?, ?, ?)
        `,
        [id, workout.date, workout.routineId, workout.workoutDayId]
      )

      return WorkoutMapper.toEntity(workout, newWorkout.lastInsertRowId.toString())
    } catch (error) {
      console.error('Error creating workout:', error)
      throw new Error('Failed to create workout')
    }
  }

  async updateWorkout(id: string, workout: WorkoutDto): Promise<Workout> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE Workout
          SET date = ?, routineId = ?, workoutDayId = ?
          WHERE id = ?
        `,
        [workout.date, workout.routineId, workout.workoutDayId, id]
      )

      return WorkoutMapper.toEntity(workout, id)
    } catch (error) {
      console.error('Error updating workout:', error)
      throw new Error('Failed to update workout')
    }
  }

  async deleteWorkout(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM Workout WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting workout:', error)
      throw new Error('Failed to delete workout')
    }
  }

  async getWorkoutExercisesByWorkoutId(workoutId: string): Promise<WorkoutExercise[]> {
    try {
      const exercises = await this.db.getAllAsync<WorkoutExercise>(
        /* sql */`
          SELECT * FROM WorkoutExercise WHERE workoutId = ?
        `,
        [workoutId]
      )

      return exercises
    } catch (error) {
      console.error('Error fetching workout exercises by workout ID:', error)
      return []
    }
  }

  async createWorkoutExercise(workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    try {
      const id = generateId()

      const newWorkoutExercise = await this.db.runAsync(
        /* sql */`
          INSERT INTO WorkoutExercise (id, workoutId, workoutDayExerciseId)
          VALUES (?, ?, ?)
        `,
        [id, workoutExercise.workoutId, workoutExercise.workoutDayExerciseId]
      )

      return WorkoutExerciseMapper.toEntity(
        workoutExercise,
        newWorkoutExercise.lastInsertRowId.toString()
      )
    } catch (error) {
      console.error('Error creating workout exercise:', error)
      throw new Error('Failed to create workout exercise')
    }
  }

  async updateWorkoutExercise(id: string, workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE WorkoutExercise
          SET workoutId = ?, workoutDayExerciseId = ?
          WHERE id = ?
        `,
        [workoutExercise.workoutId, workoutExercise.workoutDayExerciseId, id]
      )

      return WorkoutExerciseMapper.toEntity(workoutExercise, id)
    } catch (error) {
      console.error('Error updating workout exercise:', error)
      throw new Error('Failed to update workout exercise')
    }
  }

  async deleteWorkoutExercise(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM WorkoutExercise WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting workout exercise:', error)
      throw new Error('Failed to delete workout exercise')
    }
  }

  async getExercisesSetsByWorkoutId(workoutId: string): Promise<ExerciseSet[]> {
    try {
      const exercises = await this.db.getAllAsync<ExerciseSet>(
        /* sql */`
          SELECT * FROM ExerciseSet WHERE workoutExerciseId = ?
        `,
        [workoutId]
      )

      return exercises
    } catch (error) {
      console.error('Error fetching exercise sets by workout ID:', error)
      return []
    }
  }

  async createExerciseSet(exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    try {
      const id = generateId()

      const newExerciseSet = await this.db.runAsync(
        /* sql */`
          INSERT INTO ExerciseSet (id, unit, reps, weight, setNumber, workoutExerciseId)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          id,
          exerciseSet.unit,
          exerciseSet.reps,
          exerciseSet.weight,
          exerciseSet.setNumber,
          exerciseSet.workoutExerciseId
        ]
      )

      return ExerciseSetMapper.toEntity(
        exerciseSet,
        newExerciseSet.lastInsertRowId.toString()
      )
    } catch (error) {
      console.error('Error creating exercise set:', error)
      throw new Error('Failed to create exercise set')
    }
  }

  async updateExerciseSet(id: string, exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE ExerciseSet
          SET unit = ?, reps = ?, weight = ?, setNumber = ?
          WHERE id = ?
        `,
        [exerciseSet.unit, exerciseSet.reps, exerciseSet.weight, exerciseSet.setNumber, id]
      )

      return ExerciseSetMapper.toEntity(exerciseSet, id)
    } catch (error) {
      console.error('Error updating exercise set:', error)
      throw new Error('Failed to update exercise set')
    }
  }

  async deleteExerciseSet(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM ExerciseSet WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting exercise set:', error)
      throw new Error('Failed to delete exercise set')
    }
  }
}
