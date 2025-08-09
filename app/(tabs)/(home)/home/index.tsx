import { useEffect } from 'react'
import { Alert } from 'react-native'

import RoutinesList from 'presentation/components/routines/routines-list'
import Container from 'presentation/components/ui/container'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import useRoutines from 'presentation/hooks/use-routines'

export default function HomeScreen() {
  const { routines, loading, error } = useRoutines()

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK' }])
    }
  }, [error])

  return (
    <Container>
      <Title text='Rutinas' />

      {loading ? (
        <FullScreenLoader />
      ) : routines.length > 0 ? (
        <RoutinesList
          routines={routines}
        />
      ) : (
        <EmptyMessage
          title='No hay rutinas disponibles'
          description='Crea una rutina para comenzar a entrenar'
        />
      )}
    </Container>
  )
}
