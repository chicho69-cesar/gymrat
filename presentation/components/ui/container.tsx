import { PropsWithChildren } from 'react'
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'

interface ContainerProps extends PropsWithChildren { }

export default function Container({ children }: ContainerProps) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior='padding'
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ height: 10 }} />
          {children}
          <View style={{ height: 10 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 10
  }
})
