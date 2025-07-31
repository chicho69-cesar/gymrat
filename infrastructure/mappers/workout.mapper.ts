import { WorkoutDto } from 'domain/dtos/workout.dto'
import { Workout } from '../../domain/entities/workout.entity'

export class WorkoutMapper {
  static toEntity(workoutDto: WorkoutDto, id?: string): Workout {
    return {
      id: id || '',
      date: workoutDto.date,
      routineId: workoutDto.routineId,
      workoutDayId: workoutDto.workoutDayId
    }
  }

  static toDto(workout: Workout): WorkoutDto {
    return {
      date: workout.date,
      routineId: workout.routineId,
      workoutDayId: workout.workoutDayId
    }
  }
}
