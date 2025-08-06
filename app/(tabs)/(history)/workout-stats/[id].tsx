// import { useLocalSearchParams } from 'expo-router'
// import { useEffect, useState } from 'react'
// import { Dimensions, ScrollView, StyleSheet } from 'react-native'
// import { LineChart } from 'react-native-chart-kit'
// import { Text, useTheme, View, XStack, YStack, Card } from 'tamagui'
// import { BarChart3, Dumbbell, TrendingUp, Calendar, Weight, Target } from '@tamagui/lucide-icons'

// import { TimesHelper } from 'config/helpers/times'
// import { Exercise } from 'domain/entities/exercise.entity'
// import { ExerciseSet } from 'domain/entities/workout.entity'
// import Container from 'presentation/components/ui/container'
// import Title from 'presentation/components/ui/title'
// import useExercises from 'presentation/hooks/use-exercises'

// interface WorkoutStats {
//   date: string
//   weight: number
//   reps: number
//   unit: 'Kg' | 'LB'
//   volume: number // weight * reps
//   workoutId: string
// }

// export default function WorkoutStatsScreen() {
//   const { id } = useLocalSearchParams()
//   const theme = useTheme()
//   const { exercises } = useExercises()
  
//   const [exercise, setExercise] = useState<Exercise | null>(null)
//   const [workoutStats, setWorkoutStats] = useState<WorkoutStats[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (typeof id === 'string') {
//       loadExerciseStats()
//     }
//   }, [id, exercises])

//   const loadExerciseStats = async () => {
//     setLoading(true)
//     try {
//       // Encontrar el ejercicio
//       const foundExercise = exercises.find(ex => ex.id === id)
//       setExercise(foundExercise || null)

//       // TODO: Implementar la lógica real para obtener las estadísticas
//       // Por ahora uso datos de ejemplo que muestran progresión
//       const exampleStats: WorkoutStats[] = [
//         {
//           date: '01-07-2025',
//           weight: 70,
//           reps: 10,
//           unit: 'Kg',
//           volume: 700,
//           workoutId: 'w1'
//         },
//         {
//           date: '05-07-2025',
//           weight: 72.5,
//           reps: 10,
//           unit: 'Kg',
//           volume: 725,
//           workoutId: 'w2'
//         },
//         {
//           date: '08-07-2025',
//           weight: 75,
//           reps: 9,
//           unit: 'Kg',
//           volume: 675,
//           workoutId: 'w3'
//         },
//         {
//           date: '12-07-2025',
//           weight: 75,
//           reps: 10,
//           unit: 'Kg',
//           volume: 750,
//           workoutId: 'w4'
//         },
//         {
//           date: '15-07-2025',
//           weight: 77.5,
//           reps: 10,
//           unit: 'Kg',
//           volume: 775,
//           workoutId: 'w5'
//         },
//         {
//           date: '19-07-2025',
//           weight: 80,
//           reps: 8,
//           unit: 'Kg',
//           volume: 640,
//           workoutId: 'w6'
//         },
//         {
//           date: '22-07-2025',
//           weight: 80,
//           reps: 10,
//           unit: 'Kg',
//           volume: 800,
//           workoutId: 'w7'
//         },
//         {
//           date: '26-07-2025',
//           weight: 82.5,
//           reps: 10,
//           unit: 'Kg',
//           volume: 825,
//           workoutId: 'w8'
//         }
//       ]

//       // Ordenar por fecha
//       const sortedStats = exampleStats.sort((a, b) => {
//         const dateA = new Date(a.date.split('-').reverse().join('-'))
//         const dateB = new Date(b.date.split('-').reverse().join('-'))
//         return dateA.getTime() - dateB.getTime()
//       })

//       setWorkoutStats(sortedStats)
//     } catch (error) {
//       console.error('Error loading exercise stats:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const formatDate = (dateString: string) => {
//     const [day, month] = dateString.split('-')
//     return `${day}/${month}`
//   }

//   const getChartData = () => {
//     if (workoutStats.length === 0) return null

//     const labels = workoutStats.map(stat => formatDate(stat.date))
//     const volumeData = workoutStats.map(stat => stat.volume)
//     const weightData = workoutStats.map(stat => stat.weight)

//     return {
//       labels,
//       datasets: [
//         {
//           data: volumeData,
//           color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red color
//           strokeWidth: 3
//         }
//       ]
//     }
//   }

//   const getWeightChartData = () => {
//     if (workoutStats.length === 0) return null

//     const labels = workoutStats.map(stat => formatDate(stat.date))
//     const weightData = workoutStats.map(stat => stat.weight)

//     return {
//       labels,
//       datasets: [
//         {
//           data: weightData,
//           color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`, // Green color
//           strokeWidth: 3
//         }
//       ]
//     }
//   }

//   const getStats = () => {
//     if (workoutStats.length === 0) return null

