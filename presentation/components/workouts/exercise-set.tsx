import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons'
import { ExerciseSet as ExerciseSetType } from 'domain/entities/workout.entity'
import { Input, Label, Select, Text, useTheme, View } from 'tamagui'

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
        marginBottom: 8,
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
            <Select.Trigger iconAfter={ChevronDown} size='$2'>
              <Select.Value />
            </Select.Trigger>

            <Select.Adapt when='sm' platform='touch'>
              <Select.Sheet modal dismissOnSnapToBottom>
                <Select.Sheet.Frame>
                  {/* <Select.SheetContents /> */}
                </Select.Sheet.Frame>
                <Select.Sheet.Overlay />
              </Select.Sheet>
            </Select.Adapt>

            <Select.Content zIndex={200000}>
              <Select.ScrollUpButton >
                <View >
                  <ChevronUp size={20} />
                </View>
              </Select.ScrollUpButton>

              <Select.Viewport >
                <Select.Group>
                  <Select.Item index={1} value='Kg'>
                    <Select.ItemText>Kg</Select.ItemText>
                    <Select.ItemIndicator marginLeft='auto'>
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>

                  <Select.Item index={2} value='LB'>
                    <Select.ItemText>LB</Select.ItemText>
                    <Select.ItemIndicator marginLeft='auto'>
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Group>
              </Select.Viewport>

              <Select.ScrollDownButton>
                <View>
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
