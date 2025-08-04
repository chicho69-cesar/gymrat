import { useEffect } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { Text } from 'tamagui'

import ExerciseList from 'presentation/components/exercises/exercise-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
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
        <Text style={styles.emptyMessage}>
          No hay ejercicios creados.
        </Text>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  emptyMessage: {
    color: '#cbcbcb',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  }
})
