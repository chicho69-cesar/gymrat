import { Activity, Calendar } from '@tamagui/lucide-icons'
import { WorkoutWithDay } from 'domain/entities/workout.entity'
import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

import { TimesHelper } from '../../../config/helpers/times'

interface WorkoutListProps {
  workouts: WorkoutWithDay[]
  onRefresh?: () => void
  onDelete?: (id: string) => void
}

export default function WorkoutList({ workouts, onRefresh }: WorkoutListProps) {
  const theme = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <FlatList
      data={workouts}
      keyExtractor={(item) => item.id}
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
          tintColor={theme.red8?.val || '#b91c1c'}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.workoutItem,
            {
              backgroundColor: theme.black1?.val || '#1a1a1a',
              borderColor: theme.red6?.val || '#dc2626',
              shadowColor: theme.red8?.val || '#b91c1c',
            },
            pressed && {
              opacity: 0.8,
              transform: [{ scale: 0.98 }],
            }
          ]}
          onPress={() => router.push(`/workout/${item.id}`)}
        >
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Activity size={18} color='$red8' />

              <Text
                fontSize='$5'
                fontWeight='700'
                color='$red11'
              >
                {item.workoutDayName || 'Día de entrenamiento'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} color={theme.gray10?.val || '#a1a1aa'} />

              <Text
                fontSize='$3'
                color='$accent8'
                fontWeight={'700'}
              >
                {TimesHelper.formatDate(item.date)}
              </Text>
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
  workoutItem: {
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
  },
})