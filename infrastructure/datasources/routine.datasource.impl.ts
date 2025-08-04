import { SQLiteDatabase } from 'expo-sqlite'

import { generateId } from 'config/helpers/create-uuid'
import { RoutineDataSource } from 'domain/datasources/routine.datasource'
import { CircuitWorkoutDto, RoutineDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout, Routine } from 'domain/entities/routine.entity'
import { CircuitWorkoutMapper } from 'infrastructure/mappers/circuit-workout.mapper'
import { RoutineMapper } from 'infrastructure/mappers/routine.mapper'

export class RoutineDataSourceImpl implements RoutineDataSource {
  private readonly db: SQLiteDatabase

  constructor(db: SQLiteDatabase) {
    this.db = db
  }

  async getRoutineById(id: string): Promise<Routine | null> {
    try {
      const routine = await this.db.getFirstAsync<Routine>(
        /* sql */`
          SELECT * FROM Routine WHERE id = ?
        `,
        [id]
      )

      return routine
    } catch (error) {
      console.error('Error fetching routine by ID:', error)
      return null
    }
  }

  async getAllRoutines(): Promise<Routine[]> {
    try {
      const routines = await this.db.getAllAsync<Routine>(
        /* sql */`
          SELECT * FROM Routine
        `
      )

      return routines
    } catch (error) {
      console.error('Error fetching all routines:', error)
      return []
    }
  }

  async getLastRoutines(limit: number): Promise<Routine[]> {
    try {
      const routines = await this.db.getAllAsync<Routine>(
        /* sql */`
          SELECT DISTINCT r.*
          FROM Routine r
          INNER JOIN Workout w ON r.id = w.routineId
          ORDER BY 
            substr(w.date, 7, 4) DESC,  -- Year
            substr(w.date, 4, 2) DESC,  -- Month  
            substr(w.date, 1, 2) DESC   -- Day
          LIMIT ?
        `,
        [limit]
      )

      return routines
    } catch (error) {
      console.error('Error fetching last routines:', error)
      return []
    }
  }

  async createRoutine(routine: RoutineDto): Promise<Routine> {
    try {
      const id = generateId()

      await this.db.runAsync(
        /* sql */`
          INSERT INTO Routine (id, name, description)
          VALUES (?, ?, ?)
        `,
        [id, routine.name, routine.description || '']
      )

      return RoutineMapper.toEntity(routine, id)
    } catch (error) {
      console.error('Error creating routine:', error)
      throw new Error('Failed to create routine')
    }
  }

  async updateRoutine(id: string, routine: RoutineDto): Promise<Routine> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE Routine
          SET name = ?, description = ?
          WHERE id = ?
        `,
        [routine.name, routine.description || '', id]
      )

      return RoutineMapper.toEntity(routine, id)
    } catch (error) {
      console.error('Error updating routine:', error)
      throw new Error('Failed to update routine')
    }
  }

  async deleteRoutine(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM Routine WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting routine:', error)
      throw new Error('Failed to delete routine')
    }
  }

  async getCircuitWorkoutsByRoutineId(routineId: string): Promise<CircuitWorkout[]> {
    try {
      const circuitWorkouts = await this.db.getAllAsync<CircuitWorkout>(
        /* sql */`
          SELECT * FROM CircuitWorkout WHERE routineId = ?
        `,
        [routineId]
      )

      return circuitWorkouts
    } catch (error) {
      console.error('Error fetching circuit workouts by routine ID:', error)
      return []
    }
  }

  async createCircuitWorkout(circuitWorkout: CircuitWorkoutDto): Promise<CircuitWorkout> {
    try {
      const id = generateId()

      await this.db.runAsync(
        /* sql */`
          INSERT INTO CircuitWorkout (id, routineId, workoutDayId, orderNumber)
          VALUES (?, ?, ?, ?)
        `,
        [id, circuitWorkout.routineId, circuitWorkout.workoutDayId, circuitWorkout.orderNumber]
      )

      return CircuitWorkoutMapper.toEntity(circuitWorkout, id)
    } catch (error) {
      console.error('Error creating circuit workout:', error)
      throw new Error('Failed to create circuit workout')
    }
  }

  async updateCircuitWorkout(id: string, circuitWorkout: CircuitWorkoutDto): Promise<CircuitWorkout> {
    try {
      await this.db.runAsync(
        /* sql */`
          UPDATE CircuitWorkout
          SET routineId = ?, workoutDayId = ?, orderNumber = ?
          WHERE id = ?
        `,
        [circuitWorkout.routineId, circuitWorkout.workoutDayId, circuitWorkout.orderNumber, id]
      )

      return CircuitWorkoutMapper.toEntity(circuitWorkout, id)
    } catch (error) {
      console.error('Error updating circuit workout:', error)
      throw new Error('Failed to update circuit workout')
    }
  }

  async deleteCircuitWorkout(id: string): Promise<void> {
    try {
      await this.db.runAsync(
        /* sql */`
          DELETE FROM CircuitWorkout WHERE id = ?
        `,
        [id]
      )
    } catch (error) {
      console.error('Error deleting circuit workout:', error)
      throw new Error('Failed to delete circuit workout')
    }
  }
}
