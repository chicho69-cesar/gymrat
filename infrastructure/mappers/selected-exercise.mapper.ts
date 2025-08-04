import { WorkoutDayExerciseDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { SelectedExercise } from 'infrastructure/interfaces/selected-exercise.interface'

export class SelectedExerciseMapper {
  static toDto(selectedExercise: SelectedExercise): WorkoutDayExerciseDto {
    return {
      exerciseId: selectedExercise.exerciseId,
      workoutDayId: selectedExercise.workoutDayId,
      sets: selectedExercise.sets,
      heatingSets: selectedExercise.heatingSets,
    }
  }

  static fromDto(dto: WorkoutDayExerciseDto, id: string, exerciseName: string): SelectedExercise {
    return {
      id,
      exerciseId: dto.exerciseId,
      workoutDayId: dto.workoutDayId,
      exerciseName,
      sets: dto.sets,
      heatingSets: dto.heatingSets,
    }
  }

  static toEntity(selectedExercise: SelectedExercise): WorkoutDayExercise {
    return {
      id: selectedExercise.id,
      exerciseId: selectedExercise.exerciseId,
      workoutDayId: selectedExercise.workoutDayId,
      sets: selectedExercise.sets,
      heatingSets: selectedExercise.heatingSets,
    }
  }

  static fromEntity(entity: WorkoutDayExercise, exerciseName: string): SelectedExercise {
    return {
      id: entity.id,
      exerciseId: entity.exerciseId,
      workoutDayId: entity.workoutDayId,
      exerciseName,
      sets: entity.sets,
      heatingSets: entity.heatingSets,
    }
  }
}