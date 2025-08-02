import { ActivityIndicator, View } from 'react-native'
import { useTheme } from 'tamagui'

export default function FullScreenLoader() {
  const theme = useTheme()

  return (
    <View style={{ flex: 1, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size={'large'} color={theme.accent5.val} />
    </View>
  )
}
