import { Text, useTheme } from 'tamagui'

interface ExerciseHistoryHeaderProps {
  exercisesCount: number
}

export default function ExerciseHistoryHeader({ exercisesCount }: ExerciseHistoryHeaderProps) {
  const theme = useTheme()

  return (
    <>
      <Text
        fontSize='$5'
        color='$accent8'
        fontWeight='600'
        mb='$2'
      >
        Aquí puedes ver todos los ejercicios que has utilizado en tus entrenamientos, ordenados por frecuencia de uso
      </Text>

      <Text
        fontSize='$5'
        fontWeight='600'
        color='$red11'
        mb='$4'
      >
        Ejercicios utilizados ({exercisesCount})
      </Text>
    </>
  )
}
