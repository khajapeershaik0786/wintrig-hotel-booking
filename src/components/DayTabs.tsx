import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type DayTabsProps = {
  days: { id: string; label: string }[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
};

export function DayTabs({ days, selectedDayId, onSelectDay }: DayTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={styles.scroll}
    >
      {days.map((day) => {
        const selected = day.id === selectedDayId;
        return (
          <Pressable
            key={day.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onSelectDay(day.id)}
            style={[styles.tab, selected ? styles.tabSelected : styles.tabDefault]}
          >
            <Text style={[styles.tabLabel, selected ? styles.tabLabelSelected : styles.tabLabelDefault]}>
              {day.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  row: {
    gap: 10,
    paddingHorizontal: 24,
  },
  tab: {
    minWidth: 58,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tabSelected: {
    backgroundColor: colors.primary,
  },
  tabDefault: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    fontFamily: 'Inter_500Medium',
  },
  tabLabelSelected: {
    color: colors.white,
  },
  tabLabelDefault: {
    color: colors.textSecondary,
  },
});
