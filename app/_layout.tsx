import '../tamagui-web.css'

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import * as SQLite from 'expo-sqlite'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { TamaguiProvider } from 'tamagui'
import { PortalProvider } from '@tamagui/portal'

import { DATABASE_NAME } from 'data/constants'
import { migrateDB } from 'data/migrate-db'
import { config } from '../tamagui.config'

export {
  ErrorBoundary
} from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError])

  if (!interLoaded && !interError) {
    return null
  }

  return (
    <PortalProvider>
      <SQLite.SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDB}>
        <TamaguiProvider
          config={config}
          defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
        >
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
  
            <Stack>
              <Stack.Screen
                name='(tabs)'
                options={{
                  headerShown: false,
                }}
              />
            </Stack>
          </ThemeProvider>
        </TamaguiProvider>
      </SQLite.SQLiteProvider>
    </PortalProvider>
  )
}
