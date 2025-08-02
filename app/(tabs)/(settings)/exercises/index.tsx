import ExerciseList from 'presentation/components/exercises/exercise-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'

export default function ExercisesScreen() {
  const { exercises, refresh } = useExercises()

  return (
    <Container>
      <Title text='Ejercicios' />

      <CustomLink
        href='/exercises/new'
        link='Nuevo ejercicio'
        iconName='add-circle-outline'
        iconSize={16}
      />

      <ExerciseList
        exercises={exercises}
        onRefresh={refresh}
      />
    </Container>
  )
}
