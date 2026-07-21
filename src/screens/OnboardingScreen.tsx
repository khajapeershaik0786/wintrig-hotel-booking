import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';
import { colors } from '../theme/colors';

type OnboardingScreenProps = {
  onGetStarted: () => void;
  onHaveAccount: () => void;
};

export function OnboardingScreen({ onGetStarted, onHaveAccount }: OnboardingScreenProps) {
  return (
    <View style={styles.screen}>
      <Image source={{ uri: figmaPrototypeAssets.onboardingBackground }} style={styles.bg} contentFit="cover" />
      <LinearGradient colors={['rgba(14,27,46,0.05)', 'rgba(14,27,46,0.35)', 'rgba(10,20,32,0.92)']} locations={[0, 0.55, 1]} style={styles.overlay} />

      <View style={styles.logoRow}>
        <View style={styles.badge}>
          <Image source={{ uri: figmaPrototypeAssets.logoPlane }} style={styles.plane} contentFit="contain" />
        </View>
        <View>
          <Text style={styles.logoTitle}>Wintrig</Text>
          <Text style={styles.logoSub}>TRAVEL & EXPLORE</Text>
        </View>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.headline}>Explore the world{'\n'}with Wintrig</Text>
        <Text style={styles.description}>
          Discover breathtaking destinations, book trips, and create unforgettable memories — all in one place.
        </Text>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Pressable onPress={onGetStarted} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Get Started</Text>
        </Pressable>
        <Pressable onPress={onHaveAccount}>
          <Text style={styles.loginLink}>I already have an account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0e1b2e' },
  bg: { ...StyleSheet.absoluteFill },
  overlay: { ...StyleSheet.absoluteFill },
  logoRow: { position: 'absolute', top: 64, left: 24, flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: { width: 54, height: 54, borderRadius: 16, backgroundColor: '#2e7df6', alignItems: 'center', justifyContent: 'center' },
  plane: { width: 26, height: 26 },
  logoTitle: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.6 },
  logoSub: { color: '#6e7891', fontFamily: 'Inter_600SemiBold', fontSize: 9, letterSpacing: 1.2 },
  bottom: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 28, paddingBottom: 28 },
  headline: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 34, lineHeight: 41 },
  description: { color: '#c9d4e3', fontFamily: 'Inter_400Regular', fontSize: 15, marginTop: 14, lineHeight: 22 },
  dots: { flexDirection: 'row', gap: 8, marginTop: 20 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { width: 22, borderRadius: 3, backgroundColor: '#fff' },
  primaryButton: {
    height: 56, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 20,
    shadowColor: '#2e7df6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.45, shadowRadius: 20, elevation: 3,
  },
  primaryText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  loginLink: { color: '#c9d4e3', fontFamily: 'Inter_500Medium', fontSize: 14, textAlign: 'center', marginTop: 14 },
});
