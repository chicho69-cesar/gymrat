import { useEffect } from 'react'

import { WorkoutDayDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { WorkoutDayUseCases } from 'domain/use-cases/workout-day.use-cases'
import { WorkoutDayDatasourceImpl } from 'infrastructure/datasources/workout-day.datasource.impl'
import { WorkoutDayRepositoryImpl } from 'infrastructure/repositories/workout-day.repository.impl'
import { useWorkoutDaysStore } from 'presentation/store/workout-days.store'
import { useDatabase } from './use-database'

export default function useWorkoutDays() {
  const { db } = useDatabase()
  const workoutDaysDataSource = new WorkoutDayDatasourceImpl(db)
  const workoutDaysRepository = new WorkoutDayRepositoryImpl(workoutDaysDataSource)

  const workoutDays = useWorkoutDaysStore((state) => state.workoutDays)
  const mostFrequents = useWorkoutDaysStore((state) => state.mostFrequents)
  const workoutDayExercises = useWorkoutDaysStore((state) => state.workoutDayExercises)
  const loading = useWorkoutDaysStore((state) => state.isLoading)
  const error = useWorkoutDaysStore((state) => state.error)
  const setWorkoutDays = useWorkoutDaysStore((state) => state.setWorkoutDays)
  const setMostFrequents = useWorkoutDaysStore((state) => state.setMostFrequents)
  const setWorkoutDayExercises = useWorkoutDaysStore((state) => state.setWorkoutDayExercises)
  const setLoading = useWorkoutDaysStore((state) => state.setIsLoading)
  const setError = useWorkoutDaysStore((state) => state.setError)

  useEffect(() => {
    fetchWorkoutDays()
  }, [])

  const fetchWorkoutDays = async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        fetchedWorkoutDays,
        fetchedMostFrequents,
      ] = await Promise.all([
        WorkoutDayUseCases.getAll(workoutDaysRepository),
        WorkoutDayUseCases.getMostFrequents(workoutDaysRepository, 5),
      ])

      setWorkoutDays(fetchedWorkoutDays)
      setMostFrequents(fetchedMostFrequents)
    } catch (error) {
      console.error('Failed to fetch workout days:', error)
      setError('Failed to fetch workout days')
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkoutDayExercises = async (workoutDayId: string) => {
    setLoading(true)
    setError(null)

    try {
      const exercises = await WorkoutDayUseCases.getExercises(workoutDaysRepository, workoutDayId)
      setWorkoutDayExercises(exercises)
    } catch (error) {
      console.error('Failed to fetch workout day exercises:', error)
      setError('Failed to fetch workout day exercises')
    } finally {
      setLoading(false)
    }
  }

  const createUpdateWorkoutDay = async (
    workoutDay: WorkoutDayDto,
    exercises: WorkoutDayExercise[],
    id: string
  ) => {
    setLoading(true)
    setError(null)

    try {
      if (id === 'new') {
        await WorkoutDayUseCases.create(workoutDaysRepository, workoutDay, exercises)
      } else {
        await WorkoutDayUseCases.update(workoutDaysRepository, id, workoutDay, exercises)
      }

      await fetchWorkoutDays()
      setWorkoutDayExercises([])
    } catch (error) {
      console.error('Failed to create/update workout day:', error)
      setError('Failed to create/update workout day')
    } finally {
      setLoading(false)
    }
  }

  const deleteWorkoutDay = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await WorkoutDayUseCases.delete(workoutDaysRepository, id)
      await fetchWorkoutDays()
    } catch (error) {
      console.error('Failed to delete workout day:', error)
      setError(error.message || 'Error al eliminar el día de entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  return {
    workoutDays,
    mostFrequents,
    workoutDayExercises,
    loading,
    error,

    refresh: fetchWorkoutDays,
    fetchWorkoutDayExercises,
    createUpdateWorkoutDay,
    deleteWorkoutDay,
  }
}
