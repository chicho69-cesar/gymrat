import { BarChart3, Calendar, Dumbbell, Target, TrendingUp, Weight } from '@tamagui/lucide-icons'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import { LineChart } from 'react-native-svg-charts'
import { Card, Text, useTheme, View, XStack, YStack } from 'tamagui'

import { TimesHelper } from 'config/helpers/times'
import { Exercise } from 'domain/entities/exercise.entity'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'

interface WorkoutStats {
  date: string
  weight: number
  reps: number
  unit: 'Kg' | 'LB'
  volume: number
  workoutId: string
}

export default function WorkoutStatsScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()
  const { exercises } = useExercises()

  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof id === 'string') {
      loadExerciseStats()
    }
  }, [id, exercises])

  const loadExerciseStats = async () => {
    setLoading(true)
    try {
      const foundExercise = exercises.find(ex => ex.id === id)
      setExercise(foundExercise || null)

      // Example data (same as provided)
      const exampleStats: WorkoutStats[] = [
        { date: '01-07-2025', weight: 70, reps: 10, unit: 'Kg', volume: 700, workoutId: 'w1' },
        { date: '05-07-2025', weight: 72.5, reps: 10, unit: 'Kg', volume: 725, workoutId: 'w2' },
        { date: '08-07-2025', weight: 75, reps: 9, unit: 'Kg', volume: 675, workoutId: 'w3' },
        { date: '12-07-2025', weight: 75, reps: 10, unit: 'Kg', volume: 750, workoutId: 'w4' },
        { date: '15-07-2025', weight: 77.5, reps: 10, unit: 'Kg', volume: 775, workoutId: 'w5' },
        { date: '19-07-2025', weight: 80, reps: 8, unit: 'Kg', volume: 640, workoutId: 'w6' },
        { date: '22-07-2025', weight: 80, reps: 10, unit: 'Kg', volume: 800, workoutId: 'w7' },
        { date: '26-07-2025', weight: 82.5, reps: 10, unit: 'Kg', volume: 825, workoutId: 'w8' },
      ]

      const sortedStats = exampleStats.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-'))
        const dateB = new Date(b.date.split('-').reverse().join('-'))
        return dateA.getTime() - dateB.getTime()
      })

      setWorkoutStats(sortedStats)
    } catch (error) {
      console.error('Error loading exercise stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const [day, month] = dateString.split('-')
    return `${day}/${month}`
  }

  const getChartData = () => {
    if (workoutStats.length === 0) return []
    return workoutStats.map(stat => stat.volume)
  }

  const getWeightChartData = () => {
    if (workoutStats.length === 0) return []
    return workoutStats.map(stat => stat.weight)
  }

  const getStats = () => {
    if (workoutStats.length === 0) return null

    const latestStat = workoutStats[workoutStats.length - 1]
    const firstStat = workoutStats[0]

    const maxVolume = Math.max(...workoutStats.map(s => s.volume))
    const maxWeight = Math.max(...workoutStats.map(s => s.weight))
    const avgVolume = workoutStats.reduce((sum, s) => sum + s.volume, 0) / workoutStats.length

    const weightProgress = latestStat.weight - firstStat.weight
    const volumeProgress = latestStat.volume - firstStat.volume

    return {
      current: latestStat,
      maxVolume,
      maxWeight,
      avgVolume,
      weightProgress,
      volumeProgress,
      totalWorkouts: workoutStats.length,
    }
  }

  const stats = getStats()
  const volumeData = getChartData()
  const weightData = getWeightChartData()
  const labels = workoutStats.map(stat => formatDate(stat.date))
  const screenWidth = Dimensions.get('window').width

  if (loading) {
    return (
      <Container>
        <YStack space="$4">
          <Title text="Estadísticas del ejercicio" />
          <View >
            <Text fontSize="$5" color="$accent10">
              Cargando estadísticas...
            </Text>
          </View>
        </YStack>
      </Container>
    )
  }

  if (!exercise) {
    return (
      <Container>
        <YStack space="$4">
          <Title text="Ejercicio no encontrado" />
          <View >
            <Text fontSize="$5" color="$accent10">
              El ejercicio no existe
            </Text>
          </View>
        </YStack>
      </Container>
    )
  }

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack >
          <Title text={exercise.name} />

          {/* Exercise Info Card */}
          <Card bordered padding="$4" backgroundColor="$accent2">
            <XStack>
              <Dumbbell size={24} color="$red10" />
              <YStack flex={1}>
                <Text fontSize="$5" fontWeight="600" color="$red11">
                  {exercise.name}
                </Text>
                {exercise.description && (
                  <Text fontSize="$3" color="$accent11" >
                    {exercise.description}
                  </Text>
                )}
                <Text fontSize="$3" color="$accent10">
                  Descanso: {TimesHelper.fromSecondsToMinutes(exercise.rest)}
                </Text>
              </YStack>
            </XStack>
          </Card>

          {workoutStats.length > 0 && stats ? (
            <>
              {/* Stats Cards */}
              <XStack space="$3">
                <Card flex={1} bordered padding="$3" backgroundColor="$accent2">
                  <XStack>
                    <Target size={16} color="$red10" />
                    <Text fontSize="$3" fontWeight="600" color="$red11">
                      Último entrenamiento
                    </Text>
                  </XStack>
                  <Text fontSize="$6" fontWeight="700" color="$accent12">
                    {stats.current.weight} {stats.current.unit}
                  </Text>
                  <Text fontSize="$4" color="$accent11">
                    {stats.current.reps} reps
                  </Text>
                  <Text fontSize="$3" color="$accent10">
                    Volumen: {stats.current.volume}
                  </Text>
                </Card>

                <Card flex={1} bordered padding="$3" backgroundColor="$accent2">
                  <XStack>
                    <TrendingUp size={16} color="$green10" />
                    <Text fontSize="$3" fontWeight="600" color="$green11">
                      Progreso
                    </Text>
                  </XStack>
                  <Text fontSize="$5" fontWeight="700" color={stats.weightProgress >= 0 ? "$green11" : "$red11"}>
                    {stats.weightProgress >= 0 ? '+' : ''}{stats.weightProgress} {stats.current.unit}
                  </Text>
                  <Text fontSize="$3" color="$accent11">
                    Peso
                  </Text>
                  <Text fontSize="$2" color={stats.volumeProgress >= 0 ? "$green10" : "$red10"}>
                    Vol: {stats.volumeProgress >= 0 ? '+' : ''}{stats.volumeProgress}
                  </Text>
                </Card>
              </XStack>

              <XStack space="$3">
                <Card flex={1} bordered padding="$3" backgroundColor="$accent2">
                  <XStack >
                    <Weight size={16} color="$blue10" />
                    <Text fontSize="$3" fontWeight="600" color="$blue11">
                      Máximo peso
                    </Text>
                  </XStack>
                  <Text fontSize="$5" fontWeight="700" color="$accent12">
                    {stats.maxWeight} {stats.current.unit}
                  </Text>
                </Card>

                <Card flex={1} bordered padding="$3" backgroundColor="$accent2">
                  <XStack>
                    <BarChart3 size={16} color="$blue10" />
                    <Text fontSize="$3" fontWeight="600" color="$blue11">
                      Máximo volumen
                    </Text>
                  </XStack>
                  <Text fontSize="$5" fontWeight="700" color="$accent12">
                    {stats.maxVolume}
                  </Text>
                </Card>
              </XStack>

              {/* Volume Trend Chart */}
              {volumeData.length > 0 && (
                <Card bordered padding="$4" backgroundColor="$accent2">
                  <YStack space="$3">
                    <XStack>
                      <TrendingUp size={20} color="$red10" />
                      <Text fontSize="$5" fontWeight="600" color="$red11">
                        Tendencia de Volumen (Peso × Reps)
                      </Text>
                    </XStack>
                    <LineChart
                      style={styles.chart}
                      data={volumeData}
                      svg={{ stroke: 'rgba(239, 68, 68, 1)', strokeWidth: 3 }}
                      contentInset={{ top: 20, bottom: 20 }}
                    >
                      {/* Optional: Add grid or labels if needed */}
                    </LineChart>
                    <XStack>
                      {labels.map((label, index) => (
                        <Text key={index} fontSize="$2" color="$accent11">
                          {label}
                        </Text>
                      ))}
                    </XStack>
                  </YStack>
                </Card>
              )}

              {/* Weight Trend Chart */}
              {weightData.length > 0 && (
                <Card bordered padding="$4" backgroundColor="$accent2">
                  <YStack space="$3">
                    <XStack>
                      <Weight size={20} color="$green10" />
                      <Text fontSize="$5" fontWeight="600" color="$green11">
                        Tendencia de Peso ({stats.current.unit})
                      </Text>
                    </XStack>
                    <LineChart
                      style={styles.chart}
                      data={weightData}
                      svg={{ stroke: 'rgba(34, 197, 94, 1)', strokeWidth: 3 }}
                      contentInset={{ top: 20, bottom: 20 }}
                    >
                      {/* Optional: Add grid or labels if needed */}
                    </LineChart>
                    <XStack>
                      {labels.map((label, index) => (
                        <Text key={index} fontSize="$2" color="$accent11">
                          {label}
                        </Text>
                      ))}
                    </XStack>
                  </YStack>
                </Card>
              )}

              {/* Summary */}
              <Card bordered padding="$4" backgroundColor="$accent2">
                <YStack space="$2">
                  <XStack>
                    <Calendar size={16} color="$accent10" />
                    <Text fontSize="$4" fontWeight="600" color="$accent12">
                      Resumen de entrenamientos
                    </Text>
                  </XStack>
                  <Text fontSize="$3" color="$accent11">
                    Total de entrenamientos: {stats.totalWorkouts}
                  </Text>
                  <Text fontSize="$3" color="$accent11">
                    Volumen promedio: {Math.round(stats.avgVolume)} {stats.current.unit}
                  </Text>
                  <Text fontSize="$3" color="$accent11">
                    Unidad utilizada: {stats.current.unit}
                  </Text>
                </YStack>
              </Card>
            </>
          ) : (
            <Card bordered padding="$6" backgroundColor="$accent2">
              <YStack>
                <BarChart3 size={48} color="$accent8" />
                <Text fontSize="$5" fontWeight="600" color="$accent10">
                  No hay datos disponibles
                </Text>
                <Text fontSize="$3" color="$accent9">
                  Completa entrenamientos con este ejercicio para ver las estadísticas
                </Text>
              </YStack>
            </Card>
          )}
        </YStack>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  chart: {
    height: 220,
    width: Dimensions.get('window').width - 80,
    marginVertical: 8,
  },
})
