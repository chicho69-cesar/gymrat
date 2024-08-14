import { Image, StyleSheet } from 'react-native';
import { Button } from 'tamagui';

import WeeklyCalendar from '@/components/core/WeeklyCalendar';
import { HelloWave } from '@/components/default/HelloWave';
import ParallaxScrollView from '@/components/default/ParallaxScrollView';
import { ThemedText } from '@/components/default/ThemedText';
import { ThemedView } from '@/components/default/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#1D3D47', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-gym-logo.png')}
          style={styles.gymLogo}
        />
      }
    >
      <WeeklyCalendar
        onSelectDate={(date) => console.log('Selected Date:', date)}
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>GymRat 🏋️‍♂️</ThemedText>
        <HelloWave />
      </ThemedView>

      {/*  */}

      <Button theme='blue' onPress={() => console.log('Hello World!!!')}>
        Say Hello! 🌟
      </Button>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gymLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
