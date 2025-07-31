import { CircuitWorkoutDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout } from 'domain/entities/routine.entity'

export class CircuitWorkoutMapper {
  static toEntity(circuitWorkoutDto: CircuitWorkoutDto, id?: string): CircuitWorkout {
    return {
      id: id || '',
      routineId: circuitWorkoutDto.routineId,
      workoutDayId: circuitWorkoutDto.workoutDayId,
      orderNumber: circuitWorkoutDto.orderNumber,
    }
  }

  static toDto(circuitWorkout: CircuitWorkout): CircuitWorkoutDto {
    return {
      routineId: circuitWorkout.routineId,
      workoutDayId: circuitWorkout.workoutDayId,
      orderNumber: circuitWorkout.orderNumber,
    }
  }
}