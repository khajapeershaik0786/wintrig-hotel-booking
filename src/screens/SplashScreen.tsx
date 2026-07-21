import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';

type SplashScreenProps = {
  onContinue: () => void;
};

export function SplashScreen({ onContinue }: SplashScreenProps) {
  return (
    <Pressable onPress={onContinue} style={styles.screen}>
      <Image source={{ uri: figmaPrototypeAssets.splashBackground }} style={styles.bgImage} contentFit="cover" />
      <LinearGradient colors={['rgba(59,130,246,0.55)', 'rgba(15,27,52,0.85)']} style={styles.overlay} />

      <View style={styles.logoTile}>
        <Image source={{ uri: figmaPrototypeAssets.splashLogo }} style={styles.logoPlane} contentFit="contain" />
      </View>
      <Text style={styles.title}>Wintrig</Text>
      <Text style={styles.brand}>TRAVEL & EXPLORE</Text>

      <Text style={styles.subtitle}>Your next adventure starts here</Text>
      <View style={styles.dots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1f2e54' },
  bgImage: { ...StyleSheet.absoluteFill },
  overlay: { ...StyleSheet.absoluteFill },
  logoTile: {
    width: 88,
    height: 88,
    borderRadius: 26,
    alignSelf: 'center',
    marginTop: 300,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlane: { width: 44, height: 44 },
  title: {
    marginTop: 22,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 52,
  },
  brand: {
    marginTop: -4,
    textAlign: 'center',
    color: '#c7d6ff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    letterSpacing: 2.5,
  },
  subtitle: {
    position: 'absolute',
    bottom: 108,
    alignSelf: 'center',
    color: '#eaf1ff',
    fontFamily: 'Inter_500Medium',
    fontSize: 22,
  },
  dots: {
    position: 'absolute',
    bottom: 66,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#fff' },
});
