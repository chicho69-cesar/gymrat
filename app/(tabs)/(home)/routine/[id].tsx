import { Activity, ArrowRight, Plus, X } from '@tamagui/lucide-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet } from 'react-native'
import { Adapt, Button, Dialog, Label, Paragraph, Sheet, Text, TooltipSimple, Unspaced, useTheme, View } from 'tamagui'

import { Routine } from 'domain/entities/routine.entity'
import { WorkoutDay } from 'domain/entities/workout-day.entity'
import Container from 'presentation/components/ui/container'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutList from 'presentation/components/workouts/workout-list'
import useRoutines from 'presentation/hooks/use-routines'
import useWorkoutDays from 'presentation/hooks/use-workout-days'
import useWorkouts from 'presentation/hooks/use-workouts'

export default function RoutineScreen() {
  const { id } = useLocalSearchParams()
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

  const handleAddWorkout = () => {
    /* TODO: Antes de hacer la navegación, en vez de mandar el id como new, de una vez creo aquí el workout */
    router.push(`/workout/new?routineId=${id}&workoutDayId=${workoutDay?.id || 'new'}`)
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

      <Dialog modal>
        <Dialog.Trigger asChild>
          <Button
            size='$4'
            theme='red'
            icon={Plus}
          >
            <Button.Text>
              Crear entrenamiento
            </Button.Text>
          </Button>
        </Dialog.Trigger>

        <Adapt when='maxMd' platform='touch'>
          <Sheet
            animation='medium'
            zIndex={200000}
            modal
            dismissOnSnapToBottom
            unmountChildrenWhenHidden
          >
            <Sheet.Frame p='$4' gap='$4'>
              <Adapt.Contents />
            </Sheet.Frame>

            <Sheet.Overlay
              bg='$shadow6'
              animation='lazy'
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Dialog.Portal>
          <Dialog.Overlay
            key='overlay'
            bg='$shadow6'
            animateOnly={['transform', 'opacity']}
            animation={[
              'quicker',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />

          <Dialog.FocusScope focusOnIdle>
            <Dialog.Content
              bordered
              py='$4'
              px='$6'
              elevate
              key='content'
              animateOnly={['transform', 'opacity']}
              animation={[
                'quicker',
                {
                  opacity: {
                    overshootClamping: true,
                  },
                },
              ]}
              enterStyle={{ x: 0, y: 20, opacity: 0 }}
              exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
              gap='$4'
            >
              <Dialog.Title
                color='$red10'
                fontWeight='bold'
                lineHeight='$5'
              >
                Día de entrenamiento
              </Dialog.Title>

              <Dialog.Description
                color='$accent8'
                fontSize='$5'
              >
                Selecciona el día de entrenamiento con el que deseas continuar.
              </Dialog.Description>

              <>
                <Label htmlFor='username'>
                  <TooltipSimple label='Día de entrenamiento' placement='bottom-start'>
                    <Paragraph color='$accent8' fontSize='$4'>
                      Selecciona:
                    </Paragraph>
                  </TooltipSimple>
                </Label>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}
                >
                  {workoutDays.map((wd) => (
                    <Pressable
                      key={wd.id}
                      onPress={() => handleSelectWorkoutDay(wd.id)}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 8,
                        borderRadius: 8,
                        backgroundColor: workoutDay?.id === wd.id ? theme.red10?.val : theme.gray2?.val,
                        marginRight: 8,
                        borderWidth: 1,
                        borderColor: workoutDay?.id === wd.id ? theme.red10?.val : theme.accent10?.val,
                      }}
                    >
                      <Text color={workoutDay?.id === wd.id ? theme.white?.val : theme.gray10?.val}>
                        {wd.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>

              <Dialog.Close displayWhenAdapted asChild>
                <Button
                  theme='red'
                  aria-label='Close'
                  onPress={handleAddWorkout}
                  icon={ArrowRight}
                >
                  Save changes
                </Button>
              </Dialog.Close>

              <Unspaced>
                <Dialog.Close asChild>
                  <Button position='absolute' r='$3' size='$2' circular icon={X} />
                </Dialog.Close>
              </Unspaced>
            </Dialog.Content>
          </Dialog.FocusScope>
        </Dialog.Portal>
      </Dialog>

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
