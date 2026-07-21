import { Pressable, StyleSheet, Text, View } from 'react-native';

import { itineraryIcons } from '../data/itineraryAssets';
import { colors } from '../theme/colors';

type MapActionBarProps = {
  onPress?: () => void;
};

export function MapActionBar({ onPress }: MapActionBarProps) {
  const Globe = itineraryIcons.globe;
  const ChevR = itineraryIcons.chevR;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.bar, pressed && styles.barPressed]}
    >
      <View style={styles.iconWrap}>
        <Globe width={22} height={22} />
      </View>
      <Text style={styles.label}>View on Map</Text>
      <View style={styles.iconWrap}>
        <ChevR width={20} height={20} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.mapBarBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  barPressed: {
    opacity: 0.9,
  },
  iconWrap: {
    width: 22,
    height: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary,
  },
});
