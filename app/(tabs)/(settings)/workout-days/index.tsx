import { Alert } from 'react-native'

import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutDaysList from 'presentation/components/workout-days/workout-days-list'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

export default function WorkoutDaysScreen() {
  const { loading, refresh, workoutDays, deleteWorkoutDay } = useWorkoutDays()

  const handleDelete = (workoutDayId: string) => {
    Alert.alert(
      'Confirm Delete',
      '¿Estas seguro de eliminar este día de entrenamiento?',
      [
        {
          text: 'Canelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteWorkoutDay(workoutDayId)
            refresh()
          },
        },
      ]
    )
  }

  return (
    <Container>
      <Title text='Días de entrenamiento' />

      <CustomLink
        href='/workout-days/new'
        link='Nuevo día de entrenamiento'
        iconName='add-circle-outline'
        iconSize={16}
      />

      {loading ? (
        <FullScreenLoader />
      ) : workoutDays.length > 0 ? (
        <WorkoutDaysList
          workoutDays={workoutDays}
          onRefresh={() => {
            refresh()
          }}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyMessage
          title='No hay días de entrenamiento registrados'
          description='Puedes crear un nuevo día de entrenamiento para comenzar a registrar tus ejercicios.'
        />
      )}
    </Container>
  )
}
