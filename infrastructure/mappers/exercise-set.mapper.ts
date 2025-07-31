import { ExerciseSetDto } from 'domain/dtos/workout.dto'
import { ExerciseSet } from '../../domain/entities/workout.entity'

export class ExerciseSetMapper {
  static toEntity(exerciseDto: ExerciseSetDto, id?: string): ExerciseSet {
    return {
      id: id || '',
      unit: exerciseDto.unit,
      reps: exerciseDto.reps,
      weight: exerciseDto.weight,
      setNumber: exerciseDto.setNumber,
      workoutExerciseId: exerciseDto.workoutExerciseId,
    }
  }

  static toDto(exercise: ExerciseSet): ExerciseSetDto {
    return {
      unit: exercise.unit,
      reps: exercise.reps,
      weight: exercise.weight,
      setNumber: exercise.setNumber,
      workoutExerciseId: exercise.workoutExerciseId,
    }
  }
}
