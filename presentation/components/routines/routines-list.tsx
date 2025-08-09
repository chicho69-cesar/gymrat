import { Calendar, Dumbbell, Target } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

import { Routine } from 'domain/entities/routine.entity'

interface RoutinesListProps {
  routines: Routine[]
  onRefresh?: () => void
  onDelete?: (routineId: string) => void
}

export default function RoutinesList({ routines, onRefresh, onDelete }: RoutinesListProps) {
  const theme = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <FlatList
      data={routines}
      keyExtractor={(item) => item.id.toString()}
      onRefresh={onRefresh}
      refreshing={isRefreshing}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            setIsRefreshing(true)
            onRefresh?.()
            setIsRefreshing(false)
          }}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.routineItem,
            {
              backgroundColor: theme.black1.val || '#1a1a1a',
              borderColor: theme.red6.val || '#dc2626',
              shadowColor: theme.red8.val || '#b91c1c',
            },
            pressed && {
              opacity: 0.8,
              transform: [{ scale: 0.98 }],
            }
          ]}
          onPress={() => router.push(`/routine/${item.id}`)}
          onLongPress={() => onDelete?.(item.id)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.red9.val || '#dc2626',
                    shadowColor: theme.red11.val || '#b91c1c',
                  }
                ]}
              >
                <Dumbbell
                  size={24}
                  color='#ffffff'
                />
              </View>

              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text
                    style={[
                      styles.routineName,
                      { color: theme.red10.val || '#f87171' }
                    ]}
                  >
                    {item.name}
                  </Text>

                  <Target
                    size={16}
                    color='#dc2626'
                    style={{ opacity: 0.7 }}
                  />
                </View>

                <Text
                  style={[
                    styles.routineDescription,
                    { color: theme.accent8.val || '#d4d4d8' }
                  ]}
                >
                  {item.description}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Calendar
                    size={14}
                    color='#a1a1aa'
                  />

                  <Text
                    style={[
                      styles.metaInfo,
                      { color: theme.accent6.val || '#a1a1aa' }
                    ]}
                  >
                    Rutina personalizada
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 10,
  },
  routineItem: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  routineName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    flex: 1,
  },
  routineDescription: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  metaInfo: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.8,
  },
  actionIndicator: {
    marginLeft: 12,
    opacity: 0.6,
  },
})
