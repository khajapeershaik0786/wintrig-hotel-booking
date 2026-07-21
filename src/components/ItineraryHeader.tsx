import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { itineraryIcons, itineraryImages } from '../data/itineraryAssets';
import { colors } from '../theme/colors';

type ItineraryHeaderProps = {
  title: string;
  subtitle: string;
  onBack?: () => void;
};

export function ItineraryHeader({ title, subtitle, onBack }: ItineraryHeaderProps) {
  const BackBg = itineraryIcons.backButtonBg;
  const ChevL = itineraryIcons.chevL;

  return (
    <View style={styles.wrapper}>
      <Image source={itineraryImages.header} style={styles.image} contentFit="cover" />
      <LinearGradient
        colors={[colors.overlayStart, colors.overlayEnd]}
        style={styles.gradient}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        style={styles.backButton}
      >
        <BackBg width={40} height={40} />
        <View style={styles.backIcon}>
          <ChevL width={20} height={20} />
        </View>
      </Pressable>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 180,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    ...StyleSheet.absoluteFill,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
  },
  backButton: {
    position: 'absolute',
    top: 56,
    left: 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    overflow: 'hidden',
  },
  textBlock: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 12,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  subtitle: {
    color: colors.headerSubtitle,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
