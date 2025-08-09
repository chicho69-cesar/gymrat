import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Calendar } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Button, Text, useTheme, View } from 'tamagui'

import { ExerciseSet } from 'domain/entities/workout.entity'
import Container from 'presentation/components/ui/container'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutExercise from 'presentation/components/workouts/workout-exercise'
import useWorkout from 'presentation/hooks/use-workout'
import useWorkouts from 'presentation/hooks/use-workouts'
import { TimesHelper } from '../../../../config/helpers/times'

interface ExerciseSetInput extends ExerciseSet {
  isModified?: boolean
}

export default function WorkoutScreen() {
  const theme = useTheme()

  const { id, routineId, workoutDayId } = useLocalSearchParams()
  const { activeWorkout, workoutDetails, loading, error, setWorkoutDetails, updateWorkout, updateSet } = useWorkout(id as string)
  const { refresh } = useWorkouts(routineId as string)

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => router.back() }])
    }
  }, [error])

  const handleSelectDate = async (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date()

    setOpen(false)
    setDate(currentDate)

    await updateWorkout({
      id: activeWorkout?.id || '',
      date: TimesHelper.formatFromDate(currentDate, 'DD-MM-YYYY'),
      routineId: routineId as string || activeWorkout?.routineId || '',
      workoutDayId: workoutDayId as string || activeWorkout?.workoutDayId || ''
    })

    await refresh()
  }

  const updateExerciseSet = async (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps' | 'unit', value: string | number) => {
    const newWorkoutExercises = [...workoutDetails]

    const updatedSet = {
      ...newWorkoutExercises[exerciseIndex].sets[setIndex],
      [field]: field === 'unit' ? value : parseFloat(value.toString()) || 0,
      isModified: true
    }

    newWorkoutExercises[exerciseIndex].sets[setIndex] = updatedSet
    setWorkoutDetails(newWorkoutExercises)

    await updateSet(updatedSet)
  }

  const handleInputBlur = async (exerciseIndex: number, setIndex: number) => {
    const set = workoutDetails[exerciseIndex].sets[setIndex] as ExerciseSetInput

    if (set.isModified) {
      try {
        const newWorkoutExercises = [...workoutDetails]
        delete (newWorkoutExercises[exerciseIndex].sets[setIndex] as any).isModified

        setWorkoutDetails(newWorkoutExercises)

        await updateSet(set as ExerciseSet)
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
            onChange={handleSelectDate}
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
