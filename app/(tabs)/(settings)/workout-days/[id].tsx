import { Check, ChevronDown, ChevronUp, Trash2 } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Alert } from 'react-native'
import { Adapt, Button, Input, Label, Select, Sheet, Text, TextArea, useTheme, View } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { WorkoutDayDto } from 'domain/dtos/workout-day.dto'
import { WorkoutDayExercise } from 'domain/entities/workout-day.entity'
import { SelectedExercise } from 'infrastructure/interfaces/selected-exercise.interface'
import { SelectedExerciseMapper } from 'infrastructure/mappers/selected-exercise.mapper'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

export default function WorkoutDaysScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()

  const { exercises } = useExercises()
  const {
    workoutDays,
    workoutDayExercises,
    loading,
    error,
    createUpdateWorkoutDay,
    fetchWorkoutDayExercises
  } = useWorkoutDays()

  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([])
  const [form, setForm] = useState<WorkoutDayDto>({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (id === 'new') return

    const foundWorkoutDay = workoutDays.find((wd) => wd.id === id)

    if (!foundWorkoutDay) {
      router.replace('/workout-days')
      return
    }

    setForm({
      name: foundWorkoutDay.name,
      description: foundWorkoutDay.description,
    })

    if (typeof id === 'string') {
      fetchWorkoutDayExercises(id)
    }
  }, [id, workoutDays])

  useEffect(() => {
    if (workoutDayExercises.length > 0 && id !== 'new') {
      const exercisesWithNames = workoutDayExercises.map((wde) => {
        const exercise = exercises.find((ex) => ex.id === wde.exerciseId)
        return SelectedExerciseMapper.fromEntity(wde, exercise?.name || 'Ejercicio no encontrado')
      })

      setSelectedExercises(exercisesWithNames)
    }
  }, [workoutDayExercises, exercises])

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => router.back() }])
    }
  }, [error])

  const addExercise = (exerciseId: string) => {
    const exercise = exercises.find((ex) => ex.id === exerciseId)
    if (!exercise) return

    const newSelectedExercise: SelectedExercise = {
      id: 'new',
      exerciseId: exerciseId,
      workoutDayId: typeof id === 'string' ? id : 'new',
      exerciseName: exercise.name,
      sets: 1,
      heatingSets: 1,
    }

    setSelectedExercises([...selectedExercises, newSelectedExercise])
  }

  const removeExercise = (index: number) => {
    const newSelectedExercises = selectedExercises.filter((_, i) => i !== index)
    setSelectedExercises(newSelectedExercises)
  }

  const updateExerciseData = (index: number, field: 'sets' | 'heatingSets', value: number) => {
    const newSelectedExercises = [...selectedExercises]

    newSelectedExercises[index] = {
      ...newSelectedExercises[index],
      [field]: value
    }

    setSelectedExercises(newSelectedExercises)
  }

  const handleSubmit = async () => {
    const workoutDayExercises: WorkoutDayExercise[] = selectedExercises.map((se) => {
      return SelectedExerciseMapper.toEntity({
        ...se,
        workoutDayId: typeof id === 'string' ? id : 'new',
      })
    })

    await createUpdateWorkoutDay(form, workoutDayExercises, typeof id === 'string' ? id : 'new')
    router.back()
  }

  const unSelectedExercises = useMemo(() => {
    return exercises.filter((exercise) =>
      !selectedExercises.some((se) => se.exerciseId === exercise.id)
    )
  }, [exercises, selectedExercises])

  return (
    <Container>
      <Title text={id === 'new' ? 'Nuevo día de entrenamiento' : 'Editar día de entrenamiento'} />

      <View style={{ marginBottom: 8 }}>
        <Label htmlFor='name' style={{ fontSize: 12, fontWeight: '600' }}>
          Nombre del día de entrenamiento *
        </Label>

        <Input
          id='name'
          placeholder='Ej: Push Day'
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          focusStyle={{
            borderColor: '$red8',
          }}
        />
      </View>

      <View style={{ marginBottom: 8 }}>
        <Label htmlFor='description' style={{ fontSize: 12, fontWeight: '600' }}>
          Descripción
        </Label>

        <TextArea
          id='description'
          placeholder='Describe el enfoque de este día de entrenamiento...'
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          numberOfLines={3}
          focusStyle={{
            borderColor: '$red8',
          }}
        />
      </View>

      <View style={{ marginBottom: 8 }}>
        <Label style={{ fontSize: 12, fontWeight: '600' }}>
          Agregar ejercicios
        </Label>

        {unSelectedExercises.length > 0 ? (
          <Select value='' onValueChange={addExercise}>
            <Select.Trigger iconAfter={ChevronDown}>
              <Select.Value placeholder='Selecciona un ejercicio...' />
            </Select.Trigger>

            <Adapt when='maxMd' platform='touch'>
              <Sheet native modal dismissOnSnapToBottom animation='medium'>
                <Sheet.Frame>
                  <Sheet.ScrollView>
                    <Adapt.Contents />
                  </Sheet.ScrollView>
                </Sheet.Frame>

                <Sheet.Overlay
                  bg='$shadowColor'
                  animation='lazy'
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                />
              </Sheet>
            </Adapt>

            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton
                style={{
                  position: 'relative',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 24,
                }}
              >
                <View style={{ zIndex: 10 }}>
                  <ChevronUp size={20} />
                </View>

                <LinearGradient
                  start={[0, 0]}
                  end={[0, 1]}
                  fullscreen
                  colors={['$accent10', 'transparent']}
                  style={{
                    borderRadius: 8,
                  }}
                />
              </Select.ScrollUpButton>

              <Select.Viewport
                style={{
                  minWidth: 200,
                }}
              >
                <Select.Group>
                  {unSelectedExercises.map((exercise, idx) => (
                    <Select.Item
                      index={idx}
                      key={exercise.id}
                      value={exercise.id}
                    >
                      <Select.ItemText style={{ fontSize: 14 }}>
                        {exercise.name}
                      </Select.ItemText>

                      <Select.ItemIndicator marginLeft='auto'>
                        <Check size={16} color='$accent10' />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>

              <Select.ScrollDownButton>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: 24 }}>
                  <ChevronDown size={20} />
                </View>
              </Select.ScrollDownButton>
            </Select.Content>
          </Select>
        ) : (
          <Text style={{ color: theme.red10.val || '#f87171', fontSize: 14, textAlign: 'center' }}>
            Todos los ejercicios disponibles han sido agregados
          </Text>
        )}
      </View>

      {loading ? (
        <Text style={{ textAlign: 'center', color: theme.accent10.val || '#6b7280' }}>
          Cargando ejercicios...
        </Text>
      ) : (
        <>
          {selectedExercises.length > 0 && (
            <View>
              <Label style={{ fontSize: 12, fontWeight: '600' }}>
                Ejercicios en este día ({selectedExercises.length})
              </Label>

              {selectedExercises.map((selectedExercise, index) => (
                <View
                  key={`${selectedExercise.exerciseId}-${index}`}
                  style={{
                    borderWidth: 1,
                    borderColor: theme.red4.val || '#fca5a5',
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.red11.val || '#b91c1c' }}>
                      {selectedExercise.exerciseName}
                    </Text>

                    <Button
                      size='$2'
                      circular
                      icon={Trash2}
                      bg='$red8'
                      onPress={() => removeExercise(index)}
                    />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Label style={{ fontSize: 12, fontWeight: '600', color: theme.accent10.val || '#6b7280' }}>
                        Sets
                      </Label>

                      <Input
                        value={selectedExercise.sets.toString()}
                        onChangeText={(text) => updateExerciseData(index, 'sets', parseInt(text) || 0)}
                        keyboardType='numeric'
                        focusStyle={{
                          borderColor: '$red8'
                        }}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Label style={{ fontSize: 12, fontWeight: '600', color: theme.accent10.val || '#6b7280' }}>
                        Sets de calentamiento
                      </Label>

                      <Input
                        value={selectedExercise.heatingSets.toString()}
                        onChangeText={(text) => updateExerciseData(index, 'heatingSets', parseInt(text) || 0)}
                        keyboardType='numeric'
                        focusStyle={{
                          borderColor: '$red8'
                        }}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      <View style={{ marginTop: 16, flexDirection: 'column', gap: 12 }}>
        <Button
          theme='red'
          onPress={handleSubmit}
          disabled={loading || !form.name.trim() || selectedExercises.length === 0}
          opacity={loading || !form.name.trim() || selectedExercises.length === 0 ? 0.6 : 1}
        >
          {id === 'new' ? 'Crear día de entrenamiento' : 'Actualizar día de entrenamiento'}
        </Button>

        <Button
          variant='outlined'
          onPress={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
      </View>
    </Container>
  )
}
