import { BarChart3, Dumbbell, TrendingUp } from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native'
import { Text, useTheme, View, XStack, YStack } from 'tamagui'

import { TimesHelper } from 'config/helpers/times'
import { Exercise } from 'domain/entities/exercise.entity'
import ExerciseHistoryHeader from 'presentation/components/stats/exercise-history-header'
import Container from 'presentation/components/ui/container'
import EmptyMessage from 'presentation/components/ui/empty-message'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'

export default function HistoryScreen() {
  const theme = useTheme()
  const { topExercises, loading, refresh } = useExercises()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [usedExercises, setUsedExercises] = useState<Exercise[]>([])

  useEffect(() => {
    // Filtrar solo ejercicios que han sido usados (los que aparecen en topExercises)
    // Si topExercises está ordenado por uso, entonces todos han sido usados
    setUsedExercises(topExercises)
  }, [topExercises])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setIsRefreshing(false)
  }

  const handleExercisePress = (exerciseId: string) => {
    router.push(`/workout-stats/${exerciseId}`)
  }

  const renderExerciseItem = ({ item, index }: { item: Exercise; index: number }) => (
    <Pressable
      style={({ pressed }) => [
        styles.exerciseItem,
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
      onPress={() => handleExercisePress(item.id)}
    >
      <XStack>
        <XStack >
          {/* Ranking number */}
          <View
            bg='$red8'
            height={32}
          >
            <Text
              fontSize='$4'
              fontWeight='700'
              color='white'
            >
              {index + 1}
            </Text>
          </View>

          {/* Exercise icon */}
          <Dumbbell size={24} color='$red8' />

          {/* Exercise details */}
          <YStack flex={1} space='$1'>
            <Text
              fontSize='$5'
              fontWeight='700'
              color='$red11'
              numberOfLines={1}
            >
              {item.name}
            </Text>

            {item.description && (
              <Text
                fontSize='$3'
                color={theme.gray11?.val || '#d4d4d8'}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}

            <XStack >
              <Text fontSize='$2' color={theme.gray10?.val || '#a1a1aa'}>
                Descanso: {TimesHelper.fromSecondsToMinutes(item.rest)}
              </Text>
            </XStack>
          </YStack>
        </XStack>

        {/* Stats icon */}
        <XStack >
          <BarChart3 size={20} color='$red8' />
          <TrendingUp size={16} color='$green8' />
        </XStack>
      </XStack>
    </Pressable>
  )

  if (loading && usedExercises.length === 0) {
    return (
      <Container>
        <YStack space='$4'>
          <Title text='Historial de ejercicios' />
          <View>
            <Text fontSize='$5' color={theme.gray10?.val || '#a1a1aa'}>
              Cargando historial...
            </Text>
          </View>
        </YStack>
      </Container>
    )
  }

  return (
    <Container>
      <Title text='Historial de ejercicios' />

      {usedExercises.length > 0 ? (
        <FlatList
          data={usedExercises}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseItem}
          ListHeaderComponent={() => (
            <ExerciseHistoryHeader exercisesCount={usedExercises.length} />
          )}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={theme.red8?.val || '#b91c1c'}
            />
          }
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <>
          <ExerciseHistoryHeader exercisesCount={0} />

          <EmptyMessage
            title='No hay ejercicios en tu historial'
            description='Completa tu primer entrenamiento para ver las estadísticas de tus ejercicios'
          />
        </>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  exerciseItem: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
})
