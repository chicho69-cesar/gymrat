import { useEffect } from 'react'

import { WorkoutDto } from 'domain/dtos/workout.dto'
import { WorkoutUseCases } from 'domain/use-cases/workout.use-cases'
import { WorkoutDataSourceImpl } from 'infrastructure/datasources/workout.datasource.impl'
import { WorkoutRepositoryImpl } from 'infrastructure/repositories/workout.repository.impl'
import { useWorkoutStore } from 'presentation/store/workouts.store'
import { useDatabase } from './use-database'

export default function useWorkouts() {
  const { db } = useDatabase()
  const workoutDataSource = new WorkoutDataSourceImpl(db)
  const workoutRepository = new WorkoutRepositoryImpl(workoutDataSource)

  const workouts = useWorkoutStore((state) => state.workouts)
  const loading = useWorkoutStore((state) => state.isLoading)
  const error = useWorkoutStore((state) => state.error)
  const setWorkouts = useWorkoutStore((state) => state.setWorkouts)
  const setLoading = useWorkoutStore((state) => state.setIsLoading)
  const setError = useWorkoutStore((state) => state.setError)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    setLoading(true)
    setError(null)

    try {
      const fetchedWorkouts = await WorkoutUseCases.getAll(workoutRepository)
      setWorkouts(fetchedWorkouts)
    } catch (error) {
      console.error('Failed to fetch workouts:', error)
      setError('Failed to fetch workouts')
    } finally {
      setLoading(false)
    }
  }

  const createUpdateWorkout = async (workoutDto: WorkoutDto, id: string) => {
    setLoading(true)
    setError(null)

    try {
      if (id === 'new') {
        await WorkoutUseCases.create(workoutRepository, workoutDto)
      } else {
        await WorkoutUseCases.update(workoutRepository, id, workoutDto)
      }

      await fetchWorkouts()
    } catch (error) {
      console.error('Failed to create/update workout:', error)
      setError('Failed to create/update workout')
    } finally {
      setLoading(false)
    }
  }

  const deleteWorkout = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await WorkoutUseCases.delete(workoutRepository, id)
      await fetchWorkouts()
    } catch (error) {
      console.error('Failed to delete workout:', error)
      setError(error.message || 'Error al eliminar el entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  return {
    workouts,
    loading,
    error,

    refresh: fetchWorkouts,
    createUpdateWorkout,
    deleteWorkout,
  }
}
