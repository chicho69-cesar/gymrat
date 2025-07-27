import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

export default function HistoryLayout() {
  const theme = useTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background.val
        },
      }}
    >
      <Stack.Screen
        name='history/index'
        options={{
          title: 'Historial',
        }}
      />
    </Stack>
  )
}
