import { useEffect } from 'react'

import { ExerciseDto } from 'domain/dtos/exercise.dto'
import { ExercisesUseCases } from 'domain/use-cases/exercises.use-cases'
import { ExerciseDataSourceImpl } from 'infrastructure/datasources/exercise.datasource.impl'
import { WorkoutDayDatasourceImpl } from 'infrastructure/datasources/workout-day.datasource.impl'
import { ExerciseRepositoryImpl } from 'infrastructure/repositories/exercise.repository.impl'
import { WorkoutDayRepositoryImpl } from 'infrastructure/repositories/workout-day.repository.impl'
import { useExercisesStore } from 'presentation/store/exercises.store'
import { useDatabase } from './use-database'

export default function useExercises() {
  const { db } = useDatabase()
  const exerciseDataSource = new ExerciseDataSourceImpl(db)
  const exerciseRepository = new ExerciseRepositoryImpl(exerciseDataSource)
  const workoutDayDatasource = new WorkoutDayDatasourceImpl(db)
  const workoutDayRepository = new WorkoutDayRepositoryImpl(workoutDayDatasource)

  const exercises = useExercisesStore((state) => state.exercises)
  const topExercises = useExercisesStore((state) => state.topExercises)
  const usedExercises = useExercisesStore((state) => state.usedExercises)
  const loading = useExercisesStore((state) => state.isLoading)
  const error = useExercisesStore((state) => state.error)
  const setExercises = useExercisesStore((state) => state.setExercises)
  const setTopExercises = useExercisesStore((state) => state.setTopExercises)
  const setUsedExercises = useExercisesStore((state) => state.setUsedExercises)
  const setLoading = useExercisesStore((state) => state.setIsLoading)
  const setError = useExercisesStore((state) => state.setError)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        fetchedExercises,
        fetchedTopExercises,
        fetchedUsedExercises,
      ] = await Promise.all([
        ExercisesUseCases.getAll(exerciseRepository),
        ExercisesUseCases.getTop(exerciseRepository, 5),
        ExercisesUseCases.getUsed(exerciseRepository),
      ])

      setExercises(fetchedExercises)
      setTopExercises(fetchedTopExercises)
      setUsedExercises(fetchedUsedExercises)
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
      setError('Failed to fetch exercises')
    } finally {
      setLoading(false)
    }
  }

  const createUpdateExercise = async (exerciseDto: ExerciseDto, id: string) => {
    setLoading(true)
    setError(null)

    try {
      if (id === 'new') {
        await ExercisesUseCases.create(exerciseRepository, exerciseDto)
      } else {
        await ExercisesUseCases.update(exerciseRepository, id, exerciseDto)
      }

      await fetchExercises()
    } catch (error) {
      console.error('Failed to create/update exercise:', error)
      setError('Failed to create/update exercise')
    } finally {
      setLoading(false)
    }
  }

  const deleteExercise = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await ExercisesUseCases.delete(exerciseRepository, workoutDayRepository, id)
      await fetchExercises()
    } catch (error) {
      console.error('Failed to delete exercise:', error)
      setError(error.message || 'Error al eliminar el ejercicio')
    } finally {
      setLoading(false)
    }
  }

  return {
    exercises,
    topExercises,
    usedExercises,
    loading,
    error,

    refresh: fetchExercises,
    createUpdateExercise,
    deleteExercise,
  }
}
