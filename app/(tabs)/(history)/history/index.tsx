import { useEffect, useState } from 'react'

import { Exercise } from 'domain/entities/exercise.entity'
import ExerciseHistoryHeader from 'presentation/components/stats/exercise-history-header'
import ExercisesHistoryList from 'presentation/components/stats/exercises-history-list'
import Container from 'presentation/components/ui/container'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'

export default function HistoryScreen() {
  const { topExercises, loading, refresh } = useExercises()
  const [usedExercises, setUsedExercises] = useState<Exercise[]>([])

  useEffect(() => {
    // Filtrar solo ejercicios que han sido usados (los que aparecen en topExercises)
    // Si topExercises está ordenado por uso, entonces todos han sido usados
    setUsedExercises(topExercises)
  }, [topExercises])

  if (loading && usedExercises.length === 0) {
    return (
      <FullScreenLoader />
    )
  }

  return (
    <Container>
      <Title text='Historial de ejercicios' />

      {usedExercises.length > 0 ? (
        <ExercisesHistoryList
          usedExercises={usedExercises}
          onRefresh={() => {
            refresh()
          }}
        />
      ) : (
        <>
          <ExerciseHistoryHeader exercisesCount={0} />

          <EmptyMessage
            title='No hay ejercicios en tu historial'
            description='Completa tu primer entrenamiento para ver las estadísticas de tus ejercicios'
          />
        </>
      )}
    </Container>
  )
}
