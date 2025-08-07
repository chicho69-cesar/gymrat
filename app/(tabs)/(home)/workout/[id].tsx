import { Calendar, Dumbbell } from '@tamagui/lucide-icons'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

import { ExerciseSet, WorkoutExerciseWithDetails } from 'domain/entities/workout.entity'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import WorkoutExercise from 'presentation/components/workouts/workout-exercise'
import useExercises from 'presentation/hooks/use-exercises'
import useWorkoutDays from 'presentation/hooks/use-workout-days'
import { TimesHelper } from '../../../../config/helpers/times'

interface ExerciseSetInput extends ExerciseSet {
  isModified?: boolean
}

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()

  const { exercises } = useExercises()
  const { workoutDayExercises } = useWorkoutDays()

  const [workout, setWorkout] = useState<any>(null)
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseWithDetails[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof id === 'string') {
      loadWorkoutData()
    }
  }, [id, exercises, workoutDayExercises])

  const loadWorkoutData = async () => {
    setLoading(true)
    try {
      const exampleWorkout = {
        id: typeof id === 'string' ? id : '',
        date: '05-08-2025',
        routineId: 'routine1',
        workoutDayId: 'wd1'
      }

      const exampleWorkoutExercises: WorkoutExerciseWithDetails[] = [
        {
          id: 'we1',
          workoutId: exampleWorkout.id,
          workoutDayExerciseId: 'wde1',
          exercise: exercises.find(e => e.name.includes('Press')) || exercises[0],
          workoutDayExercise: { id: 'wde1', workoutDayId: 'wd1', exerciseId: 'ex1', sets: 4, heatingSets: 1 },
          sets: [
            { id: 'set1', workoutExerciseId: 'we1', weight: 80, reps: 10, unit: 'Kg', setNumber: 1 },
            { id: 'set2', workoutExerciseId: 'we1', weight: 85, reps: 8, unit: 'Kg', setNumber: 2 },
            { id: 'set3', workoutExerciseId: 'we1', weight: 90, reps: 6, unit: 'Kg', setNumber: 3 },
            { id: 'set4', workoutExerciseId: 'we1', weight: 85, reps: 8, unit: 'Kg', setNumber: 4 },
          ]
        },
        {
          id: 'we2',
          workoutId: exampleWorkout.id,
          workoutDayExerciseId: 'wde2',
          exercise: exercises.find(e => e.name.includes('Curl')) || exercises[1],
          workoutDayExercise: { id: 'wde2', workoutDayId: 'wd1', exerciseId: 'ex2', sets: 3, heatingSets: 1 },
          sets: [
            { id: 'set5', workoutExerciseId: 'we2', weight: 15, reps: 12, unit: 'Kg', setNumber: 1 },
            { id: 'set6', workoutExerciseId: 'we2', weight: 17.5, reps: 10, unit: 'Kg', setNumber: 2 },
            { id: 'set7', workoutExerciseId: 'we2', weight: 20, reps: 8, unit: 'Kg', setNumber: 3 },
          ]
        }
      ]

      setWorkout(exampleWorkout)
      setWorkoutExercises(exampleWorkoutExercises)
    } catch (error) {
      console.error('Error loading workout data:', error)
      Alert.alert('Error', 'No se pudo cargar la información del entrenamiento')
    } finally {
      setLoading(false)
    }
  }

  const updateExerciseSet = async (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps' | 'unit', value: string | number) => {
    const newWorkoutExercises = [...workoutExercises]
    const updatedSet = {
      ...newWorkoutExercises[exerciseIndex].sets[setIndex],
      [field]: field === 'unit' ? value : parseFloat(value.toString()) || 0,
      isModified: true
    }

    newWorkoutExercises[exerciseIndex].sets[setIndex] = updatedSet
    setWorkoutExercises(newWorkoutExercises)

    console.log('Saving set:', updatedSet)
  }

  const handleInputBlur = async (exerciseIndex: number, setIndex: number) => {
    const set = workoutExercises[exerciseIndex].sets[setIndex] as ExerciseSetInput
    if (set.isModified) {
      try {
        console.log('Auto-saving set on blur:', set)

        const newWorkoutExercises = [...workoutExercises]
        delete (newWorkoutExercises[exerciseIndex].sets[setIndex] as any).isModified
        setWorkoutExercises(newWorkoutExercises)
      } catch (error) {
        console.error('Error auto-saving set:', error)
      }
    }
  }

  if (loading) {
    return (
      <Container>
        <View>
          <Text fontSize='$5'>
            Cargando entrenamiento...
          </Text>
        </View>
      </Container>
    )
  }

  return (
    <Container>
      <Title text={id === 'new' ? 'Nuevo entrenamiento' : 'Entrenamiento'} />

      {workout && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color={theme.gray10?.val || '#a1a1aa'} />

          <Text
            fontSize='$3'
            color='$accent8'
            fontWeight={'700'}
          >
            {TimesHelper.formatDate(workout.date)}
          </Text>
        </View>
      )}

      <View style={{ marginVertical: 16 }}>
        {workoutExercises.map((workoutExercise, index) =>
          <WorkoutExercise
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            exerciseIndex={index}
            updateExerciseSet={updateExerciseSet}
            handleInputBlur={handleInputBlur}
          />
        )}

        {workoutExercises.length === 0 && (
          <View style={{ alignItems: 'center', padding: 32 }}>
            <Dumbbell
              size={64}
              color={theme.gray8?.val || '#71717a'}
            />

            <Text
              fontSize='$5'
              fontWeight='600'
              color='$accent10'
            >
              No hay ejercicios en este entrenamiento
            </Text>
          </View>
        )}
      </View>
    </Container>
  )
}
