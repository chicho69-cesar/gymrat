
import ExerciseList from 'presentation/components/exercises/exercise-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'
import { Text } from 'tamagui'

/* 
En esta pantalla se mostrarán tres secciones, una para las rutinas creadas,
donde se podrán crear, editar y eliminar rutinas; otra para los ejercicios creados,
donde se podrán crear, editar y eliminar ejercicios; y una tercera para los
días de entrenamiento registrados, por ejemplo push, pull, legs, etc. Donde
el usuario podrá crear, editar y eliminar los días de entrenamiento.
*/
export default function SettingsScreen() {
  const { topExercises } = useExercises()

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

        {/* {exercises.length > 0 ? (
          <ExerciseList exercises={exercises} />
        ) : (
          <Text style={{ color: '#cbcbcb', textAlign: 'center', marginTop: 20 }}>
            No hay rutinas creadas.
          </Text>
        )} */}
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
          <Text style={{ color: '#cbcbcb', textAlign: 'center', marginTop: 20 }}>
            No hay ejercicios creados.
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
          <Text style={{ color: '#cbcbcb', textAlign: 'center', marginTop: 20 }}>
            No hay días de entrenamiento creados.
          </Text>
        )} */}
      </>
    </Container>
  )
}
