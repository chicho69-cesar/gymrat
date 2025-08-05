import { StyleSheet } from 'react-native'
import { Text } from 'tamagui'

import RoutinesList from 'presentation/components/routines/routines-list'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import useRoutines from 'presentation/hooks/use-routines'

export default function HomeScreen() {
  const { routines } = useRoutines()

  return (
    <Container>
      <Title text='Rutinas' />

      {routines.length > 0 ? (
        <RoutinesList
          routines={routines}
        />
      ) : (
        <Text style={styles.emptyMessage}>
          No hay rutinas hechas recientemente.
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
