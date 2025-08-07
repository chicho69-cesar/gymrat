import ExerciseList from 'presentation/components/exercises/exercise-list'
import RoutinesList from 'presentation/components/routines/routines-list'
import Container from 'presentation/components/ui/container'
import CustomLink from 'presentation/components/ui/custom-link'
import EmptyMessage from 'presentation/components/ui/empty-message'
import FullScreenLoader from 'presentation/components/ui/full-screen-loader'
import Title from 'presentation/components/ui/title'
import WorkoutDaysList from 'presentation/components/workout-days/workout-days-list'
import useExercises from 'presentation/hooks/use-exercises'
import useRoutines from 'presentation/hooks/use-routines'
import useWorkoutDays from 'presentation/hooks/use-workout-days'

export default function SettingsScreen() {
  const { topExercises, loading: exercisesLoading } = useExercises()
  const { lastRoutines, loading: routinesLoading } = useRoutines()
  const { mostFrequents, loading: workoutsLoading } = useWorkoutDays()

  return (
    <Container>
      <>
        <Title text='Rutinas recientes' />

        <CustomLink
          href='/routine'
          link='Ver todas las rutinas'
          iconName='arrow-forward-circle-outline'
          iconSize={20}
          iconPosition='right'
        />

        {routinesLoading ? (
          <FullScreenLoader />
        ) : lastRoutines.length > 0 ? (
          <RoutinesList routines={lastRoutines} />
        ) : (
          <EmptyMessage
            title='No hay rutinas recientes'
            description='Crea o accede a una rutina para comenzar.'
          />
        )}
      </>

      <>
        <Title text='Ejercicios más realizados' />

        <CustomLink
          href='/exercises'
          link='Ver todos los ejercicios'
          iconName='arrow-forward-circle-outline'
          iconSize={20}
          iconPosition='right'
        />

        {exercisesLoading ? (
          <FullScreenLoader />
        ) : topExercises.length > 0 ? (
          <ExerciseList exercises={topExercises} />
        ) : (
          <EmptyMessage
            title='No hay ejercicios registrados'
            description='Registra tus ejercicios para verlos aquí.'
          />
        )}
      </>

      <>
        <Title text='Días de entrenamiento más frecuentes' />

        <CustomLink
          href='/workout-days'
          link='Ver todos los días de entrenamiento'
          iconName='arrow-forward-circle-outline'
          iconSize={20}
          iconPosition='right'
        />

        {workoutsLoading ? (
          <FullScreenLoader />
        ) : mostFrequents.length > 0 ? (
          <WorkoutDaysList workoutDays={mostFrequents} />
        ) : (
          <EmptyMessage
            title='No hay días de entrenamiento frecuentes'
            description='Comienza a registrar tus días de entrenamiento para verlos aquí.'
          />
        )}
      </>
    </Container>
  )
}
