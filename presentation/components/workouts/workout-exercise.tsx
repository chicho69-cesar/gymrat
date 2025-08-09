import { ChevronDown, ChevronRight, Dumbbell } from '@tamagui/lucide-icons'
import { WorkoutExerciseWithDetails } from 'domain/entities/workout.entity'
import { useState } from 'react'
import { Pressable } from 'react-native'
import { Text, useTheme, View } from 'tamagui'
import ExerciseSet from './exercise-set'

interface WorkoutExerciseProps {
  workoutExercise: WorkoutExerciseWithDetails
  exerciseIndex: number

  updateExerciseSet: (exerciseIndex: number, setIndex: number, field: "weight" | "reps" | "unit", value: string | number) => Promise<void>
  handleInputBlur: (exerciseIndex: number, setIndex: number) => Promise<void>
}

export default function WorkoutExercise({ exerciseIndex, workoutExercise, updateExerciseSet, handleInputBlur }: WorkoutExerciseProps) {
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(true)

  const totalSets = workoutExercise.workoutDayExercise?.sets || 0
  const heatingSets = workoutExercise.workoutDayExercise?.heatingSets || 0

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.red9.val,
        backgroundColor: '$accent1'
      }}
    >
      <Pressable
        style={({ pressed }) => ([
          { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
          pressed && { opacity: 0.7 }
        ])}
        onPress={() => setCollapsed(!collapsed)}
      >
        <Dumbbell size={24} color='$red10' />

        <View flex={1}>
          <Text fontSize='$6' fontWeight='700' color='$red11'>
            {workoutExercise.exercise?.name || 'Ejercicio'}
          </Text>

          <Text fontSize='$3' color='$accent10'>
            {totalSets} sets • {heatingSets} calentamiento
          </Text>
        </View>

        {collapsed ? (
          <ChevronRight size={24} color='$red10' />
        ) : (
          <ChevronDown size={24} color='$red10' />
        )}
      </Pressable>

      {!collapsed && (
        <>
          {heatingSets > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text fontSize='$5' fontWeight='700' color='$yellow11' style={{ marginBottom: 8 }}>
                Sets de calentamiento
              </Text>

              <View style={{ flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: heatingSets }, (_, index) => {
                  const setData = workoutExercise.sets[index] || {
                    id: `heating-${index}`,
                    workoutExerciseId: workoutExercise.id,
                    weight: 0,
                    reps: 0,
                    unit: 'Kg' as const,
                    setNumber: index + 1
                  }

                  return (
                    <ExerciseSet
                      key={setData.id}
                      set={setData}
                      setIndex={index}
                      exerciseIndex={exerciseIndex}
                      isHeatingSet={true}
                      updateExerciseSet={updateExerciseSet}
                      handleInputBlur={handleInputBlur}
                    />
                  )
                })}
              </View>
            </View>
          )}

          <View style={{ marginBottom: 16 }}>
            <Text fontSize='$5' fontWeight='700' color='$red11' style={{ marginBottom: 8 }}>
              Sets de trabajo
            </Text>

            <View style={{ flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: totalSets }, (_, index) => {
                const setData = workoutExercise.sets[index + heatingSets] || {
                  id: `work-${index + heatingSets}`,
                  workoutExerciseId: workoutExercise.id,
                  weight: 0,
                  reps: 0,
                  unit: 'Kg' as const,
                  setNumber: index + 1 + heatingSets
                }

                return (
                  <ExerciseSet
                    key={setData.id}
                    set={setData}
                    setIndex={index + heatingSets}
                    exerciseIndex={exerciseIndex}
                    isHeatingSet={false}
                    updateExerciseSet={updateExerciseSet}
                    handleInputBlur={handleInputBlur}
                  />
                )
              })}
            </View>
          </View>
        </>
      )}
    </View>
  )
}
