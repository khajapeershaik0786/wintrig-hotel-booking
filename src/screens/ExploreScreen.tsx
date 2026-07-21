import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Hotel } from '../api/backend';
import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';
import { colors } from '../theme/colors';

const CATEGORIES = ['All', 'Popular', 'Beach', 'Nature'];

const DESTINATIONS = [
  { id: 'maldives', name: 'Maldives', rating: '4.9', price: 'From $1,900', image: figmaPrototypeAssets.exploreMaldives },
  { id: 'dubai', name: 'Dubai', rating: '4.8', price: 'From $1,200', image: figmaPrototypeAssets.exploreDubai },
  { id: 'paris', name: 'Paris', rating: '4.7', price: 'From $980', image: figmaPrototypeAssets.exploreParis },
  { id: 'rome', name: 'Rome', rating: '4.8', price: 'From $850', image: figmaPrototypeAssets.exploreRome },
];

type ExploreScreenProps = {
  hotels?: Hotel[];
  onSearch: (query: string) => void;
  loading?: boolean;
  onOpenDestination?: (hotel: Hotel) => void;
};

export function ExploreScreen({ hotels, onSearch, loading, onOpenDestination }: ExploreScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [query, setQuery] = useState('');

  const displayHotels = useMemo(() => {
    if (hotels?.length) {
      return hotels.map((hotel) => ({
        id: hotel.id,
        name: hotel.name,
        rating: String(hotel.rating),
        price: `From $${hotel.price_per_night}`,
        image: hotel.image_url,
        raw: hotel,
      }));
    }
    return DESTINATIONS.map((dest) => ({ ...dest, raw: null }));
  }, [hotels]);

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Find your perfect destination</Text>

        <View style={styles.searchRow}>
          <Pressable
            style={styles.searchBar}
            onPress={() => {
              // Cycles quick prototype searches while keeping UI simple.
              const next = query ? '' : 'santorini';
              setQuery(next);
              onSearch(next);
            }}
          >
            <Text style={styles.searchText}>{query ? `Search: ${query}` : 'Search places'}</Text>
          </Pressable>
          <View style={styles.filterBtn}><Text style={styles.filterIcon}>☰</Text></View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map((cat) => (
            <Pressable key={cat} onPress={() => setSelectedCategory(cat)} style={[styles.chip, selectedCategory === cat ? styles.chipActive : styles.chipDefault]}>
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {displayHotels.map((dest) => (
            <Pressable
              key={dest.id}
              style={styles.card}
              onPress={() => {
                if (dest.raw && onOpenDestination) {
                  onOpenDestination(dest.raw);
                }
              }}
            >
              <Image source={{ uri: dest.image }} style={styles.cardImage} contentFit="cover" />
              <Text style={styles.cardTitle}>{dest.name}</Text>
              <Text style={styles.cardRating}>★ {dest.rating}</Text>
              <Text style={styles.cardPrice}>{dest.price}</Text>
            </Pressable>
          ))}
        </View>
        {loading ? <Text style={styles.loadingText}>Loading destinations...</Text> : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screenBackground },
  scrollContent: { paddingTop: 64, paddingBottom: 24 },
  title: { paddingHorizontal: 24, color: '#12203a', fontFamily: 'Inter_700Bold', fontSize: 28 },
  subtitle: { paddingHorizontal: 24, color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 4 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 24, marginTop: 16, gap: 10 },
  searchBar: { flex: 1, height: 52, borderRadius: 14, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 18, shadowColor: '#1a2640', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 1 },
  searchText: { color: '#9aa3b2', fontFamily: 'Inter_400Regular', fontSize: 14 },
  filterBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  filterIcon: { color: '#fff', fontSize: 16 },
  chips: { paddingHorizontal: 24, gap: 10, marginTop: 16, marginBottom: 16 },
  chip: { height: 34, borderRadius: 17, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: colors.primary },
  chipDefault: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.textSecondary },
  chipTextActive: { color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 24, gap: 14 },
  card: {
    width: '47%', backgroundColor: '#fff', borderRadius: 18, padding: 8, marginBottom: 2,
    shadowColor: '#1a2640', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 2,
  },
  cardImage: { width: '100%', height: 120, borderRadius: 13 },
  cardTitle: { marginTop: 8, color: '#12203a', fontFamily: 'Inter_700Bold', fontSize: 15 },
  cardRating: { color: '#f5a623', fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 4 },
  cardPrice: { color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 4, marginBottom: 4 },
  loadingText: { textAlign: 'center', color: '#8a93a3', fontFamily: 'Inter_400Regular', marginTop: 12 },
});
