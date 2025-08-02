import { StyleSheet } from 'react-native'
import { Text } from 'tamagui'

import ExerciseList from 'presentation/components/exercises/exercise-list'
import RoutinesList from 'presentation/components/routines/routines-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'
import useRoutines from 'presentation/hooks/use-routines'

export default function SettingsScreen() {
  const { topExercises } = useExercises()
  const { lastRoutines } = useRoutines()

  return (
    <Container>
      <>
        <Title text='Rutinas' />

        <CustomLink
          href='/routine'
          link='Ver todas las rutinas'
          iconName='arrow-forward-circle-outline'
          iconSize={20}
          iconPosition='right'
        />

        {lastRoutines.length > 0 ? (
          <RoutinesList routines={lastRoutines} />
        ) : (
          <Text style={styles.emptyMessage}>
            No hay rutinas hechas recientemente.
          </Text>
        )}
      </>

      <>
        <Title text='Ejercicios' />

        <CustomLink
          href='/exercises'
          link='Ver todos los ejercicios'
          iconName='arrow-forward-circle-outline'
          iconSize={20}
          iconPosition='right'
        />

        {topExercises.length > 0 ? (
          <ExerciseList exercises={topExercises} />
        ) : (
          <Text style={styles.emptyMessage}>
            No hay ejercicios registrados.
          </Text>
        )}
      </>

      <>
        <Title text='Días de entrenamiento' />

        <CustomLink
          href='/workout-days'
          link='Ver todos los días de entrenamiento'
          iconName='arrow-forward-circle-outline'
          iconSize={20}
          iconPosition='right'
        />

        {/* {exercises.length > 0 ? (
          <ExerciseList exercises={exercises} />
        ) : (
          <Text style={styles.emptyMessage}>
            No hay días de entrenamiento creados.
          </Text>
        )} */}
      </>
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
