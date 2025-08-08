import { Activity, Plus } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet } from 'react-native'
import { Button, Text, useTheme, View } from 'tamagui'

import { Routine } from 'domain/entities/routine.entity'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutList from 'presentation/components/workouts/workout-list'
import useRoutines from 'presentation/hooks/use-routines'
import useWorkouts from 'presentation/hooks/use-workouts'

export default function RoutineScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()

  const { routines } = useRoutines()
  const { workouts, loading, error, refresh, deleteWorkout } = useWorkouts(id as string)

  const [routine, setRoutine] = useState<Routine | undefined>()

  useEffect(() => {
    if (typeof id === 'string') {
      const foundRoutine = routines.find(r => r.id === id)
      setRoutine(foundRoutine)
    }
  }, [id, routines])

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
        href={`/workout/new?routineId=${id}&workoutDayId=${'new'}`}
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

          <Button
            size='$4'
            theme='red'
            onPress={() => router.push(`/workout/new?routineId=${id}&workoutDayId=${'new'}`)}
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
