import { Dumbbell } from '@tamagui/lucide-icons'
import { StyleSheet } from 'react-native'
import { Text, useTheme, View } from 'tamagui'

interface EmptyMessageProps {
  title: string
  description: string
}

export default function EmptyMessage({ description, title }: EmptyMessageProps) {
  const theme = useTheme()

  return (
    <View style={styles.emptyState}>
      <Dumbbell
        size={64}
        color={theme.gray8?.val || '#71717a'}
      />

      <Text
        fontSize='$6'
        fontWeight='600'
        color={theme.gray10?.val || '#a1a1aa'}
        style={{ marginBottom: 4, marginTop: 16, textAlign: 'center' }}
      >
        {title}
      </Text>

      <Text
        fontSize='$4'
        color={theme.gray9?.val || '#84848a'}
        style={{ textAlign: 'center' }}
      >
        {description}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
})