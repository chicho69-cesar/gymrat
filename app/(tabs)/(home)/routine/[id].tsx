import { Activity } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

import { TimesHelper } from 'config/helpers/times'
import { Routine } from 'domain/entities/routine.entity'
import { WorkoutDay } from 'domain/entities/workout-day.entity'
import { WorkoutDayUseCases } from 'domain/use-cases/workout-day.use-cases'
import { WorkoutUseCases } from 'domain/use-cases/workout.use-cases'
import { WorkoutDayDatasourceImpl } from 'infrastructure/datasources/workout-day.datasource.impl'
import { WorkoutDataSourceImpl } from 'infrastructure/datasources/workout.datasource.impl'
import { WorkoutDayRepositoryImpl } from 'infrastructure/repositories/workout-day.repository.impl'
import { WorkoutRepositoryImpl } from 'infrastructure/repositories/workout.repository.impl'
import Container from 'presentation/components/ui/container'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutDaySelector from 'presentation/components/workouts/workout-day-selector'
import WorkoutList from 'presentation/components/workouts/workout-list'
import { useDatabase } from 'presentation/hooks/use-database'
import useRoutines from 'presentation/hooks/use-routines'
import useWorkoutDays from 'presentation/hooks/use-workout-days'
import useWorkouts from 'presentation/hooks/use-workouts'

export default function RoutineScreen() {
  const { id } = useLocalSearchParams()
  const { db } = useDatabase()
  const theme = useTheme()

  const { routines } = useRoutines()
  const { getByRoutineId } = useWorkoutDays()
  const { workouts, loading, error, refresh, deleteWorkout } = useWorkouts(id as string)

  const [routine, setRoutine] = useState<Routine | undefined>()
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([])
  const [workoutDay, setWorkoutDay] = useState<WorkoutDay | undefined>()

  useEffect(() => {
    if (typeof id === 'string') {
      const foundRoutine = routines.find(r => r.id === id)
      setRoutine(foundRoutine)
    }
  }, [id, routines])

  useEffect(() => {
    if (routine) {
      getByRoutineId(routine.id)
        .then(setWorkoutDays)
        .catch((err) => {
          console.error('Failed to fetch workout days:', err)
          Alert.alert('Error', 'Error cargando los días de entrenamiento', [{ text: 'OK' }])
        })
    }
  }, [routine])

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK' }])
    }
  }, [error])

  const handleDelete = async (workoutId: string) => {
    Alert.alert(
      'Confirm Delete',
      '¿Estas seguro de eliminar este entrenamiento?',
      [
        {
          text: 'Canelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await deleteWorkout(workoutId)
            refresh()
          },
        },
      ]
    )
  }

  const handleSelectWorkoutDay = (value: string) => {
    const selectedWorkoutDay = workoutDays.find((wd) => wd.id === value)

    if (selectedWorkoutDay) {
      setWorkoutDay(selectedWorkoutDay)
    }
  }

  const handleAddWorkout = async () => {
    const workoutDayDatasource = new WorkoutDayDatasourceImpl(db)
    const workoutDayRepository = new WorkoutDayRepositoryImpl(workoutDayDatasource)

    const workoutDatasource = new WorkoutDataSourceImpl(db)
    const workoutRepository = new WorkoutRepositoryImpl(workoutDatasource)

    const workoutDayExercises = await WorkoutDayUseCases.getExercises(workoutDayRepository, workoutDay?.id || 'new')

    const workoutCreated = await WorkoutUseCases.create(
      workoutRepository,
      {
        date: TimesHelper.formatFromDate(new Date(), 'DD-MM-YYYY'),
        routineId: routine?.id || '',
        workoutDayId: workoutDay?.id || 'new',
      },
      workoutDayExercises
    )

    router.push(`/workout/${workoutCreated.id}?routineId=${id}&workoutDayId=${workoutDay?.id || 'new'}`)
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

      <WorkoutDaySelector
        workoutDays={workoutDays}
        workoutDay={workoutDay}
        onSelectWorkoutDay={handleSelectWorkoutDay}
        onAddWorkout={handleAddWorkout}
      />

      <Text
        fontSize='$6'
        fontWeight='600'
        color='$red10'
        style={{ textAlign: 'center', marginVertical: 12 }}
      >
        # de Entrenamientos ({workouts.length})
      </Text>

      {loading ? (
        <FullScreenLoader />
      ) : workouts.length > 0 ? (
        <WorkoutList
          workouts={workouts}
          onRefresh={() => {
            refresh()
          }}
          onDelete={handleDelete}
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
