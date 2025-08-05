import { useEffect } from 'react'

import { RoutineDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout } from 'domain/entities/routine.entity'
import { RoutineUseCases } from 'domain/use-cases/routine.use-cases'
import { RoutineDataSourceImpl } from 'infrastructure/datasources/routine.datasource.impl'
import { RoutineRepositoryImpl } from 'infrastructure/repositories/routine.repository.impl'
import { useRoutineStore } from 'presentation/store/routine.store'
import { useDatabase } from './use-database'

export default function useRoutines() {
  const { db } = useDatabase()
  const routineDatasource = new RoutineDataSourceImpl(db)
  const routineRepository = new RoutineRepositoryImpl(routineDatasource)

  const routines = useRoutineStore((state) => state.routines)
  const lastRoutines = useRoutineStore((state) => state.lastRoutines)
  const routineCircuits = useRoutineStore((state) => state.routineCircuits)
  const loading = useRoutineStore((state) => state.isLoading)
  const error = useRoutineStore((state) => state.error)
  const setRoutines = useRoutineStore((state) => state.setRoutines)
  const setLastRoutines = useRoutineStore((state) => state.setLastRoutines)
  const setRoutineCircuits = useRoutineStore((state) => state.setRoutineCircuits)
  const setLoading = useRoutineStore((state) => state.setIsLoading)
  const setError = useRoutineStore((state) => state.setError)

  useEffect(() => {
    fetchRoutines()
  }, [])

  const fetchRoutines = async () => {
    setLoading(true)
    setError(null)

    try {
      const [
        fetchedRoutines,
        fetchedLastRoutines,
      ] = await Promise.all([
        RoutineUseCases.getAll(routineRepository),
        RoutineUseCases.getLast(routineRepository, 5),
      ])

      setRoutines(fetchedRoutines)
      setLastRoutines(fetchedLastRoutines)
    } catch (error) {
      console.error('Error fetching routines:', error)
      setError('Failed to fetch routines')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoutineCircuits = async (routineId: string) => {
    setLoading(true)
    setError(null)

    try {
      const circuits = await RoutineUseCases.getCircuit(routineRepository, routineId)
      setRoutineCircuits(circuits)
    } catch (error) {
      console.error('Failed to fetch routine circuit:', error)
      setError('Failed to fetch routine circuit')
    } finally {
      setLoading(false)
    }
  }

  const createUpdateRoutine = async (
    routine: RoutineDto,
    circuits: CircuitWorkout[],
    id: string
  ) => {
    setLoading(true)
    setError(null)

    try {
      if (id === 'new') {
        await RoutineUseCases.create(routineRepository, routine, circuits)
      } else {
        await RoutineUseCases.update(routineRepository, id, routine, circuits)
      }

      await fetchRoutines()
      setRoutineCircuits([])
    } catch (error) {
      console.error('Failed to create/update routine:', error)
      setError('Failed to create/update routine')
    } finally {
      setLoading(false)
    }
  }

  const deleteRoutine = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await RoutineUseCases.delete(routineRepository, id)
      await fetchRoutines()
    } catch (error) {
      console.error('Failed to delete routine:', error)
      setError(error.message || 'Error al eliminar la rutina')
    } finally {
      setLoading(false)
    }
  }

  return {
    routines,
    lastRoutines,
    routineCircuits,
    loading,
    error,

    refresh: fetchRoutines,
    fetchRoutineCircuits,
    createUpdateRoutine,
    deleteRoutine,
  }
}
