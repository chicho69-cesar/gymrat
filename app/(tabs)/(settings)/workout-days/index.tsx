import { StyleSheet } from 'react-native'
import { Text } from 'tamagui'

import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutDaysList from 'presentation/components/workout-days/workout-days-list'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

export default function WorkoutDaysScreen() {
  const { loading, refresh, workoutDays } = useWorkoutDays()

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
        />
      ) : (
        <Text style={styles.emptyMessage}>
          No hay días de entrenamiento creados.
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
