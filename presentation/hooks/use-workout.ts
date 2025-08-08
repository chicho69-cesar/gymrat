import { WorkoutDataSourceImpl } from 'infrastructure/datasources/workout.datasource.impl'
import { WorkoutRepositoryImpl } from 'infrastructure/repositories/workout.repository.impl'
import { useEffect } from 'react'
import { useDatabase } from './use-database'

export default function useWorkout(id: string) {
  const { db } = useDatabase()
  const workoutDatasource = new WorkoutDataSourceImpl(db)
  const workoutRepository = new WorkoutRepositoryImpl(workoutDatasource)

  useEffect(() => {
    // 
  }, [])

  return {}
}
