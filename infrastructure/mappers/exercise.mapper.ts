import { ExerciseDto } from 'domain/dtos/exercise.dto'
import { Exercise } from 'domain/entities/exercise.entity'

export class ExerciseMapper {
  static toEntity(exerciseDto: ExerciseDto, id?: string): Exercise {
    return {
      id: id || '',
      name: exerciseDto.name,
      description: exerciseDto.description || '',
      rest: exerciseDto.rest
    }
  }

  static toDto(exercise: Exercise): ExerciseDto {
    return {
      name: exercise.name,
      description: exercise.description,
      rest: exercise.rest
    }
  }
}
