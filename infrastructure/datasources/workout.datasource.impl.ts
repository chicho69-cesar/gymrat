import { SQLiteDatabase } from 'expo-sqlite'

import { generateId } from 'config/helpers/create-uuid'
import { WorkoutDataSource } from 'domain/datasources/workout.datasource'
import { ExerciseSetDto, WorkoutDto, WorkoutExerciseDto } from 'domain/dtos/workout.dto'
import { ExerciseSet, Workout, WorkoutDetails, WorkoutExercise, WorkoutStats, WorkoutWithDay } from 'domain/entities/workout.entity'
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

  async getWorkoutByRoutineId(routineId: string): Promise<WorkoutWithDay[]> {
    try {
      const workouts = await this.db.getAllAsync<WorkoutWithDay>(
        /* sql */`
          SELECT w.*, wd.name as workoutDayName
          FROM Workout as w, WorkoutDay as wd
          WHERE w.workoutDayId = wd.id AND w.routineId = ?
          ORDER BY 
            substr(w.date, 7, 4) DESC,  -- Year
            substr(w.date, 4, 2) DESC,  -- Month  
            substr(w.date, 1, 2) DESC   -- Day
        `,
        [routineId]
      )

      return workouts
    } catch (error) {
      console.error('Error fetching workouts by routine ID:', error)
      return []
    }
  }

  async createWorkout(workout: WorkoutDto): Promise<Workout> {
    try {
      const id = generateId()

      await this.db.runAsync(
        /* sql */`
          INSERT INTO Workout (id, date, routineId, workoutDayId)
          VALUES (?, ?, ?, ?)
        `,
        [id, workout.date, workout.routineId, workout.workoutDayId]
      )

      return WorkoutMapper.toEntity(workout, id)
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

      return WorkoutExerciseMapper.toEntity(workoutExercise, id)
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

      await this.db.runAsync(
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

      return ExerciseSetMapper.toEntity(exerciseSet, id)
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

  async getWorkoutStats(exerciseId: string): Promise<WorkoutStats[]> {
    try {
      // const exampleStats: WorkoutStats[] = [
      //   { date: '01-07-2025', weight: 70, reps: 10, unit: 'Kg', volume: 700, workoutId: 'w1' },
      //   { date: '05-07-2025', weight: 72.5, reps: 10, unit: 'Kg', volume: 725, workoutId: 'w2' },
      //   { date: '08-07-2025', weight: 75, reps: 9, unit: 'Kg', volume: 675, workoutId: 'w3' },
      //   { date: '12-07-2025', weight: 75, reps: 10, unit: 'Kg', volume: 750, workoutId: 'w4' },
      //   { date: '15-07-2025', weight: 77.5, reps: 10, unit: 'Kg', volume: 775, workoutId: 'w5' },
      //   { date: '19-07-2025', weight: 80, reps: 8, unit: 'Kg', volume: 640, workoutId: 'w6' },
      //   { date: '22-07-2025', weight: 80, reps: 10, unit: 'Kg', volume: 800, workoutId: 'w7' },
      //   { date: '26-07-2025', weight: 82.5, reps: 10, unit: 'Kg', volume: 825, workoutId: 'w8' },
      // ]

      // const sortedStats = exampleStats.sort((a, b) => {
      //   const dateA = new Date(a.date.split('-').reverse().join('-'))
      //   const dateB = new Date(b.date.split('-').reverse().join('-'))
      //   return dateA.getTime() - dateB.getTime()
      // })

      const stats = await this.db.getAllAsync<WorkoutStats>(
        /* sql */`
          SELECT 
            w.date AS date,
            AVG(es.weight) AS weight,
            SUM(es.reps) AS reps,
            es.unit AS unit,
            SUM(es.weight * es.reps) AS volume,
            w.id AS workoutId
          FROM 
            Exercise e JOIN WorkoutDayExercise wde ON e.id = wde.exerciseId
            JOIN WorkoutExercise we ON wde.id = we.workoutDayExerciseId
            JOIN ExerciseSet es ON we.id = es.workoutExerciseId
            JOIN Workout w ON we.workoutId = w.id
          WHERE 
            e.id = ? 
          GROUP BY 
            w.date, w.id
          ORDER BY 
            w.date ASC;
        `,
        [exerciseId]
      )

      return stats
    } catch (error) {
      console.error('Error fetching workout stats:', error)
      return []
    }
  }

  async getWorkoutExercisesDetails(workoutId: string): Promise<WorkoutDetails[]> {
    try {
      const details = await this.db.getAllAsync<WorkoutDetails>(
        /* sql */`
          SELECT 
            we.id AS workoutExerciseId,
            we.workoutId,
            we.workoutDayExerciseId,
            
            -- Datos del Exercise
            e.id AS exerciseId,
            e.name AS exerciseName,
            e.description AS exerciseDescription,
            e.rest AS exerciseRest,
            
            -- Datos del WorkoutDayExercise
            wde.workoutDayId,
            wde.sets AS plannedSets,
            wde.heatingSets,
            
            -- Datos de los Sets
            es.id AS setId,
            es.weight,
            es.reps,
            es.unit,
            es.setNumber
          FROM 
            WorkoutExercise we
          JOIN 
            WorkoutDayExercise wde ON we.workoutDayExerciseId = wde.id
          JOIN 
            Exercise e ON wde.exerciseId = e.id
          LEFT JOIN 
            ExerciseSet es ON we.id = es.workoutExerciseId
          WHERE 
            we.workoutId = ?  -- Parámetro para el ID del Workout
          ORDER BY 
            we.id, es.setNumber;
        `,
        [workoutId]
      )

      return details
    } catch (error) {
      console.error('Error fetching workout exercises details:', error)
      return []
    }
  }
}
