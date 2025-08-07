import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { ExerciseSet as ExerciseSetType } from 'domain/entities/workout.entity'
import { Adapt, Input, Label, Select, Sheet, Text, useTheme, View } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

interface ExerciseSetProps {
  set: ExerciseSetType
  setIndex: number
  exerciseIndex: number
  isHeatingSet?: boolean

  updateExerciseSet: (exerciseIndex: number, setIndex: number, field: "weight" | "reps" | "unit", value: string | number) => Promise<void>
  handleInputBlur: (exerciseIndex: number, setIndex: number) => Promise<void>
}

export default function ExerciseSet({
  set,
  setIndex,
  exerciseIndex,
  isHeatingSet = false,
  updateExerciseSet,
  handleInputBlur
}: ExerciseSetProps) {
  const theme = useTheme()

  return (
    <View
      key={set.id}
      bg={isHeatingSet ? '$yellow3' : '$black3'}
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        width: '100%',
        borderWidth: 1,
        borderColor: isHeatingSet ? theme.yellow8.val : theme.accent8.val
      }}
    >
      <Text
        fontSize='$4'
        fontWeight='700'
        color={isHeatingSet ? '$yellow11' : '$accent5'}
      >
        {isHeatingSet ? 'C' : set.setNumber}
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
        <View flex={1}>
          <Label fontSize='$3' color='$accent8'>Peso</Label>

          <Input
            value={set.weight.toString()}
            onChangeText={(text) => updateExerciseSet(exerciseIndex, setIndex, 'weight', text)}
            onBlur={() => handleInputBlur(exerciseIndex, setIndex)}
            keyboardType='decimal-pad'
            borderColor='$accent6'
            focusStyle={{ borderColor: '$red8' }}
          />
        </View>

        <View flex={1}>
          <Label fontSize='$3' color='$accent8'>Reps</Label>

          <Input
            value={set.reps.toString()}
            onChangeText={(text) => updateExerciseSet(exerciseIndex, setIndex, 'reps', text)}
            onBlur={() => handleInputBlur(exerciseIndex, setIndex)}
            keyboardType='number-pad'
            borderColor='$accent6'
            focusStyle={{ borderColor: '$red8' }}
          />
        </View>

        <View>
          <Label fontSize='$3' color='$accent8'>Unidad</Label>

          <Select
            value={set.unit}
            onValueChange={(value) => updateExerciseSet(exerciseIndex, setIndex, 'unit', value)}
          >
            <Select.Trigger iconAfter={ChevronDown}>
              <Select.Value placeholder='Selecciona la unidad de medida...' />
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
                  <Select.Item index={1} value={'Kg'}>
                    <Select.ItemText style={{ fontSize: 14 }}>
                      Kg
                    </Select.ItemText>

                    <Select.ItemIndicator marginLeft='auto'>
                      <Check size={16} color='$accent10' />
                    </Select.ItemIndicator>
                  </Select.Item>

                  <Select.Item index={2} value={'LB'}>
                    <Select.ItemText style={{ fontSize: 14 }}>
                      LB
                    </Select.ItemText>

                    <Select.ItemIndicator marginLeft='auto'>
                      <Check size={16} color='$accent10' />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Group>
              </Select.Viewport>

              <Select.ScrollDownButton>
                <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: 24 }}>
                  <ChevronDown size={20} />
                </View>
              </Select.ScrollDownButton>
            </Select.Content>
          </Select>
        </View>
      </View>
    </View>
  )
}
