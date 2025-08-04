import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Button, Input, Label, Text, TextArea, useTheme, View } from 'tamagui'

import { TimesHelper } from 'config/helpers/times'
import { ExerciseDto } from 'domain/dtos/exercise.dto'
import Container from 'presentation/components/ui/container'
import Title from 'presentation/components/ui/title'
import useExercises from 'presentation/hooks/use-exercises'

export default function ExercisesScreen() {
  const { id } = useLocalSearchParams()
  const theme = useTheme()

  const {
    exercises,
    loading,
    error,
    createUpdateExercise,
  } = useExercises()

  const [form, setForm] = useState<ExerciseDto>({
    name: '',
    description: '',
    rest: 120,
  })

  useEffect(() => {
    if (id === 'new') return

    const foundExercise = exercises.find((ex) => ex.id === id)

    if (!foundExercise) {
      router.replace('/exercises')
      return
    }

    setForm({
      name: foundExercise.name,
      description: foundExercise.description,
      rest: foundExercise.rest,
    })
  }, [id, exercises])

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: () => router.back() }])
    }
  }, [error])

  const handleSubmit = async () => {
    await createUpdateExercise(form, typeof id === 'string' ? id : 'new')
    router.back()
  }

  return (
    <Container>
      <Title text={id === 'new' ? 'Nuevo ejercicio' : 'Edita este ejercicio'} />

      <View style={{ marginBottom: 8 }}>
        <Label htmlFor='name' style={{ fontSize: 12, fontWeight: '600' }}>
          Nombre del ejercicio *
        </Label>

        <Input
          id='name'
          placeholder='Ej: Press de banca'
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
          focusStyle={{
            borderColor: '$red8',
          }}
        />
      </View>

      <View style={{ marginBottom: 8 }}>
        <Label htmlFor='description' style={{ fontSize: 12, fontWeight: '600' }}>
          Descripción
        </Label>

        <TextArea
          id='description'
          placeholder='Describe cómo realizar el ejercicio...'
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
          numberOfLines={4}
          focusStyle={{
            borderColor: '$red8',
          }}
        />
      </View>

      <View style={{ marginBottom: 8 }}>
        <Label htmlFor='rest' style={{ fontSize: 12, fontWeight: '600' }}>
          Tiempo de descanso (segundos)
        </Label>

        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 12 }}>
          <Input
            id='rest'
            placeholder='120'
            value={form.rest.toString()}
            onChangeText={(text) => {
              const numValue = parseInt(text) || 0
              setForm({ ...form, rest: numValue })
            }}
            keyboardType='numeric'
            flex={1}
            focusStyle={{
              borderColor: '$red8',
            }}
          />

          <Text style={{ color: theme.color.val || '#000', fontSize: 12, fontWeight: 'bold' }}>
            {TimesHelper.fromSecondsToMinutes(form.rest)}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 16, flexDirection: 'column', gap: 12 }}>
        <Button
          theme='red'
          onPress={handleSubmit}
          disabled={loading || !form.name.trim()}
          opacity={loading || !form.name.trim() ? 0.6 : 1}
        >
          {id === 'new' ? 'Crear ejercicio' : 'Actualizar ejercicio'}
        </Button>

        <Button
          variant='outlined'
          onPress={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
      </View>
    </Container>
  )
}
