import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DayTabs } from '../components/DayTabs';
import { ItineraryHeader } from '../components/ItineraryHeader';
import { MapActionBar } from '../components/MapActionBar';
import { TimelineItem } from '../components/TimelineItem';
import { mockSantoriniItinerary } from '../data/mockItinerary';
import { colors } from '../theme/colors';
import type { TripItinerary } from '../types/itinerary';

type ItineraryScreenProps = {
  itinerary?: TripItinerary;
  onViewMap?: () => void;
  onBack?: () => void;
};

export function ItineraryScreen({
  itinerary = mockSantoriniItinerary,
  onViewMap,
  onBack,
}: ItineraryScreenProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, 480);

  const [selectedDayId, setSelectedDayId] = useState(itinerary.days[0]?.id ?? '');

  useEffect(() => {
    if (!itinerary.days.some((day) => day.id === selectedDayId)) {
      setSelectedDayId(itinerary.days[0]?.id ?? '');
    }
  }, [itinerary.days, selectedDayId]);

  const selectedDay = useMemo(
    () => itinerary.days.find((day) => day.id === selectedDayId) ?? itinerary.days[0],
    [itinerary.days, selectedDayId],
  );

  const handleViewMap = useCallback(() => {
    onViewMap?.();
  }, [onViewMap]);

  return (
    <View style={[styles.screen, { paddingTop: Platform.OS === 'web' ? 0 : insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { width: contentWidth, alignSelf: 'center' }]}
        showsVerticalScrollIndicator={false}
      >
        <ItineraryHeader title={itinerary.title} subtitle={itinerary.subtitle} onBack={onBack} />

        <View style={styles.tabsSection}>
          <DayTabs
            days={itinerary.days.map(({ id, label }) => ({ id, label }))}
            selectedDayId={selectedDay?.id ?? ''}
            onSelectDay={setSelectedDayId}
          />
        </View>

        <View style={styles.timeline}>
          {selectedDay?.activities.length ? (
            selectedDay.activities.map((activity, index) => (
              <TimelineItem
                key={activity.id}
                activity={activity}
                isLast={index === selectedDay.activities.length - 1}
              />
            ))
          ) : (
            <Text style={styles.emptyState}>Activities for this day will appear here.</Text>
          )}
        </View>

        <MapActionBar onPress={handleViewMap} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.screenBackground,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
  tabsSection: {
    marginTop: 20,
    marginBottom: 22,
  },
  timeline: {
    paddingHorizontal: 24,
  },
  emptyState: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 32,
  },
});