//     const latestStat = workoutStats[workoutStats.length - 1]
//     const firstStat = workoutStats[0]
    
//     const maxVolume = Math.max(...workoutStats.map(s => s.volume))
//     const maxWeight = Math.max(...workoutStats.map(s => s.weight))
//     const avgVolume = workoutStats.reduce((sum, s) => sum + s.volume, 0) / workoutStats.length
    
//     const weightProgress = latestStat.weight - firstStat.weight
//     const volumeProgress = latestStat.volume - firstStat.volume

//     return {
//       current: latestStat,
//       maxVolume,
//       maxWeight,
//       avgVolume,
//       weightProgress,
//       volumeProgress,
//       totalWorkouts: workoutStats.length
//     }
//   }

//   const stats = getStats()
//   const chartData = getChartData()
//   const weightChartData = getWeightChartData()
//   const screenWidth = Dimensions.get('window').width

//   if (loading) {
//     return (
//       <Container>
//         <YStack space="$4">
//           <Title text="Estadísticas del ejercicio" />
//           <View flex={1} justifyContent="center" alignItems="center">
//             <Text fontSize="$5" color="$gray10">
//               Cargando estadísticas...
//             </Text>
//           </View>
//         </YStack>
//       </Container>
//     )
//   }

//   if (!exercise) {
//     return (
//       <Container>
//         <YStack space="$4">
//           <Title text="Ejercicio no encontrado" />
//           <View flex={1} justifyContent="center" alignItems="center">
//             <Text fontSize="$5" color="$gray10">
//               El ejercicio no existe
//             </Text>
//           </View>
//         </YStack>
//       </Container>
//     )
//   }

//   return (
//     <Container>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <YStack space="$4" paddingBottom="$6">
//           <Title text={exercise.name} />

//           {/* Exercise Info Card */}
//           <Card bordered padding="$4" backgroundColor="$gray2">
//             <XStack alignItems="center" space="$3" marginBottom="$3">
//               <Dumbbell size={24} color="$red10" />
//               <YStack flex={1}>
//                 <Text fontSize="$5" fontWeight="600" color="$red11">
//                   {exercise.name}
//                 </Text>
//                 {exercise.description && (
//                   <Text fontSize="$3" color="$gray11" marginTop="$1">
//                     {exercise.description}
//                   </Text>
//                 )}
//                 <Text fontSize="$3" color="$gray10" marginTop="$1">
//                   Descanso: {TimesHelper.fromSecondsToMinutes(exercise.rest)}
//                 </Text>
//               </YStack>
//             </XStack>
//           </Card>

//           {workoutStats.length > 0 && stats ? (
//             <>
//               {/* Stats Cards */}
//               <XStack space="$3">
//                 <Card flex={1} bordered padding="$3" backgroundColor="$gray2">
//                   <XStack alignItems="center" space="$2" marginBottom="$2">
//                     <Target size={16} color="$red10" />
//                     <Text fontSize="$3" fontWeight="600" color="$red11">
//                       Último entrenamiento
//                     </Text>
//                   </XStack>
//                   <Text fontSize="$6" fontWeight="700" color="$gray12">
//                     {stats.current.weight} {stats.current.unit}
//                   </Text>
//                   <Text fontSize="$4" color="$gray11">
//                     {stats.current.reps} reps
//                   </Text>
//                   <Text fontSize="$3" color="$gray10">
//                     Volumen: {stats.current.volume}
//                   </Text>
//                 </Card>

//                 <Card flex={1} bordered padding="$3" backgroundColor="$gray2">
//                   <XStack alignItems="center" space="$2" marginBottom="$2">
//                     <TrendingUp size={16} color="$green10" />
//                     <Text fontSize="$3" fontWeight="600" color="$green11">
//                       Progreso
//                     </Text>
//                   </XStack>
//                   <Text fontSize="$5" fontWeight="700" color={stats.weightProgress >= 0 ? "$green11" : "$red11"}>
//                     {stats.weightProgress >= 0 ? '+' : ''}{stats.weightProgress} {stats.current.unit}
//                   </Text>
//                   <Text fontSize="$3" color="$gray11">
//                     Peso
//                   </Text>
//                   <Text fontSize="$2" color={stats.volumeProgress >= 0 ? "$green10" : "$red10"}>
//                     Vol: {stats.volumeProgress >= 0 ? '+' : ''}{stats.volumeProgress}
//                   </Text>
//                 </Card>
//               </XStack>

//               <XStack space="$3">
//                 <Card flex={1} bordered padding="$3" backgroundColor="$gray2">
//                   <XStack alignItems="center" space="$2" marginBottom="$2">
//                     <Weight size={16} color="$blue10" />
//                     <Text fontSize="$3" fontWeight="600" color="$blue11">
//                       Máximo peso
//                     </Text>
//                   </XStack>
//                   <Text fontSize="$5" fontWeight="700" color="$gray12">
//                     {stats.maxWeight} {stats.current.unit}
//                   </Text>
//                 </Card>

