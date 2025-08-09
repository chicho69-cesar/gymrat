import { ExerciseSetDto, WorkoutDto, WorkoutExerciseDto } from 'domain/dtos/workout.dto'
import { WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { ExerciseSet, Workout, WorkoutExercise } from 'domain/entities/workout.entity'
import { WorkoutRepository } from 'domain/repositories/workout.repository'

export class WorkoutUseCases {
  static async getById(repository: WorkoutRepository, id: string): Promise<Workout | null> {
    return repository.getWorkoutById(id)
  }

  static async getAll(repository: WorkoutRepository): Promise<Workout[]> {
    return repository.getAllWorkout()
  }

  static async getByRoutineId(repository: WorkoutRepository, routineId: string): Promise<Workout[]> {
    return repository.getWorkoutByRoutineId(routineId)
  }

  static async create(
    repository: WorkoutRepository,
    workout: WorkoutDto,
    workoutDayExercises: WorkoutDayExercise[]
  ): Promise<Workout> {
    const createdWorkout = await repository.createWorkout(workout)
    console.log('Created workout:', createdWorkout)

    const workoutExercisesPromises = workoutDayExercises.map((exercise) => {
      return repository.createWorkoutExercise({
        workoutId: createdWorkout.id,
        workoutDayExerciseId: exercise.id,
      })
    })

    if (workoutExercisesPromises.length > 0) {
      const createdWorkoutExercises = await Promise.all(workoutExercisesPromises)
      console.log('Created workout exercises:', createdWorkoutExercises)

      const exerciseSetPromises = createdWorkoutExercises.map((exercise) => {
        const workoutDayExercise = workoutDayExercises.find((ex) => ex.id === exercise.workoutDayExerciseId)
        const numberOfSets = (workoutDayExercise?.sets || 0) + (workoutDayExercise?.heatingSets || 0)

        return Array.from({ length: numberOfSets }, (_, index) => {
          return repository.createExerciseSet({
            workoutExerciseId: exercise.id,
            weight: 0,
            reps: 0,
            unit: 'Kg',
            setNumber: index + 1,
          })
        })
      })

      if (exerciseSetPromises.length > 0) {
        const sets = await Promise.all(exerciseSetPromises.flat())
        console.log('Created exercise sets:', sets)
      }
    }

    return createdWorkout
  }

  static async update(repository: WorkoutRepository, id: string, workout: WorkoutDto): Promise<Workout> {
    return repository.updateWorkout(id, workout)
  }

  static async delete(repository: WorkoutRepository, id: string): Promise<void> {
    return repository.deleteWorkout(id)
  }

  static async getExercises(repository: WorkoutRepository, workoutId: string): Promise<WorkoutExercise[]> {
    return repository.getWorkoutExercises(workoutId)
  }

  static async createExercise(repository: WorkoutRepository, workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    return repository.createWorkoutExercise(workoutExercise)
  }

  static async updateExercise(repository: WorkoutRepository, id: string, workoutExercise: WorkoutExerciseDto): Promise<WorkoutExercise> {
    return repository.updateWorkoutExercise(id, workoutExercise)
  }

  static async deleteExercise(repository: WorkoutRepository, id: string): Promise<void> {
    return repository.deleteWorkoutExercise(id)
  }

  static async getSets(repository: WorkoutRepository, workoutId: string): Promise<ExerciseSet[]> {
    return repository.getExercisesSets(workoutId)
  }

  static async createSet(repository: WorkoutRepository, exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    return repository.createExerciseSet(exerciseSet)
  }

  static async updateSet(repository: WorkoutRepository, id: string, exerciseSet: ExerciseSetDto): Promise<ExerciseSet> {
    return repository.updateExerciseSet(id, exerciseSet)
  }

  static async deleteSet(repository: WorkoutRepository, id: string): Promise<void> {
    return repository.deleteExerciseSet(id)
  }
}