import { WorkoutDayDataSource } from 'domain/datasources/workout-day.datasource'
import { WorkoutDayDto, WorkoutDayExerciseDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDay, WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { WorkoutDayRepository } from 'domain/repositories/workout-day.repository'

export class WorkoutDayRepositoryImpl implements WorkoutDayRepository {
  private readonly datasource: WorkoutDayDataSource

  constructor(datasource: WorkoutDayDataSource) {
    this.datasource = datasource
  }

  getWorkoutDayById(id: string): Promise<WorkoutDay | null> {
    return this.datasource.getWorkoutDayById(id)
  }

  getAllWorkoutDays(): Promise<WorkoutDay[]> {
    return this.datasource.getAllWorkoutDays()
  }

  getMostFrequentWorkoutDays(limit: number): Promise<WorkoutDay[]> {
    return this.datasource.getMostFrequentWorkoutDays(limit)
  }

  getWorkoutDaysByRoutineId(routineId: string): Promise<WorkoutDay[]> {
    return this.datasource.getWorkoutDaysByRoutineId(routineId)
  }

  createWorkoutDay(workoutDay: WorkoutDayDto): Promise<WorkoutDay> {
    return this.datasource.createWorkoutDay(workoutDay)
  }

  updateWorkoutDay(id: string, workoutDay: WorkoutDayDto): Promise<WorkoutDay> {
    return this.datasource.updateWorkoutDay(id, workoutDay)
  }

  deleteWorkoutDay(id: string): Promise<void> {
    return this.datasource.deleteWorkoutDay(id)
  }

  getWorkoutDayExercises(workoutDayId: string): Promise<WorkoutDayExercise[]> {
    return this.datasource.getWorkoutDayExercisesByWorkoutDayId(workoutDayId)
  }

  getWorkoutDayExercisesByExerciseId(exerciseId: string): Promise<WorkoutDayExercise[]> {
    return this.datasource.getWorkoutDayExercisesByExerciseId(exerciseId)
  }

  createWorkoutDayExercise(workoutDayExercise: WorkoutDayExerciseDto): Promise<WorkoutDayExercise> {
    return this.datasource.createWorkoutDayExercise(workoutDayExercise)
  }

  updateWorkoutDayExercise(id: string, workoutDayExercise: WorkoutDayExerciseDto): Promise<WorkoutDayExercise> {
    return this.datasource.updateWorkoutDayExercise(id, workoutDayExercise)
  }

  deleteWorkoutDayExercise(id: string): Promise<void> {
    return this.datasource.deleteWorkoutDayExercise(id)
  }
}
