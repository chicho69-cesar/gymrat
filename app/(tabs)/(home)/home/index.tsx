import { Link } from 'expo-router'
import Container from 'presentation/components/ui/container'
import { Text, View } from 'tamagui'

export default function HomeScreen() {
  return (
    <Container>
      <View>
        <Text
          style={{
            fontSize: 24,
            color: '#efefef',
            fontWeight: 'bold',
            textAlign: 'center',
            opacity: 0.8,
          }}
        >HomeScreen</Text>

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
    </Container>
  )
}
