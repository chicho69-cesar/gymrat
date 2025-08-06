import { Activity, Plus } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { Button, Text, useTheme, View } from 'tamagui'

import { WorkoutWithDay } from 'domain/entities/workout.entity'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import Title from 'presentation/components/ui/title'
import WorkoutList from 'presentation/components/workouts/workout-list'
import useRoutines from 'presentation/hooks/use-routines'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

export default function RoutineScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()

  const { routines } = useRoutines()
  const { workoutDays } = useWorkoutDays()

  const [routine, setRoutine] = useState<any>(null)
  const [workouts, setWorkouts] = useState<WorkoutWithDay[]>([])

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
    await loadWorkouts()
  }

  return (
    <Container>
      <Title text={routine?.name || 'Rutina'} />

      {routine?.description && (
        <Text
          fontSize='$5'
          color='$accent8'
          mb='$3'
        >
          {routine.description}
        </Text>
      )}

      <CustomLink
        href={`/workout/new?routineId=${id}`}
        link='Nuevo entrenamiento'
        iconName='add-circle-outline'
        iconSize={16}
      />

      <Text
        fontSize='$6'
        fontWeight='600'
        color='$red10'
        style={{ textAlign: 'center', marginVertical: 12 }}
      >
        # de Entrenamientos ({workouts.length})
      </Text>

      {workouts.length > 0 ? (
        <WorkoutList
          workouts={workouts}
          onRefresh={handleRefresh}
        />
      ) : (
        <View style={styles.emptyState}>
          <Activity
            size={64}
            color={theme.gray8?.val || '#71717a'}
            mb='$4'
          />

          <Text
            fontSize='$6'
            fontWeight='600'
            color={theme.gray10?.val || '#a1a1aa'}
            style={{ textAlign: 'center', marginBottom: 8 }}
          >
            No hay entrenamientos registrados
          </Text>

          <Text
            fontSize='$4'
            color={theme.gray9?.val || '#84848a'}
            style={{ textAlign: 'center', marginBottom: 16 }}
          >
            Agrega tu primer entrenamiento para comenzar
          </Text>

          <Button
            size='$4'
            theme='red'
            onPress={() => router.push(`/workout/new?routineId=${id}`)}
            icon={Plus}
          >
            Crear entrenamiento
          </Button>
        </View>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
})
