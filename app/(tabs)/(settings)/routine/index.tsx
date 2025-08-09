import { useEffect } from 'react'
import { Alert } from 'react-native'

import RoutinesList from 'presentation/components/routines/routines-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import useRoutines from 'presentation/hooks/use-routines'

export default function RoutineSettingsScreen() {
  const { loading, routines, error, refresh, deleteRoutine } = useRoutines()

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK' }])
    }
  }, [error])

  const handleDelete = (routineId: string) => {
    Alert.alert(
      'Confirm Delete',
      '¿Estas seguro de eliminar esta rutina?',
      [
        {
          text: 'Canelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteRoutine(routineId)
            refresh()
          },
        },
      ]
    )
  }

  return (
    <Container>
      <Title text='Rutinas' />

      <CustomLink
        href='/routine/new'
        link='Nuevo rutina'
        iconName='add-circle-outline'
        iconSize={16}
      />

      {loading ? (
        <FullScreenLoader />
      ) : routines.length > 0 ? (
        <RoutinesList
          routines={routines}
          onRefresh={() => {
            refresh()
          }}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyMessage
          title='No hay rutinas creadas'
          description='Crea una rutina para comenzar a organizar tus entrenamientos.'
        />
      )}
    </Container>
  )
}
