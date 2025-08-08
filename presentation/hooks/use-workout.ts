import { WorkoutStats } from 'domain/entities/workout.entity'
import { StatsUseCases } from 'domain/use-cases/stats.use-cases'
import { WorkoutDataSourceImpl } from 'infrastructure/datasources/workout.datasource.impl'
import { WorkoutRepositoryImpl } from 'infrastructure/repositories/workout.repository.impl'
import { useEffect, useState } from 'react'
import { useDatabase } from './use-database'

export default function useWorkout(id: string) {
  const { db } = useDatabase()
  const workoutDatasource = new WorkoutDataSourceImpl(db)
  const workoutRepository = new WorkoutRepositoryImpl(workoutDatasource)

  const [stats, setStats] = useState<WorkoutStats[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStats(id)
  }, [id])

  const fetchStats = async (id: string) => {
    setLoading(true)

    try {
      const fetchedStats = await StatsUseCases.getWorkoutStats(workoutRepository, id)
      // setStats(fetchedStats)

      const exampleStats: WorkoutStats[] = [
        { date: '01-07-2025', weight: 70, reps: 10, unit: 'Kg', volume: 700, workoutId: 'w1' },
        { date: '05-07-2025', weight: 72.5, reps: 10, unit: 'Kg', volume: 725, workoutId: 'w2' },
        { date: '08-07-2025', weight: 75, reps: 9, unit: 'Kg', volume: 675, workoutId: 'w3' },
        { date: '12-07-2025', weight: 75, reps: 10, unit: 'Kg', volume: 750, workoutId: 'w4' },
        { date: '15-07-2025', weight: 77.5, reps: 10, unit: 'Kg', volume: 775, workoutId: 'w5' },
        { date: '19-07-2025', weight: 80, reps: 8, unit: 'Kg', volume: 640, workoutId: 'w6' },
        { date: '22-07-2025', weight: 80, reps: 10, unit: 'Kg', volume: 800, workoutId: 'w7' },
        { date: '26-07-2025', weight: 82.5, reps: 10, unit: 'Kg', volume: 825, workoutId: 'w8' },
      ]

      const sortedStats = exampleStats.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'))
        const dateB = new Date(b.date.split('-').reverse().join('-'))
        return dateA.getTime() - dateB.getTime()
      })

      setStats(sortedStats)
    } catch (error) {
      console.error('Failed to fetch workout stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    stats,
    loading,
  }
}
