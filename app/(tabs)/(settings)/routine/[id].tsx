import { ArrowDown, ArrowUp, Check, ChevronDown, ChevronUp, Trash2 } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Alert } from 'react-native'
import { Adapt, Button, Input, Label, Select, Sheet, Text, TextArea, useTheme, View } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import { RoutineDto } from 'domain/dtos/routine.dto'
import { CircuitWorkout } from 'domain/entities/routine.entity'
import { SelectedWorkoutDay } from 'infrastructure/interfaces/selected-workout-day.interface'
import { SelectedWorkoutDayMapper } from 'infrastructure/mappers/selected-workout-day.mapper'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import useRoutines from 'presentation/hooks/use-routines'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

export default function RoutineSettingsScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()

  const { workoutDays } = useWorkoutDays()
  const {
    routines,
    routineCircuits,
    loading,
    error,
    createUpdateRoutine,
    fetchRoutineCircuits
  } = useRoutines()

  const [selectedWorkoutDays, setSelectedWorkoutDays] = useState<SelectedWorkoutDay[]>([])
  const [form, setForm] = useState<RoutineDto>({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (id === 'new') return

    const foundRoutine = routines.find((r) => r.id === id)

    if (!foundRoutine) {
      router.replace('/routine')
      return
    }

    setForm({
      name: foundRoutine.name,
      description: foundRoutine.description,
    })

    if (typeof id === 'string') {
      fetchRoutineCircuits(id)
    }
  }, [id, routines])

  useEffect(() => {
    if (routineCircuits.length > 0) {
      const circuitsWithNames = routineCircuits
        .sort((a, b) => a.orderNumber - b.orderNumber)
        .map((circuit) => {
          const workoutDay = workoutDays.find((wd) => wd.id === circuit.workoutDayId)
          return SelectedWorkoutDayMapper.fromEntity(circuit, workoutDay?.name || 'Día no encontrado')
        })

      setSelectedWorkoutDays(circuitsWithNames)
    }
  }, [routineCircuits, workoutDays])

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => router.back() }])
    }
  }, [error])

  const addWorkoutDay = (workoutDayId: string) => {
    const workoutDay = workoutDays.find((wd) => wd.id === workoutDayId)
    if (!workoutDay) return

    const newSelectedWorkoutDay: SelectedWorkoutDay = {
      id: 'new',
      workoutDayId: workoutDayId,
      routineId: typeof id === 'string' ? id : 'new',
      workoutDayName: workoutDay.name,
      orderNumber: selectedWorkoutDays.length + 1,
    }

    setSelectedWorkoutDays([...selectedWorkoutDays, newSelectedWorkoutDay])
  }

  const removeWorkoutDay = (index: number) => {
    const newSelectedWorkoutDays = selectedWorkoutDays.filter((_, i) => i !== index)

    const reorderedWorkoutDays = newSelectedWorkoutDays.map((wd, idx) => ({
      ...wd,
      orderNumber: idx + 1
    }))

    setSelectedWorkoutDays(reorderedWorkoutDays)
  }

  const moveWorkoutDay = (index: number, direction: 'up' | 'down') => {
    const newSelectedWorkoutDays = [...selectedWorkoutDays]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSelectedWorkoutDays.length) return

    const temp = newSelectedWorkoutDays[index]
    newSelectedWorkoutDays[index] = newSelectedWorkoutDays[targetIndex]
    newSelectedWorkoutDays[targetIndex] = temp

    const reorderedWorkoutDays = newSelectedWorkoutDays.map((wd, idx) => ({
      ...wd,
      orderNumber: idx + 1
    }))

    setSelectedWorkoutDays(reorderedWorkoutDays)
  }

  const handleSubmit = async () => {
    const circuitWorkouts: CircuitWorkout[] = selectedWorkoutDays.map((swd) => {
      return SelectedWorkoutDayMapper.toEntity({
        ...swd,
        routineId: typeof id === 'string' ? id : 'new',
      })
    })

    await createUpdateRoutine(form, circuitWorkouts, typeof id === 'string' ? id : 'new')
    router.back()
  }

  const unselectedWorkoutDays = useMemo(() => {
    return workoutDays.filter((workoutDay) =>
      !selectedWorkoutDays.some((swd) => swd.workoutDayId === workoutDay.id)
    )
  }, [workoutDays, selectedWorkoutDays])

  return (
    <Container>
      <Title text={id === 'new' ? 'Nueva rutina' : 'Editar rutina'} />

      <View style={{ marginBottom: 8 }}>
        <Label htmlFor='name' style={{ fontSize: 12, fontWeight: '600' }}>
          Nombre de la rutina *
        </Label>

        <Input
          id='name'
          placeholder='Ej: Rutina de Fuerza'
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
          placeholder='Describe el objetivo de esta rutina...'
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
          Agregar días de entrenamiento
        </Label>

        {unselectedWorkoutDays.length > 0 ? (
          <Select value='' onValueChange={addWorkoutDay}>
            <Select.Trigger iconAfter={ChevronDown}>
              <Select.Value placeholder='Selecciona un día de entrenamiento...' />
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
                  {unselectedWorkoutDays.map((workoutDay, idx) => (
                    <Select.Item
                      index={idx}
                      key={workoutDay.id}
                      value={workoutDay.id}
                    >
                      <Select.ItemText style={{ fontSize: 14 }}>
                        {workoutDay.name}
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
            Todos los días de entrenamiento disponibles han sido agregados
          </Text>
        )}
      </View>

      {loading ? (
        <Text style={{ textAlign: 'center', color: theme.accent10.val || '#6b7280' }}>
          Cargando ejercicios...
        </Text>
      ) : (
        <>
          {selectedWorkoutDays.length > 0 && (
            <View>
              <Label style={{ fontSize: 12, fontWeight: '600' }}>
                Días en esta rutina ({selectedWorkoutDays.length})
              </Label>

              {selectedWorkoutDays.map((selectedWorkoutDay, index) => (
                <View
                  key={`${selectedWorkoutDay.workoutDayId}-${index}`}
                  style={{
                    borderWidth: 1,
                    borderColor: theme.red4.val || '#fca5a5',
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <View style={{ flex: 1, flexDirection: 'column', gap: 4 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: theme.red11.val || '#b91c1c' }}>
                        {selectedWorkoutDay.workoutDayName}
                      </Text>

                      <Text style={{ fontSize: 12, color: theme.accent10.val || '#efefef' }}>
                        Día {selectedWorkoutDay.orderNumber}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Button
                        size='$2'
                        circular
                        icon={ArrowUp}
                        bg='$blue8'
                        disabled={index === 0}
                        opacity={index === 0 ? 0.5 : 1}
                        onPress={() => moveWorkoutDay(index, 'up')}
                      />

                      <Button
                        size='$2'
                        circular
                        icon={ArrowDown}
                        bg='$blue8'
                        disabled={index === selectedWorkoutDays.length - 1}
                        opacity={index === selectedWorkoutDays.length - 1 ? 0.5 : 1}
                        onPress={() => moveWorkoutDay(index, 'down')}
                      />

                      <Button
                        size='$2'
                        circular
                        icon={Trash2}
                        bg='$red8'
                        onPress={() => removeWorkoutDay(index)}
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
          disabled={loading || !form.name.trim() || selectedWorkoutDays.length === 0}
          opacity={loading || !form.name.trim() || selectedWorkoutDays.length === 0 ? 0.6 : 1}
        >
          {id === 'new' ? 'Crear rutina' : 'Actualizar rutina'}
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
