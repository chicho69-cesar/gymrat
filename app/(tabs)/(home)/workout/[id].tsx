import DateTimePicker from '@react-native-community/datetimepicker'
import { Calendar } from '@tamagui/lucide-icons'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Button, Text, useTheme, View } from 'tamagui'

import { ExerciseSet, WorkoutExerciseWithDetails } from 'domain/entities/workout.entity'
import Container from 'presentation/components/ui/container'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutExercise from 'presentation/components/workouts/workout-exercise'
import useExercises from 'presentation/hooks/use-exercises'
import useWorkout from 'presentation/hooks/use-workout'
import { TimesHelper } from '../../../../config/helpers/times'

interface ExerciseSetInput extends ExerciseSet {
  isModified?: boolean
}

/* 
Voy a necesitar para crear el entrenamiento:
routineId: string ✅
workoutDayId: string ✅
date: string - Datetimepicker / defecto: hoy ✅

En la pantalla de rutina, al agregar un nuevo entreno, que aparezca un modal
para seleccionar el día de entrenamiento (workoutDayId) en base a los Dias
de entreno que tenga la rutina. ✅

Una vez teniendo el workoutDayId obtengo los ejercicios que están asociados a ese día,
usando la tabla WorkoutDay, WorkoutDayExercise y Exercise.
*/

export default function WorkoutScreen() {
  const { id, routineId, workoutDayId } = useLocalSearchParams()
  const theme = useTheme()

  const { exercises } = useExercises()
  const { activeWorkout, loading, workoutDetails } = useWorkout(id as string)

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseWithDetails[]>([])

  useEffect(() => {
    if (typeof id === 'string' && activeWorkout) {
      loadWorkoutData()
    }
  }, [id, activeWorkout])

  const loadWorkoutData = async () => {
    // setLoading(true)

    try {
      const exampleWorkoutExercises: WorkoutExerciseWithDetails[] = [
        {
          id: 'we1',
          workoutId: activeWorkout!.id,
          workoutDayExerciseId: 'wde1',
          exercise: {
            id: 'ex1',
            name: 'Press banca',
            description: 'Press de banca con barra',
            rest: 150
          },
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
          workoutId: activeWorkout!.id,
          workoutDayExerciseId: 'wde2',
          exercise: {
            id: 'ex2',
            name: 'Curl con barra',
            description: 'Curl con barra para bíceps',
            rest: 120
          },
          workoutDayExercise: { id: 'wde2', workoutDayId: 'wd1', exerciseId: 'ex2', sets: 3, heatingSets: 1 },
          sets: [
            { id: 'set5', workoutExerciseId: 'we2', weight: 15, reps: 12, unit: 'Kg', setNumber: 1 },
            { id: 'set6', workoutExerciseId: 'we2', weight: 17.5, reps: 10, unit: 'Kg', setNumber: 2 },
            { id: 'set7', workoutExerciseId: 'we2', weight: 20, reps: 8, unit: 'Kg', setNumber: 3 },
          ]
        }
      ]

      setWorkoutExercises(exampleWorkoutExercises)
    } catch (error) {
      console.error('Error loading workout data:', error)
      Alert.alert('Error', 'No se pudo cargar la información del entrenamiento')
    } finally {
      // setLoading(false)
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
    /* TODO: Save the update on this set */
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
      <FullScreenLoader />
    )
  }

  return (
    <Container>
      <Title text={id === 'new' ? 'Nuevo entrenamiento' : 'Entrenamiento'} />

      {activeWorkout && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color={theme.gray10?.val || '#a1a1aa'} />

          <Text
            fontSize='$3'
            color='$accent8'
            fontWeight={'700'}
          >
            {TimesHelper.formatDate(activeWorkout.date)}
            {/* {TimesHelper.formatDate(TimesHelper.formatFromDate(date, 'DD-MM-YYYY'))} */}
          </Text>
        </View>
      )}

      <>
        <Button
          theme='red'
          onPress={() => setOpen(true)}
          my='$3'
        >
          Actualizar fecha
        </Button>

        {open && (
          <DateTimePicker
            value={date}
            mode='date'
            display='default'
            onChange={(event, selectedDate) => {
              const currentDate = selectedDate || new Date()

              setOpen(false)
              setDate(currentDate)
            }}
            style={{ width: '100%' }}
            textColor={theme.gray10?.val || '#a1a1aa'}
            themeVariant='dark'
            accentColor={theme.accent8?.val || '#f59e0b'}
          />
        )}
      </>

      <View style={{ marginVertical: 16 }}>
        {workoutDetails.map((workoutExercise, index) =>
          <WorkoutExercise
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            exerciseIndex={index}
            updateExerciseSet={updateExerciseSet}
            handleInputBlur={handleInputBlur}
          />
        )}

        {workoutDetails.length === 0 && (
          <EmptyMessage
            title='No hay ejercicios en este entrenamiento'
            description='Puedes añadir ejercicios desde la pantalla de días de entrenamiento o crear un nuevo ejercicio.'
          />
        )}
      </View>
    </Container>
  )
}
