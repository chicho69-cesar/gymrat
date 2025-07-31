import { StyleProp, StyleSheet } from 'react-native'
import { Text } from 'tamagui'

interface TitleProps {
  text: string
  style?: StyleProp<any>
}

export default function Title({ text, style }: TitleProps) {
  return (
    <Text
      style={[
        styles.title,
        style,
      ]}
    >
      {text}
    </Text>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  }
})