//                 <Card flex={1} bordered padding="$3" backgroundColor="$gray2">
//                   <XStack alignItems="center" space="$2" marginBottom="$2">
//                     <BarChart3 size={16} color="$purple10" />
//                     <Text fontSize="$3" fontWeight="600" color="$purple11">
//                       Máximo volumen
//                     </Text>
//                   </XStack>
//                   <Text fontSize="$5" fontWeight="700" color="$gray12">
//                     {stats.maxVolume}
//                   </Text>
//                 </Card>
//               </XStack>

//               {/* Volume Trend Chart */}
//               {chartData && (
//                 <Card bordered padding="$4" backgroundColor="$gray2">
//                   <YStack space="$3">
//                     <XStack alignItems="center" space="$2">
//                       <TrendingUp size={20} color="$red10" />
//                       <Text fontSize="$5" fontWeight="600" color="$red11">
//                         Tendencia de Volumen (Peso × Reps)
//                       </Text>
//                     </XStack>
                    
//                     <LineChart
//                       data={chartData}
//                       width={screenWidth - 80}
//                       height={220}
//                       chartConfig={{
//                         backgroundColor: theme.gray1?.val || '#fafafa',
//                         backgroundGradientFrom: theme.gray1?.val || '#fafafa',
//                         backgroundGradientTo: theme.gray2?.val || '#f4f4f5',
//                         decimalPlaces: 0,
//                         color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
//                         labelColor: (opacity = 1) => theme.gray11?.val || `rgba(113, 113, 122, ${opacity})`,
//                         style: {
//                           borderRadius: 16
//                         },
//                         propsForDots: {
//                           r: "6",
//                           strokeWidth: "2",
//                           stroke: theme.red8?.val || "#dc2626"
//                         }
//                       }}
//                       bezier
//                       style={styles.chart}
//                     />
//                   </YStack>
//                 </Card>
//               )}

//               {/* Weight Trend Chart */}
//               {weightChartData && (
//                 <Card bordered padding="$4" backgroundColor="$gray2">
//                   <YStack space="$3">
//                     <XStack alignItems="center" space="$2">
//                       <Weight size={20} color="$green10" />
//                       <Text fontSize="$5" fontWeight="600" color="$green11">
//                         Tendencia de Peso ({stats.current.unit})
//                       </Text>
//                     </XStack>
                    
//                     <LineChart
//                       data={weightChartData}
//                       width={screenWidth - 80}
//                       height={220}
//                       chartConfig={{
//                         backgroundColor: theme.gray1?.val || '#fafafa',
//                         backgroundGradientFrom: theme.gray1?.val || '#fafafa',
//                         backgroundGradientTo: theme.gray2?.val || '#f4f4f5',
//                         decimalPlaces: 1,
//                         color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
//                         labelColor: (opacity = 1) => theme.gray11?.val || `rgba(113, 113, 122, ${opacity})`,
//                         style: {
//                           borderRadius: 16
//                         },
//                         propsForDots: {
//                           r: "6",
//                           strokeWidth: "2",
//                           stroke: theme.green8?.val || "#16a34a"
//                         }
//                       }}
//                       bezier
//                       style={styles.chart}
//                     />
//                   </YStack>
//                 </Card>
//               )}

//               {/* Summary */}
//               <Card bordered padding="$4" backgroundColor="$gray2">
//                 <YStack space="$2">
//                   <XStack alignItems="center" space="$2">
//                     <Calendar size={16} color="$gray10" />
//                     <Text fontSize="$4" fontWeight="600" color="$gray12">
//                       Resumen de entrenamientos
//                     </Text>
//                   </XStack>
//                   <Text fontSize="$3" color="$gray11">
//                     Total de entrenamientos: {stats.totalWorkouts}
//                   </Text>
//                   <Text fontSize="$3" color="$gray11">
//                     Volumen promedio: {Math.round(stats.avgVolume)} {stats.current.unit}
//                   </Text>
//                   <Text fontSize="$3" color="$gray11">
//                     Unidad utilizada: {stats.current.unit}
//                   </Text>
//                 </YStack>
//               </Card>
//             </>
//           ) : (
//             <Card bordered padding="$6" backgroundColor="$gray2">
//               <YStack alignItems="center" space="$3">
//                 <BarChart3 size={48} color="$gray8" />
//                 <Text fontSize="$5" fontWeight="600" color="$gray10" textAlign="center">
//                   No hay datos disponibles
//                 </Text>
//                 <Text fontSize="$3" color="$gray9" textAlign="center">
//                   Completa entrenamientos con este ejercicio para ver las estadísticas
//                 </Text>
//               </YStack>
//             </Card>
//           )}
//         </YStack>
//       </ScrollView>
//     </Container>
//   )
// }

// const styles = StyleSheet.create({
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
// })

export default function Index() {
  return <></>
}
