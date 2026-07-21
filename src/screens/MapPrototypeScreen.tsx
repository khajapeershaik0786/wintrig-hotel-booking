import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';

type MapPrototypeScreenProps = {
  onBack: () => void;
};

export function MapPrototypeScreen({ onBack }: MapPrototypeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 12 }]}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>

      <View style={styles.mapCard}>
        <Text style={styles.title}>Map Prototype</Text>
        <Text style={styles.subtitle}>Santorini Escape - Day 1 route preview</Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Map view placeholder</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screenBackground,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    marginBottom: 18,
  },
  backLabel: {
    color: colors.textSecondary,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  mapCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    marginBottom: 6,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginBottom: 14,
  },
  placeholder: {
    height: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c7dbff',
    backgroundColor: '#eaf1ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
});
