import { Stack } from 'expo-router'
import { useTheme } from 'tamagui'

export default function SettingsLayout() {
  const theme = useTheme()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.background.val
        },
      }}
      initialRouteName='settings/index'
    >
      <Stack.Screen
        name='settings/index'
        options={{
          title: 'Configuración',
        }}
      />

      <Stack.Screen
        name='routine/index'
        options={{
          title: 'Rutinas',
        }}
      />

      <Stack.Screen
        name='exercises/index'
        options={{
          title: 'Ejercicios',
        }}
      />

      <Stack.Screen
        name='workout-days/index'
        options={{
          title: 'Días de Entrenamiento',
        }}
      />
    </Stack>
  )
}
