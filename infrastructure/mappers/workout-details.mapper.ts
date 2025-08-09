import { WorkoutDetails, WorkoutExerciseWithDetails } from '../../domain/entities/workout.entity'

export class WorkoutDetailsMapper {
  static fromWorkoutDetails(workoutDetails: WorkoutDetails[]): WorkoutExerciseWithDetails[] {
    const grouped: Record<string, WorkoutExerciseWithDetails> = {}

    for (const row of workoutDetails) {
      if (!grouped[row.workoutExerciseId]) {
        grouped[row.workoutExerciseId] = {
          id: row.workoutExerciseId,
          workoutId: row.workoutId,
          workoutDayExerciseId: row.workoutDayExerciseId,
          exercise: {
            id: row.exerciseId,
            name: row.exerciseName,
            description: row.exerciseDescription,
            rest: row.exerciseRest
          },
          workoutDayExercise: {
            id: row.workoutDayExerciseId,
            workoutDayId: row.workoutDayId,
            exerciseId: row.exerciseId,
            sets: row.plannedSets,
            heatingSets: row.heatingSets
          },
          sets: []
        }
      }

      if (row.setId) {
        grouped[row.workoutExerciseId].sets.push({
          id: row.setId,
          workoutExerciseId: row.workoutExerciseId,
          weight: row.weight!,
          reps: row.reps!,
          unit: row.unit!,
          setNumber: row.setNumber!
        })
      }
    }

    return Object.values(grouped)
  }
}
