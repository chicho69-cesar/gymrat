import { ArrowRight, Plus, X } from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'
import { Adapt, Button, Dialog, Label, Paragraph, Sheet, Text, TooltipSimple, Unspaced, useTheme, View } from 'tamagui'

import { WorkoutDay } from 'domain/entities/workout-day.entity'

interface WorkoutDaySelectorProps {
  workoutDays: WorkoutDay[]
  workoutDay?: WorkoutDay
  onSelectWorkoutDay: (value: string) => void
  onAddWorkout: () => Promise<void>
}

export default function WorkoutDaySelector({
  workoutDays,
  workoutDay,
  onSelectWorkoutDay,
  onAddWorkout
}: WorkoutDaySelectorProps) {
  const theme = useTheme()

  return (
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
                    onPress={() => onSelectWorkoutDay(wd.id)}
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
                onPress={onAddWorkout}
                icon={ArrowRight}
              >
                Continuar
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
  )
}
