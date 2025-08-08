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
import useWorkoutDays from 'presentation/hooks/use-workout-days'
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
de entreno que tenga la rutina.

Una vez teniendo el workoutDayId obtengo los ejercicios que están asociados a ese día,
usando la tabla WorkoutDay, WorkoutDayExercise y Exercise.

Al entrar a la pantalla con un useEffect, si el id es 'new' entonces creo un nuevo workout vació, 
con todos los sets de los ejercicios en 0. Si es un id existente, obtengo el workout y 
los ejercicios asociados a ese workout, además de los sets de cada ejercicio.
*/

export default function WorkoutScreen() {
  const { id, routineId, workoutDayId } = useLocalSearchParams()
  const theme = useTheme()

  const { exercises } = useExercises()
  const { } = useWorkout(id as string)
  const { workoutDayExercises, fetchWorkoutDayExercises } = useWorkoutDays()

  const [currentId, setCurrentId] = useState<string>(typeof id === 'string' ? id : 'new')
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  const [workout, setWorkout] = useState<any>(null)
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseWithDetails[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof id === 'string') {
      setCurrentId(id)
      loadWorkoutData()
    }
  }, [id])

  // useEffect(() => {
  //   if (typeof workoutDayId === 'string') {
  //     fetchWorkoutDayExercises(workoutDayId)
  //   }
  // }, [workoutDayId])

  // useEffect(() => {
  //   console.log('workoutDayExercises updated:', workoutDayExercises)
  // }, [workoutDayExercises])

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

  const handleSubmit = async () => { }

  if (loading) {
    return (
      <FullScreenLoader />
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
            {/* {TimesHelper.formatDate(workout.date)} */}
            {TimesHelper.formatDate(TimesHelper.formatFromDate(date, 'DD-MM-YYYY'))}
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
          <EmptyMessage
            title='No hay ejercicios en este entrenamiento'
            description='Puedes añadir ejercicios desde la pantalla de días de entrenamiento o crear un nuevo ejercicio.'
          />
        )}
      </View>
    </Container>
  )
}
