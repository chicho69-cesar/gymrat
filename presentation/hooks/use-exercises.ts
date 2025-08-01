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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true)
      setError(null)

      try {
        const fetchedExercises = await ExercisesUseCases.getAllExercises(exerciseRepository)
        console.log('Fetched exercises:', fetchedExercises)
        setExercises(fetchedExercises)
      } catch (error) {
        console.error('Failed to fetch exercises:', error)
        setError('Failed to fetch exercises')
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  return {
    exercises,
    loading,
    error
  }
}
