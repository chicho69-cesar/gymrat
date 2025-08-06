import { Calendar, Check, ChevronDown, ChevronUp, Dumbbell } from '@tamagui/lucide-icons'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView } from 'react-native'
import { Input, Label, Select, Text, useTheme, View, XStack, YStack } from 'tamagui'

import { Exercise } from 'domain/entities/exercise.entity'
import { WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { ExerciseSet, WorkoutExercise } from 'domain/entities/workout.entity'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise?: Exercise
  workoutDayExercise?: WorkoutDayExercise
  sets: ExerciseSet[]
}

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
      // TODO: Implementar la lógica real para cargar el workout
      // Por ahora uso datos de ejemplo
      const exampleWorkout = {
        id: typeof id === 'string' ? id : '',
        date: '05-08-2025',
        routineId: 'routine1',
        workoutDayId: 'wd1'
      }

      // Datos de ejemplo para ejercicios del entrenamiento
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

    // TODO: Implementar la lógica real para guardar en la base de datos
    console.log('Saving set:', updatedSet)
  }

  const handleInputBlur = async (exerciseIndex: number, setIndex: number) => {
    const set = workoutExercises[exerciseIndex].sets[setIndex] as ExerciseSetInput
    if (set.isModified) {
      try {
        // TODO: Implementar la lógica real para guardar en la base de datos
        console.log('Auto-saving set on blur:', set)

        // Marcar como guardado
        const newWorkoutExercises = [...workoutExercises]
        delete (newWorkoutExercises[exerciseIndex].sets[setIndex] as any).isModified
        setWorkoutExercises(newWorkoutExercises)
      } catch (error) {
        console.error('Error auto-saving set:', error)
      }
    }
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

  const renderExerciseSet = (set: ExerciseSet, setIndex: number, exerciseIndex: number, isHeatingSet: boolean = false) => (
    <XStack
      key={set.id}
      space="$2"
      bg={isHeatingSet ? '$yellow2' : '$black2'}
      borderWidth={1}
      borderColor={isHeatingSet ? '$yellow6' : '$accent6'}
    >
      <Text
        fontSize="$4"
        fontWeight="600"
        color={isHeatingSet ? '$yellow11' : '$accent11'}
      >
        {isHeatingSet ? 'C' : set.setNumber}
      </Text>

      <YStack flex={1} space="$1">
        <Label fontSize="$2" color="$accent10">Peso</Label>
        <Input
          value={set.weight.toString()}
          onChangeText={(text) => updateExerciseSet(exerciseIndex, setIndex, 'weight', text)}
          onBlur={() => handleInputBlur(exerciseIndex, setIndex)}
          keyboardType="decimal-pad"
          bg="$accent1"
          borderColor="$accent6"
          focusStyle={{ borderColor: '$red8' }}
        />
      </YStack>

      <YStack flex={1} space="$1">
        <Label fontSize="$2" color="$accent10">Reps</Label>
        <Input
          value={set.reps.toString()}
          onChangeText={(text) => updateExerciseSet(exerciseIndex, setIndex, 'reps', text)}
          onBlur={() => handleInputBlur(exerciseIndex, setIndex)}
          keyboardType="number-pad"
          bg="$accent1"
          borderColor="$accent6"
          focusStyle={{ borderColor: '$red8' }}
        />
      </YStack>

      <YStack>
        <Label fontSize="$2" color="$accent10">Unidad</Label>
        <Select
          value={set.unit}
          onValueChange={(value) => updateExerciseSet(exerciseIndex, setIndex, 'unit', value)}
        >
          <Select.Trigger iconAfter={ChevronDown} size="$2">
            <Select.Value />
          </Select.Trigger>

          <Select.Adapt when="sm" platform="touch">
            <Select.Sheet modal dismissOnSnapToBottom>
              <Select.Sheet.Frame>
                {/* <Select.SheetContents /> */}
              </Select.Sheet.Frame>
              <Select.Sheet.Overlay />
            </Select.Sheet>
          </Select.Adapt>

          <Select.Content zIndex={200000}>
            <Select.ScrollUpButton >
              <YStack >
                <ChevronUp size={20} />
              </YStack>
            </Select.ScrollUpButton>

            <Select.Viewport >
              <Select.Group>
                <Select.Item index={1} value="Kg">
                  <Select.ItemText>Kg</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item index={2} value="LB">
                  <Select.ItemText>LB</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton>
              <YStack>
                <ChevronDown size={20} />
              </YStack>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select>
      </YStack>
    </XStack>
  )

  const renderWorkoutExercise = (workoutExercise: WorkoutExerciseWithDetails, exerciseIndex: number) => {
    const totalSets = workoutExercise.workoutDayExercise?.sets || 0
    const heatingSets = workoutExercise.workoutDayExercise?.heatingSets || 0

    return (
      <View
        key={workoutExercise.id}
        borderWidth={2}
        borderColor="$red6"
        bg="$accent1"
      >
        <XStack >
          <Dumbbell size={24} color='$red10' />
          <YStack flex={1}>
            <Text fontSize="$6" fontWeight="700" color="$red11">
              {workoutExercise.exercise?.name || 'Ejercicio'}
            </Text>
            <Text fontSize="$3" color="$accent10">
              {totalSets} sets • {heatingSets} calentamiento
            </Text>
          </YStack>
        </XStack>

        <YStack space="$2">
          {/* Sets de calentamiento */}
          {heatingSets > 0 && (
            <YStack space="$2">
              <Text fontSize="$4" fontWeight="600" color="$yellow11">
                Sets de calentamiento
              </Text>
              {Array.from({ length: heatingSets }, (_, index) => {
                const setData = workoutExercise.sets[index] || {
                  id: `heating-${index}`,
                  workoutExerciseId: workoutExercise.id,
                  weight: 0,
                  reps: 0,
                  unit: 'Kg' as const,
                  setNumber: index + 1
                }
                return renderExerciseSet(setData, index, exerciseIndex, true)
              })}
            </YStack>
          )}

          {/* Sets normales */}
          <YStack space="$2">
            <Text fontSize="$4" fontWeight="600" color="$red11">
              Sets de trabajo
            </Text>
            {Array.from({ length: totalSets }, (_, index) => {
              const setIndex = heatingSets + index
              const setData = workoutExercise.sets[setIndex] || {
                id: `work-${index}`,
                workoutExerciseId: workoutExercise.id,
                weight: 0,
                reps: 0,
                unit: 'Kg' as const,
                setNumber: index + 1
              }
              return renderExerciseSet(setData, setIndex, exerciseIndex, false)
            })}
          </YStack>
        </YStack>
      </View>
    )
  }

  if (loading) {
    return (
      <Container>
        <View>
          <Text fontSize="$5">Cargando entrenamiento...</Text>
        </View>
      </Container>
    )
  }

  return (
    <Container>
      <YStack space="$4">
        <Title text={id === 'new' ? 'Nuevo entrenamiento' : 'Entrenamiento'} />

        {workout && (
          <XStack>
            <Calendar size={18} color={theme.gray10?.val || '#a1a1aa'} />
            <Text fontSize="$4" color="$accent11">
              {formatDate(workout.date)}
            </Text>
          </XStack>
        )}

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack >
            {workoutExercises.map((workoutExercise, index) =>
              renderWorkoutExercise(workoutExercise, index)
            )}

            {workoutExercises.length === 0 && (
              <View style={{ alignItems: 'center', padding: 32 }}>
                <Dumbbell size={48} color={theme.gray8?.val || '#71717a'} />
                <Text
                  fontSize="$5"
                  fontWeight="600"
                  color="$accent10"
                >
                  No hay ejercicios en este entrenamiento
                </Text>
              </View>
            )}
          </YStack>
        </ScrollView>
      </YStack>
    </Container>
  )
}
