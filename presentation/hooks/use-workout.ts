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
  const workoutDetails = useWorkoutStore((state) => state.workoutDetails)
  const loading = useWorkoutStore((state) => state.isLoading)
  const error = useWorkoutStore((state) => state.error)
  const setActiveWorkout = useWorkoutStore((state) => state.setActiveWorkout)
  const setWorkoutDetails = useWorkoutStore((state) => state.setWorkoutDetails)
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
      const [
        fetchedWorkout,
        fetchedDetails,
      ] = await Promise.all([
        WorkoutUseCases.getById(workoutRepository, id),
        WorkoutUseCases.getDetails(workoutRepository, id),
      ])
      
      setActiveWorkout(fetchedWorkout)
      setWorkoutDetails(fetchedDetails)
    } catch (err) {
      console.error('Error loading workout:', err)
      setError('Error al cargar el entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  return {
    activeWorkout,
    workoutDetails,
    loading,
    error,
  }
}
