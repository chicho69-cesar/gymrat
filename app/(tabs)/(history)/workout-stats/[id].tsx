import { BarChart3, Calendar, Dumbbell, Target, TrendingUp, Weight } from '@tamagui/lucide-icons'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { LineChart } from 'react-native-svg-charts'
import { Card, Text, useTheme, View } from 'tamagui'

import { TimesHelper } from 'config/helpers/times'
import { Exercise } from 'domain/entities/exercise.entity'
import Container from 'presentation/components/ui/container'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
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
      <FullScreenLoader />
    )
  }

  if (!exercise) {
    return (
      <Container>
        <View style={{ flex: 1, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text fontSize='$5' color='$accent10'>
            El ejercicio no existe
          </Text>
        </View>
      </Container>
    )
  }

  return (
    <Container>
      <Title text={exercise.name} />

      <Card
        bordered
        borderColor='$accent10'
        padding='$4'
        backgroundColor='$shadowColor'
        style={{ marginBottom: 16 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <Dumbbell size={24} color='$accent8' />

          <View flex={1} style={{ flexDirection: 'column', gap: 4 }}>
            <Text fontSize='$5' fontWeight='600' color='$accent8'>
              {exercise.name}
            </Text>

            {exercise.description && (
              <Text fontSize='$3' color='$accent8' >
                {exercise.description}
              </Text>
            )}

            <Text fontSize='$3' color='$accent10' fontWeight='700'>
              Descanso: {TimesHelper.fromSecondsToMinutes(exercise.rest)}
            </Text>
          </View>
        </View>
      </Card>

      {workoutStats.length > 0 && stats ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: 16, marginBottom: 16 }}>
            <Card flex={1} bordered padding='$3' backgroundColor='$shadowColor' borderColor='$red8'>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Target size={16} color='$red10' />

                <Text fontSize='$3' fontWeight='600' color='$red11'>
                  Último entrenamiento
                </Text>
              </View>

              <Text fontSize='$6' fontWeight='700' color='$red10' my='$2'>
                {stats.current.weight} {stats.current.unit}
              </Text>

              <Text fontSize='$4' color='$accent8'>
                {stats.current.reps} reps
              </Text>

              <Text fontSize='$3' color='$accent9' fontWeight='700'>
                Volumen: {stats.current.volume} {stats.current.unit}
              </Text>
            </Card>

            <Card flex={1} bordered padding='$3' backgroundColor='$shadowColor' borderColor={stats.weightProgress >= 0 ? '$green10' : '$red10'}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={16} color='$green10' />

                <Text fontSize='$3' fontWeight='600' color={stats.weightProgress >= 0 ? '$green11' : '$red11'}>
                  Progreso
                </Text>
              </View>

              <Text fontSize='$6' fontWeight='700' color={stats.weightProgress >= 0 ? '$green11' : '$red11'} my='$2'>
                {stats.weightProgress >= 0 ? '+' : ''}{stats.weightProgress} {stats.current.unit}
              </Text>

              <Text fontSize='$4' color='$accent8'>
                Peso
              </Text>

              <Text fontSize='$3' color={stats.volumeProgress >= 0 ? '$green10' : '$red10'} fontWeight='700'>
                Vol: {stats.volumeProgress >= 0 ? '+' : ''}{stats.volumeProgress} {stats.current.unit}
              </Text>
            </Card>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'stretch', gap: 16, marginBottom: 16 }}>
            <Card flex={1} bordered padding='$3' backgroundColor='$shadowColor' borderColor='$blue8'>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Weight size={16} color='$blue9' />

                <Text fontSize='$3' fontWeight='600' color='$blue10'>
                  Máximo peso
                </Text>
              </View>

              <Text fontSize='$5' fontWeight='700' color='$blue11' mt='$2'>
                {stats.maxWeight} {stats.current.unit}
              </Text>
            </Card>

            <Card flex={1} bordered padding='$3' backgroundColor='$shadowColor' borderColor='$blue8'>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <BarChart3 size={16} color='$blue9' />

                <Text fontSize='$3' fontWeight='600' color='$blue10'>
                  Máximo volumen
                </Text>
              </View>

              <Text fontSize='$5' fontWeight='700' color='$blue11' mt='$2'>
                {stats.maxVolume} {stats.current.unit}
              </Text>
            </Card>
          </View>

          {volumeData.length > 0 && (
            <Card
              bordered
              borderColor='$red10'
              padding='$4'
              backgroundColor='$shadowColor'
              style={{ marginBottom: 16 }}
            >
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  <TrendingUp size={20} color='$red10' />

                  <Text fontSize='$5' fontWeight='600' color='$red11'>
                    Tendencia de Volumen (Peso × Reps)
                  </Text>
                </View>

                <LineChart
                  style={styles.chart}
                  data={volumeData}
                  svg={{ stroke: 'rgba(239, 68, 68, 1)', strokeWidth: 3 }}
                  contentInset={{ top: 20, bottom: 20 }}
                >
                  {/* Optional: Add grid or labels if needed */}
                </LineChart>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  {labels.map((label, index) => (
                    <Text key={index} fontSize='$2' color='$accent8' fontWeight='700'>
                      {label}
                    </Text>
                  ))}
                </View>
              </View>
            </Card>
          )}

          {weightData.length > 0 && (
            <Card
              bordered
              borderColor='$green10'
              padding='$4'
              backgroundColor='$shadowColor'
              style={{ marginBottom: 16 }}
            >
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                  <Weight size={20} color='$green10' />

                  <Text fontSize='$5' fontWeight='600' color='$green11'>
                    Tendencia de Peso ({stats.current.unit})
                  </Text>
                </View>

                <LineChart
                  style={styles.chart}
                  data={weightData}
                  svg={{ stroke: 'rgba(34, 197, 94, 1)', strokeWidth: 3 }}
                  contentInset={{ top: 20, bottom: 20 }}
                >
                  {/* Optional: Add grid or labels if needed */}
                </LineChart>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  {labels.map((label, index) => (
                    <Text key={index} fontSize='$2' color='$accent8' fontWeight='700'>
                      {label}
                    </Text>
                  ))}
                </View>
              </View>
            </Card>
          )}

          <Card
            bordered
            borderColor='$accent10'
            padding='$4'
            backgroundColor='$shadowColor'
            style={{ marginBottom: 16 }}
          >
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <Calendar size={16} color='$accent8' />

                <Text fontSize='$5' fontWeight='600' color='$accent8'>
                  Resumen de entrenamientos
                </Text>
              </View>

              <Text fontSize='$3' color='$accent10' fontWeight='700'>
                Total de entrenamientos: {stats.totalWorkouts}
              </Text>

              <Text fontSize='$3' color='$accent10' fontWeight='700'>
                Volumen promedio: {Math.round(stats.avgVolume)} {stats.current.unit}
              </Text>

              <Text fontSize='$3' color='$accent10' fontWeight='700'>
                Unidad utilizada: {stats.current.unit}
              </Text>
            </View>
          </Card>
        </>
      ) : (
        <EmptyMessage
          title='No hay datos disponibles'
          description='Completa entrenamientos con este ejercicio para ver las estadísticas'
        />
      )}
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
