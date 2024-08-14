import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/default/ParallaxScrollView';
import { ThemedText } from '@/components/default/ThemedText';
import { ThemedView } from '@/components/default/ThemedView';
import GymRat from '@/components/icons/GymRat';

export default function SettingsScreen() {
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
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>GymRat</ThemedText>
        <GymRat />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  gymLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
