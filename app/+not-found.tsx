import { Link, Stack } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Text, View } from 'tamagui'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />

      <View m={10}>
        <Text>
          Error. La página que estás buscando no existe o ha sido movida.
        </Text>

        <Link href='/' style={styles.link}>
          <Text style={styles.linkText}>
            Ir a la página principal
          </Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
})
