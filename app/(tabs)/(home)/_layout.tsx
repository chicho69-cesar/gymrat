import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

export default function HomeLayout() {
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
        name='home/index'
        options={{
          title: 'Inicio',
        }}
      />
    </Stack>
  )
}
