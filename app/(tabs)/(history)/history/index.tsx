import { Link } from 'expo-router'
import Container from 'presentation/components/ui/container'
import { Text, View } from 'tamagui'

/* 
En esta pantalla se mostrará el historial de todos los entrenamientos hechos
por el usuario ordenados por fecha. Al seleccionar un entrenamiento,
se podrá ver el detalle de los ejercicios y series realizadas.
*/
export default function HistoryScreen() {
  return (
    <Container>
      <View>
        <Text>HistoryScreen</Text>

        <Link href={`/workout-stats/1`}>
          <Text>
            Ver stats
          </Text>
        </Link>
      </View>
    </Container>
  )
}
