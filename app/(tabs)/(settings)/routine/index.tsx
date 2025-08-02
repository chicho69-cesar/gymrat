import { StyleSheet } from 'react-native'
import { Text } from 'tamagui'

import RoutinesList from 'presentation/components/routines/routines-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import useRoutines from 'presentation/hooks/use-routines'

export default function RoutineSettingsScreen() {
  const { loading, routines, refresh } = useRoutines()

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
        />
      ) : (
        <Text style={styles.emptyMessage}>
          No hay rutinas creadas.
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
