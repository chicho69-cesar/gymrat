import { WorkoutDayExerciseDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDayExercise } from 'domain/entities/workout-day.entity'

export class WorkoutDayExerciseMapper {
  static toEntity(workoutDayDto: WorkoutDayExerciseDto, id?: string): WorkoutDayExercise {
    return {
      id: id || '',
      sets: workoutDayDto.sets,
      heatingSets: workoutDayDto.heatingSets,
      workoutDayId: workoutDayDto.workoutDayId,
      exerciseId: workoutDayDto.exerciseId,
    }
  }

  static toDto(workoutDay: WorkoutDayExercise): WorkoutDayExerciseDto {
    return {
      sets: workoutDay.sets,
      heatingSets: workoutDay.heatingSets,
      workoutDayId: workoutDay.workoutDayId,
      exerciseId: workoutDay.exerciseId,
    }
  }
}
