import { Activity, Calendar, Plus } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native'
import { Button, Text, useTheme, View, XStack, YStack } from 'tamagui'

import { Workout } from 'domain/entities/workout.entity'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import useRoutines from 'presentation/hooks/use-routines'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

interface WorkoutWithDay extends Workout {
  workoutDayName?: string
}

/* 
Poner la lista de entrenamientos de la rutina en orden por fecha, mostrar el entrenamiento y el dia de entrenamiento al cual pertenece.
Poner un botón para agregar un nuevo entrenamiento en la rutina, crearlo con id new y navegar a esa pantalla.
Al darle click al entrenamiento, navegar a la pantalla de entrenamiento y pasar le el id del entrenamiento.
*/
export default function RoutineScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()

  const { routines } = useRoutines()
  const { workoutDays } = useWorkoutDays()

  const [routine, setRoutine] = useState<any>(null)
  const [workouts, setWorkouts] = useState<WorkoutWithDay[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (typeof id === 'string') {
      const foundRoutine = routines.find(r => r.id === id)
      setRoutine(foundRoutine)

      // TODO: Implementar la lógica para obtener los workouts de la rutina
      // Por ahora uso datos de ejemplo
      loadWorkouts()
    }
  }, [id, routines, workoutDays])

  const loadWorkouts = async () => {
    // TODO: Implementar la lógica real para cargar workouts de la rutina
    // Datos de ejemplo por ahora
    const exampleWorkouts: WorkoutWithDay[] = [
      {
        id: '1',
        date: '05-08-2025',
        routineId: typeof id === 'string' ? id : '',
        workoutDayId: 'wd1',
        workoutDayName: 'Push Day'
      },
      {
        id: '2',
        date: '03-08-2025',
        routineId: typeof id === 'string' ? id : '',
        workoutDayId: 'wd2',
        workoutDayName: 'Pull Day'
      },
      {
        id: '3',
        date: '01-08-2025',
        routineId: typeof id === 'string' ? id : '',
        workoutDayId: 'wd3',
        workoutDayName: 'Leg Day'
      }
    ]

    // Ordenar por fecha (más reciente primero)
    const sortedWorkouts = exampleWorkouts.sort((a, b) => {
      const dateA = new Date(a.date.split('-').reverse().join('-'))
      const dateB = new Date(b.date.split('-').reverse().join('-'))
      return dateB.getTime() - dateA.getTime()
    })

    setWorkouts(sortedWorkouts)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadWorkouts()
    setIsRefreshing(false)
  }

  const handleAddWorkout = () => {
    router.push(`/workout/new?routineId=${id}`)
  }

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}`)
  }

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderWorkoutItem = ({ item }: { item: WorkoutWithDay }) => (
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
      onPress={() => handleWorkoutPress(item.id)}
    >
      <XStack>
        <YStack flex={1} space="$2">
          <XStack >
            <Activity size={18} color='$red8' />

            <Text
              fontSize="$5"
              fontWeight="700"
              color='$red11'
            >
              {item.workoutDayName || 'Día de entrenamiento'}
            </Text>
          </XStack>

          <XStack>
            <Calendar size={16} color={theme.gray10?.val || '#a1a1aa'} />

            <Text
              fontSize="$3"
              color={theme.gray11?.val || '#d4d4d8'}
            >
              {formatDate(item.date)}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </Pressable>
  )

  return (
    <Container>
      <YStack space="$4">
        <Title text={routine?.name || 'Rutina'} />

        {routine?.description && (
          <Text
            fontSize="$4"
            color={theme.gray11?.val || '#d4d4d8'}
          >
            {routine.description}
          </Text>
        )}

        <XStack>
          <Text fontSize="$5" fontWeight="600" color='$red8'>
            Entrenamientos ({workouts.length})
          </Text>

          <Button
            size="$3"
            theme="red"
            onPress={handleAddWorkout}
            icon={Plus}
          >
            Nuevo entrenamiento
          </Button>
        </XStack>

        {workouts.length > 0 ? (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={renderWorkoutItem}
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
          />
        ) : (
          <View style={styles.emptyState}>
            <Activity size={48} color={theme.gray8?.val || '#71717a'} />
            <Text
              fontSize="$5"
              fontWeight="600"
              color={theme.gray10?.val || '#a1a1aa'}
            >
              No hay entrenamientos registrados
            </Text>
            <Text
              fontSize="$3"
              color={theme.gray9?.val || '#84848a'}
            >
              Agrega tu primer entrenamiento para comenzar
            </Text>
            <Button
              size="$4"
              theme="red"
              onPress={handleAddWorkout}
              icon={Plus}
            >
              Crear entrenamiento
            </Button>
          </View>
        )}
      </YStack>
    </Container>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  workoutItem: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
})
