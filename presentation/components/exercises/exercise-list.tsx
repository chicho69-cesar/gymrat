import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

import { Dumbbell } from '@tamagui/lucide-icons'
import { TimesHelper } from 'config/helpers/times'
import { Exercise } from 'domain/entities/exercise.entity'

interface ExerciseListProps {
  exercises: Exercise[]
  onRefresh?: () => void
  onDelete?: (exerciseId: string) => void
}

export default function ExerciseList({ exercises, onRefresh, onDelete }: ExerciseListProps) {
  const theme = useTheme()
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <FlatList
      data={exercises}
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
      renderItem={({ item, index }) => (
        <Pressable
          style={({ pressed }) => [
            styles.exerciseItem,
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
          onPress={() => router.push(`/exercises/${item.id}`)}
          onLongPress={() => onDelete?.(item.id)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: theme.red7?.val || '#fca5a5',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                fontSize='$4'
                fontWeight='700'
                color='white'
              >
                {index + 1}
              </Text>
            </View>

            <Dumbbell size={24} color='$red8' />
          </View>

          <View>
            <Text
              fontSize='$5'
              fontWeight='700'
              color='$red11'
              numberOfLines={1}
              mb='$1'
            >
              {item.name}
            </Text>

            {item.description && (
              <Text
                fontSize='$4'
                color={theme.gray11?.val || '#d4d4d8'}
                numberOfLines={2}
                mb='$2'
              >
                {item.description}
              </Text>
            )}

            <Text fontSize='$2' color={theme.gray10?.val || '#a1a1aa'} fontWeight='bold'>
              Descanso: {TimesHelper.fromSecondsToMinutes(item.rest)}
            </Text>
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
  exerciseItem: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  exerciseDescription: {
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
  exerciseRest: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
})
