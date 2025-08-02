import { useEffect, useState } from 'react'

import { Routine } from 'domain/entities/routine.entity'
import { RoutineUseCases } from 'domain/use-cases/routine.use-cases'
import { RoutineDataSourceImpl } from 'infrastructure/datasources/routine.datasource.impl'
import { RoutineRepositoryImpl } from 'infrastructure/repositories/routine.repository.impl'
import { useDatabase } from './use-database'

export default function useRoutines() {
  const { db } = useDatabase()
  const routineDatasource = new RoutineDataSourceImpl(db)
  const routineRepository = new RoutineRepositoryImpl(routineDatasource)

  const [routines, setRoutines] = useState<Routine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRoutines()
  }, [])

  const fetchRoutines = async () => {
    setLoading(true)
    setError(null)

    try {
      const fetchedRoutines = await RoutineUseCases.getAllRoutines(routineRepository)
      setRoutines(fetchedRoutines)
    } catch (error) {
      console.error('Error fetching routines:', error)
      setError('Failed to fetch routines')
    } finally {
      setLoading(false)
    }
  }

  return {
    routines,
    loading,
    error,

    refresh: fetchRoutines,
  }
}
