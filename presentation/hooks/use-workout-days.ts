import { useEffect, useState } from 'react'

import { WorkoutDay } from 'domain/entities/workout-day.entity'
import { WorkoutDayUseCases } from 'domain/use-cases/workout-day.use-cases'
import { WorkoutDayDatasourceImpl } from 'infrastructure/datasources/workout-day.datasource.impl'
import { WorkoutDayRepositoryImpl } from 'infrastructure/repositories/workout-day.repositoy.impl'
import { useDatabase } from './use-database'

export default function useWorkoutDays() {
  const { db } = useDatabase()
  const workoutDaysDataSource = new WorkoutDayDatasourceImpl(db)
  const workoutDaysRepository = new WorkoutDayRepositoryImpl(workoutDaysDataSource)

  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [mostFrequents, setMostFrequents] = useState<WorkoutDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return {
    workoutDays,
    mostFrequents,
    loading,
    error,

    refresh: fetchWorkoutDays,
  }
}
