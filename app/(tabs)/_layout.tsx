import { History, Home, Settings } from '@tamagui/lucide-icons'
import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTitleStyle: {
          color: theme.red10.val,
          fontSize: 18,
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name='(home)'
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home color={color as any} />,
        }}
      />

      <Tabs.Screen
        name='(history)'
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <History color={color as any} />,
        }}
      />

      <Tabs.Screen
        name='(settings)'
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color }) => <Settings color={color as any} />,
        }}
      />
    </Tabs>
  )
}
