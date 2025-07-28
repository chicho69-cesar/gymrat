import { Link } from 'expo-router'
import { Text, View } from 'tamagui'

/* 
En esta pantalla se mostrará el historial de todos los entrenamientos hechos
por el usuario ordenados por fecha. Al seleccionar un entrenamiento,
se podrá ver el detalle de los ejercicios y series realizadas.
*/
export default function HistoryScreen() {
  return (
    <View>
      <Text>HistoryScreen</Text>

      <Link href={`/workout-stats/1`}>
        <Text>
          Ver stats
        </Text>
      </Link>
    </View>
  )
}
