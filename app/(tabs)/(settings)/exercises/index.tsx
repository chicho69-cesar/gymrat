import { useEffect } from 'react'
import { Alert } from 'react-native'

import ExerciseList from 'presentation/components/exercises/exercise-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'

export default function ExercisesScreen() {
  const { loading, exercises, error, refresh, deleteExercise } = useExercises()

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK' }])
    }
  }, [error])

  const handleDelete = async (exerciseId: string) => {
    Alert.alert(
      'Confirm Delete',
      '¿Estas seguro de eliminar este ejercicio?',
      [
        {
          text: 'Canelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteExercise(exerciseId)
            refresh()
          },
        },
      ]
    )
  }

  return (
    <Container>
      <Title text='Ejercicios' />

      <CustomLink
        href='/exercises/new'
        link='Nuevo ejercicio'
        iconName='add-circle-outline'
        iconSize={16}
      />

      {loading ? (
        <FullScreenLoader />
      ) : exercises.length > 0 ? (
        <ExerciseList
          exercises={exercises}
          onRefresh={() => {
            refresh()
          }}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyMessage
          title='No hay ejercicios creados'
          description='Crea tu primer ejercicio para comenzar a registrar tus entrenamientos.'
        />
      )}
    </Container>
  )
}
