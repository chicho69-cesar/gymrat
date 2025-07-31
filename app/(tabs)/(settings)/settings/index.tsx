import { Link } from 'expo-router'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
// import useExercises from 'presentation/hooks/use-exercises'
import { Text } from 'tamagui'

/* 
En esta pantalla se mostrarán tres secciones, una para las rutinas creadas,
donde se podrán crear, editar y eliminar rutinas; otra para los ejercicios creados,
donde se podrán crear, editar y eliminar ejercicios; y una tercera para los
días de entrenamiento registrados, por ejemplo push, pull, legs, etc. Donde
el usuario podrá crear, editar y eliminar los días de entrenamiento.
*/
export default function SettingsScreen() {
  // const { exercises } = useExercises()

  return (
    <Container>
      <Title text='Rutinas' />
      <Title text='Ejercicios' />
      <Title text='Días de entrenamiento' />

      <Link href={`/routine`}>
        <Text>
          Ver rutinas
        </Text>
      </Link>

      <Link href={`/exercises`}>
        <Text>
          Ver ejercicios
        </Text>
      </Link>

      <Link href={`/workout-days`}>
        <Text>
          Ver días de entrenamiento
        </Text>
      </Link>
    </Container>
  )
}
