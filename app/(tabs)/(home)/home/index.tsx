import RoutinesList from 'presentation/components/routines/routines-list'
import Container from 'presentation/components/ui/container'
import EmptyMessage from 'presentation/components/ui/empty-message'
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
        <EmptyMessage
          title='No hay rutinas disponibles'
          description='Crea una rutina para comenzar a entrenar'
        />
      )}
    </Container>
  )
}
