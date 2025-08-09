import { ExerciseSetDto, WorkoutDto, WorkoutExerciseDto } from 'domain/dtos/workout.dto'
import { WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { ExerciseSet, Workout, WorkoutExercise, WorkoutExerciseWithDetails } from 'domain/entities/workout.entity'
import { WorkoutRepository } from 'domain/repositories/workout.repository'
import { WorkoutDetailsMapper } from 'infrastructure/mappers/workout-details.mapper'

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
    workoutDayExercises: WorkoutDayExercise[] = []
  ): Promise<Workout> {
    const createdWorkout = await repository.createWorkout(workout)

    const workoutExercisesPromises = workoutDayExercises.map((exercise) => {
      return repository.createWorkoutExercise({
        workoutId: createdWorkout.id,
        workoutDayExerciseId: exercise.id,
      })
    })

    if (workoutExercisesPromises.length > 0) {
      const createdWorkoutExercises = await Promise.all(workoutExercisesPromises)

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
        await Promise.all(exerciseSetPromises.flat())
      }
    }

    return createdWorkout
  }

  static async update(
    repository: WorkoutRepository,
    id: string,
    workout: WorkoutDto,
    workoutDayExercises: WorkoutDayExercise[] = []
  ): Promise<Workout> {
    const updatedWorkout = await repository.updateWorkout(id, workout)

    const existingWorkoutExercises = await repository.getWorkoutExercises(id)
    const existingWorkoutExerciseIds = new Set(existingWorkoutExercises.map((we) => we.id))

    const updatedWorkoutExercises = workoutDayExercises.filter((we) => we.id !== 'new' && existingWorkoutExerciseIds.has(we.id))
    const workoutExercisesToDelete = existingWorkoutExercises.filter((we) => !updatedWorkoutExercises.some((uwe) => uwe.id === we.id))

    if (workoutExercisesToDelete.length > 0) {
      await Promise.all(workoutExercisesToDelete.map((we) => repository.deleteWorkoutExercise(we.id)))
    }

    const workoutExercisePromises = updatedWorkoutExercises.map((exercise) => {
      if (exercise.id === 'new') {
        return repository.createWorkoutExercise({
          workoutId: updatedWorkout.id,
          workoutDayExerciseId: exercise.id,
        })
      } else {
        return repository.updateWorkoutExercise(exercise.id, {
          workoutId: updatedWorkout.id,
          workoutDayExerciseId: exercise.id,
        })
      }
    })

    if (workoutExercisePromises.length > 0) {
      const finalWorkoutExercises = await Promise.all(workoutExercisePromises)

      const existingSets = await repository.getExercisesSets(updatedWorkout.id)
      const exerciseSetPromises: Promise<ExerciseSet>[] = []

      for (const exercise of finalWorkoutExercises) {
        const workoutDayExercise = workoutDayExercises.find((ex) => ex.id === exercise.workoutDayExerciseId)
        const numberOfSets = (workoutDayExercise?.sets || 0) + (workoutDayExercise?.heatingSets || 0)

        const setsForExercise = existingSets.filter((set) => set.workoutExerciseId === exercise.id)

        if (setsForExercise.length < numberOfSets) {
          for (let i = setsForExercise.length; i < numberOfSets; i++) {
            exerciseSetPromises.push(
              repository.createExerciseSet({
                workoutExerciseId: exercise.id,
                weight: 0,
                reps: 0,
                unit: 'Kg',
                setNumber: i + 1,
              })
            )
          }
        } else if (setsForExercise.length > numberOfSets) {
          const setsToDelete = setsForExercise.slice(numberOfSets)

          for (const set of setsToDelete) {
            exerciseSetPromises.push(repository.deleteExerciseSet(set.id).then(() => set as any))
          }
        }
      }

      if (exerciseSetPromises.length > 0) {
        await Promise.all(exerciseSetPromises)
      }
    }

    return updatedWorkout
  }

  static async basicUpdate(repository: WorkoutRepository, id: string, workout: WorkoutDto): Promise<Workout> {
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

  static async getDetails(repository: WorkoutRepository, workoutId: string): Promise<WorkoutExerciseWithDetails[]> {
    const details = await repository.getWorkoutExercisesDetails(workoutId)
    return WorkoutDetailsMapper.fromWorkoutDetails(details)
  }
}
