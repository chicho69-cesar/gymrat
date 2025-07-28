import { Link } from 'expo-router'
import { Text, View } from 'tamagui'

/* 
En esta pantalla vamos a mostrar la lista de las rutinas creadas para
registrar los entrenamientos. Y poder navegar a dicha rutina.
*/
export default function HomeScreen() {
  return (
    <View>
      <Text>HomeScreen</Text>

      <Link href={`/routine/1`}>
        <Text>
          Ver rutina
        </Text>
      </Link>

      <Link href={`/workout/1`}>
        <Text>
          Ver entreno
        </Text>
      </Link>
    </View>
  )
}
