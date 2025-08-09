import { WorkoutUseCases } from 'domain/use-cases/workout.use-cases'
import { WorkoutDataSourceImpl } from 'infrastructure/datasources/workout.datasource.impl'
import { WorkoutRepositoryImpl } from 'infrastructure/repositories/workout.repository.impl'
import { useWorkoutStore } from 'presentation/store/workouts.store'
import { useEffect } from 'react'
import { useDatabase } from './use-database'

export default function useWorkout(id: string) {
  const { db } = useDatabase()
  const workoutDatasource = new WorkoutDataSourceImpl(db)
  const workoutRepository = new WorkoutRepositoryImpl(workoutDatasource)

  const activeWorkout = useWorkoutStore((state) => state.activeWorkout)
  const loading = useWorkoutStore((state) => state.isLoading)
  const error = useWorkoutStore((state) => state.error)
  const setActiveWorkout = useWorkoutStore((state) => state.setActiveWorkout)
  const setLoading = useWorkoutStore((state) => state.setIsLoading)
  const setError = useWorkoutStore((state) => state.setError)

  useEffect(() => {
    if (id) {
      loadWorkout()
    } else {
      setActiveWorkout(null)
    }
  }, [id])

  const loadWorkout = async () => {
    setLoading(true)
    setError(null)

    try {
      const workout = await WorkoutUseCases.getById(workoutRepository, id)
      setActiveWorkout(workout)
    } catch (err) {
      console.error('Error loading workout:', err)
      setError('Error al cargar el entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  return {
    activeWorkout,
    loading,
    error,
  }
}
