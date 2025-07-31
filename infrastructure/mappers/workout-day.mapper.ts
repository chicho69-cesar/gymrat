import { WorkoutDayDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDay } from 'domain/entities/workout-day.entity'

export class WorkoutDayMapper {
  static toEntity(workoutDayDto: WorkoutDayDto, id?: string): WorkoutDay {
    return {
      id: id || '',
      name: workoutDayDto.name,
      description: workoutDayDto.description || '',
    }
  }

  static toDto(workoutDay: WorkoutDay): WorkoutDayDto {
    return {
      name: workoutDay.name,
      description: workoutDay.description,
    }
  }
}
