import { Clock, Zap } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

import { WorkoutDay } from 'domain/entities/workout-day.entity'

interface WorkoutDaysListProps {
  workoutDays: WorkoutDay[]
  onRefresh?: () => void
  onDelete?: (workoutDayId: string) => void
}

export default function WorkoutDaysList({ workoutDays, onRefresh, onDelete }: WorkoutDaysListProps) {
  const theme = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <FlatList
      data={workoutDays}
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
          onPress={() => router.push(`/workout-days/${item.id}`)}
          onLongPress={() => onDelete?.(item.id)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                <Zap
                  size={24}
                  color='#ffffff'
                />
              </View>

              <View style={{ flexDirection: 'column', flex: 1, gap: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }} space='$2'>
                  <Text
                    style={[
                      styles.routineName,
                      { color: theme.red10.val || '#f87171' }
                    ]}
                  >
                    {item.name}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.routineDescription,
                    { color: theme.accent8.val || '#d4d4d8' }
                  ]}
                >
                  {item.description}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <Clock
                    size={14}
                    color='#a1a1aa'
                  />

                  <Text
                    style={[
                      styles.metaInfo,
                      { color: theme.accent6.val || '#a1a1aa' }
                    ]}
                  >
                    Día de entrenamiento
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
})
