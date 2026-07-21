import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';
import { colors } from '../theme/colors';

type BookingsScreenProps = {
  onOpenItinerary?: () => void;
};

export function BookingsScreen({ onOpenItinerary }: BookingsScreenProps) {
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your trips</Text>

        <View style={styles.segmented}>
          <Pressable onPress={() => setTab('upcoming')} style={[styles.segmentBtn, tab === 'upcoming' && styles.segmentBtnActive]}>
            <Text style={[styles.segmentText, tab === 'upcoming' && styles.segmentTextActive]}>Upcoming</Text>
          </Pressable>
          <Pressable onPress={() => setTab('completed')} style={[styles.segmentBtn, tab === 'completed' && styles.segmentBtnActive]}>
            <Text style={[styles.segmentText, tab === 'completed' && styles.segmentTextActive]}>Completed</Text>
          </Pressable>
        </View>

        {tab === 'upcoming' ? (
          <>
            <Pressable style={styles.bookingCard} onPress={onOpenItinerary}>
              <Image source={{ uri: figmaPrototypeAssets.bookingSantorini }} style={styles.bookingImage} contentFit="cover" />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>Santorini Escape</Text>
                <Text style={styles.bookingDate}>📅 Jun 24 – Jun 28, 2026</Text>
                <View style={[styles.badge, styles.badgeConfirmed]}><Text style={styles.badgeTextConfirmed}>Confirmed</Text></View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
            <Pressable style={styles.bookingCard}>
              <Image source={{ uri: figmaPrototypeAssets.bookingMaldives }} style={styles.bookingImage} contentFit="cover" />
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingTitle}>Maldives Retreat</Text>
                <Text style={styles.bookingDate}>📅 Jul 12 – Jul 18, 2026</Text>
                <View style={[styles.badge, styles.badgePending]}><Text style={styles.badgeTextPending}>Pending</Text></View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
            <Text style={styles.moreLink}>Explore more destinations →</Text>
          </>
        ) : (
          <Text style={styles.emptyState}>No completed trips yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screenBackground },
  scrollContent: { paddingTop: 64, paddingBottom: 24 },
  title: { paddingHorizontal: 24, color: '#12203a', fontFamily: 'Inter_700Bold', fontSize: 28 },
  subtitle: { paddingHorizontal: 24, color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4, marginBottom: 16 },
  segmented: { flexDirection: 'row', marginHorizontal: 24, height: 48, borderRadius: 14, backgroundColor: '#eaedf4', padding: 4, marginBottom: 16 },
  segmentBtn: { flex: 1, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segmentBtnActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 1 },
  segmentText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#8a93a3' },
  segmentTextActive: { color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  bookingCard: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 24, marginBottom: 16, backgroundColor: '#fff',
    borderRadius: 18, padding: 12,
    shadowColor: '#1a2640', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 1,
  },
  bookingImage: { width: 88, height: 88, borderRadius: 14 },
  bookingInfo: { flex: 1, marginLeft: 12 },
  bookingTitle: { color: '#12203a', fontFamily: 'Inter_700Bold', fontSize: 16 },
  bookingDate: { color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 6 },
  badge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginTop: 8, alignSelf: 'flex-start' },
  badgeConfirmed: { backgroundColor: 'rgba(16,185,129,0.14)' },
  badgeTextConfirmed: { color: '#10b981', fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  badgePending: { backgroundColor: 'rgba(245,166,35,0.14)' },
  badgeTextPending: { color: '#f5a623', fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  chevron: { color: '#c4c9d4', fontSize: 28, marginLeft: 4 },
  moreLink: { textAlign: 'center', color: colors.primary, fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 8 },
  emptyState: { textAlign: 'center', color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 40 },
});
