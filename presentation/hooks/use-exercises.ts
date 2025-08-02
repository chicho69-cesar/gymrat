import { useEffect, useState } from 'react'

import { Exercise } from 'domain/entities/exercise.entity'
import { ExercisesUseCases } from 'domain/use-cases/exercises.use-cases'
import { ExerciseDataSourceImpl } from 'infrastructure/datasources/exercise.datasource.impl'
import { ExerciseRepositoryImpl } from 'infrastructure/repositories/exercise.repository.impl'
import { useDatabase } from './use-database'

export default function useExercises() {
  const { db } = useDatabase()
  const exerciseDataSource = new ExerciseDataSourceImpl(db)
  const exerciseRepository = new ExerciseRepositoryImpl(exerciseDataSource)

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [topExercises, setTopExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      ] = await Promise.all([
        ExercisesUseCases.getAllExercises(exerciseRepository),
        ExercisesUseCases.getTopExercises(exerciseRepository, 5),
      ])

      setExercises(fetchedExercises)
      setTopExercises(fetchedTopExercises)
    } catch (error) {
      console.error('Failed to fetch exercises:', error)
      setError('Failed to fetch exercises')
    } finally {
      setLoading(false)
    }
  }

  return {
    exercises,
    topExercises,
    loading,
    error,

    refresh: fetchExercises,
  }
}
