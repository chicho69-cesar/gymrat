import { Ionicons } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { StyleSheet } from 'react-native'
import { Text, View } from 'tamagui'

interface CustomLinkProps {
  href: string
  link: string
  iconName?: string
  iconSize?: number
  iconPosition?: 'left' | 'right'
}

export default function CustomLink({ href, link, iconName, iconSize = 16, iconPosition = 'left' }: CustomLinkProps) {
  return (
    <Link href={href as any} asChild>
      <View style={styles.link}>
        {(iconName && iconPosition === 'left') && (
          <Ionicons name={iconName as any} size={iconSize} color={'#ababab'} />
        )}

        <Text style={styles.text}>
          {link}
        </Text>

        {(iconName && iconPosition === 'right') && (
          <Ionicons name={iconName as any} size={iconSize} color={'#ababab'} />
        )}
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  link: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8
  },
  text: {
    fontSize: 16,
    color: '#ababab',
  },
})
