import { StyleSheet, Text, View } from 'react-native';

import type { ItineraryActivity } from '../types/itinerary';
import { colors } from '../theme/colors';

type TimelineItemProps = {
  activity: ItineraryActivity;
  isLast: boolean;
};

export function TimelineItem({ activity, isLast }: TimelineItemProps) {
  const { Dot, Icon } = activity;

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={styles.dotWrap}>
          <Dot width={14} height={14} />
        </View>
        {!isLast ? <View style={styles.line} /> : null}
      </View>

      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={[styles.time, { color: activity.accentColor }]}>{activity.time}</Text>
          <View style={[styles.iconBadge, { backgroundColor: activity.iconBackground }]}>
            <Icon width={18} height={18} />
          </View>
        </View>
        <Text style={styles.title}>{activity.title}</Text>
        <Text style={styles.description}>{activity.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 18,
  },
  rail: {
    width: 14,
    alignItems: 'center',
  },
  dotWrap: {
    width: 14,
    height: 14,
    overflow: 'hidden',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    minHeight: 72,
  },
  card: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
    minHeight: 96,
    shadowColor: '#1a2640',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  time: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 11.5,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.textMuted,
  },
});
