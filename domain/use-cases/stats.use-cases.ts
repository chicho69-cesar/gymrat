import { WorkoutStats } from 'domain/entities/workout.entity'
import { WorkoutRepository } from 'domain/repositories/workout.repository'

export class StatsUseCases {
  static async getWorkoutStats(workoutRepository: WorkoutRepository, exerciseId: string): Promise<WorkoutStats[]> {
    return workoutRepository.getWorkoutStats(exerciseId)
  }
}
