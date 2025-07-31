import { WorkoutExerciseDto } from 'domain/dtos/workout.dto';
import { WorkoutExercise } from '../../domain/entities/workout.entity';

export class WorkoutExerciseMapper {
  static toEntity(workoutExerciseDto: WorkoutExerciseDto, id?: string): WorkoutExercise {
    return {
      id: id || '',
      workoutId: workoutExerciseDto.workoutId,
      workoutDayExerciseId: workoutExerciseDto.workoutDayExerciseId
    }
  }

  static toDto(workoutExercise: WorkoutExercise): WorkoutExerciseDto {
    return {
      workoutId: workoutExercise.workoutId,
      workoutDayExerciseId: workoutExercise.workoutDayExerciseId
    }
  }
}
