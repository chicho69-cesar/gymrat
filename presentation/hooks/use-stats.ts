import { WorkoutStats } from 'domain/entities/workout.entity'
import { StatsUseCases } from 'domain/use-cases/stats.use-cases'
import { WorkoutDataSourceImpl } from 'infrastructure/datasources/workout.datasource.impl'
import { WorkoutRepositoryImpl } from 'infrastructure/repositories/workout.repository.impl'
import { useEffect, useState } from 'react'
import { useDatabase } from './use-database'

export default function useStats(id: string) {
  const { db } = useDatabase()
  const workoutDatasource = new WorkoutDataSourceImpl(db)
  const workoutRepository = new WorkoutRepositoryImpl(workoutDatasource)

  const [stats, setStats] = useState<WorkoutStats[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats(id)
  }, [id])

  const fetchStats = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const fetchedStats = await StatsUseCases.getWorkoutStats(workoutRepository, id)
      setStats(fetchedStats)
    } catch (error) {
      console.error('Failed to fetch workout stats:', error)
      setError('Error al cargar las estadísticas del ejercicio.')
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
    error,
  }
}
