import { CircuitWorkoutDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout } from 'domain/entities/routine.entity'
import { SelectedWorkoutDay } from 'infrastructure/interfaces/selected-workout-day.interface'

export class SelectedWorkoutDayMapper {
  static toDto(selectedWorkoutDay: SelectedWorkoutDay): CircuitWorkoutDto {
    return {
      routineId: selectedWorkoutDay.id,
      workoutDayId: selectedWorkoutDay.workoutDayId,
      orderNumber: selectedWorkoutDay.orderNumber,
    }
  }

  static fromDto(dto: CircuitWorkoutDto, id: string, workoutDayName: string): SelectedWorkoutDay {
    return {
      id,
      routineId: dto.routineId,
      workoutDayId: dto.workoutDayId,
      orderNumber: dto.orderNumber,
      workoutDayName
    }
  }

  static toEntity(selectedWorkoutDay: SelectedWorkoutDay): CircuitWorkout {
    return {
      id: selectedWorkoutDay.id,
      routineId: selectedWorkoutDay.routineId,
      workoutDayId: selectedWorkoutDay.workoutDayId,
      orderNumber: selectedWorkoutDay.orderNumber,
    }
  }

  static fromEntity(entity: CircuitWorkout, circuitName: string): SelectedWorkoutDay {
    return {
      id: entity.id,
      orderNumber: entity.orderNumber,
      workoutDayId: entity.workoutDayId,
      routineId: entity.routineId,
      workoutDayName: circuitName,
    }
  }
}