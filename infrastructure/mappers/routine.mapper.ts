import { RoutineDto } from "domain/dtos/routine.dto"
import { Routine } from "domain/entities/routine.entity"

export class RoutineMapper {
  static toEntity(routineDto: RoutineDto, id?: string): Routine {
    return {
      id: id || '',
      name: routineDto.name,
      description: routineDto.description || '',
    }
  }

  static toDto(routine: Routine): RoutineDto {
    return {
      name: routine.name,
      description: routine.description,
    }
  }
}
