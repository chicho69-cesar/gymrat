import { Link } from 'expo-router'
import Container from 'presentation/components/ui/container'
import { Text, View } from 'tamagui'

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
