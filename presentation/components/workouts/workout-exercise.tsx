import { Dumbbell } from '@tamagui/lucide-icons'
import { WorkoutExerciseWithDetails } from 'domain/entities/workout.entity'
import { Text, View } from 'tamagui'
import ExerciseSet from './exercise-set'

interface WorkoutExerciseProps {
  workoutExercise: WorkoutExerciseWithDetails
  exerciseIndex: number

  updateExerciseSet: (exerciseIndex: number, setIndex: number, field: "weight" | "reps" | "unit", value: string | number) => Promise<void>
  handleInputBlur: (exerciseIndex: number, setIndex: number) => Promise<void>
}

export default function WorkoutExercise({ exerciseIndex, workoutExercise, updateExerciseSet, handleInputBlur }: WorkoutExerciseProps) {
  const totalSets = workoutExercise.workoutDayExercise?.sets || 0
  const heatingSets = workoutExercise.workoutDayExercise?.heatingSets || 0

  return (
    <View
      key={workoutExercise.id}
      borderColor='$red6'
      bg='$accent1'
    >
      <View>
        <Dumbbell size={24} color='$red10' />
        <View flex={1}>
          <Text fontSize='$6' fontWeight='700' color='$red11'>
            {workoutExercise.exercise?.name || 'Ejercicio'}
          </Text>
          <Text fontSize='$3' color='$accent10'>
            {totalSets} sets • {heatingSets} calentamiento
          </Text>
        </View>
      </View>

      <View space='$2'>
        {/* Sets de calentamiento */}
        {heatingSets > 0 && (
          <View space='$2'>
            <Text fontSize='$4' fontWeight='600' color='$yellow11'>
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

              return (
                <ExerciseSet
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
        )}

        {/* Sets normales */}
        <View space='$2'>
          <Text fontSize='$4' fontWeight='600' color='$red11'>
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

            return (
              <ExerciseSet
                set={setData}
                setIndex={setIndex}
                exerciseIndex={exerciseIndex}
                isHeatingSet={false}
                updateExerciseSet={updateExerciseSet}
                handleInputBlur={handleInputBlur}
              />
            )
          })}
        </View>
      </View>
    </View>
  )
}
