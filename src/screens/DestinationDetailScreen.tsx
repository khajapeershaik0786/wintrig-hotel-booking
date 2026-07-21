import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { Hotel } from '../api/backend';
import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';
import { colors } from '../theme/colors';

type DestinationDetailScreenProps = {
  hotel?: Hotel | null;
  onBack: () => void;
  onBook: () => Promise<void>;
};

const AMENITIES = [
  { emoji: '🏖️', label: 'Beach' },
  { emoji: '🍽️', label: 'Dining' },
  { emoji: '🏛️', label: 'Culture' },
  { emoji: '🌅', label: 'Sunset' },
];

const INCLUDES = ['Round-trip flights', '4 nights boutique hotel', 'Guided sunset tour'];

export function DestinationDetailScreen({ hotel, onBack, onBook }: DestinationDetailScreenProps) {
  const selectedHotel = hotel ?? {
    id: 'fallback',
    name: 'Santorini',
    city: 'Oia',
    country: 'Greece',
    description:
      'Santorini is one of the most iconic Greek islands, famous for its whitewashed villages, blue-domed churches, and dramatic sunsets over the caldera. Enjoy world-class dining and breathtaking sea views.',
    price_per_night: '250',
    rating: '4.9',
    amenities: ['Beach', 'Dining', 'Culture', 'Sunset'],
    image_url: figmaPrototypeAssets.destinationDetailHero,
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: selectedHotel.image_url }} style={styles.hero} contentFit="cover" />
          <Pressable onPress={onBack} style={styles.backBtn}><Text style={styles.backBtnText}>‹</Text></Pressable>
          <View style={styles.heartBtn}><Text style={styles.heartIcon}>♥</Text></View>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{selectedHotel.name}</Text>
            <View style={styles.ratingBadge}><Text style={styles.ratingText}>★ {selectedHotel.rating}</Text></View>
          </View>
          <Text style={styles.location}>
            📍 {selectedHotel.city}, {selectedHotel.country}
          </Text>

          <View style={styles.amenities}>
            {AMENITIES.map((a) => (
              <View key={a.label} style={styles.amenityChip}>
                <Text style={styles.amenityEmoji}>{a.emoji}</Text>
                <Text style={styles.amenityLabel}>{a.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>About destination</Text>
          <Text style={styles.body}>
            {selectedHotel.description}
          </Text>

          <Text style={styles.sectionTitle}>What's included</Text>
          {INCLUDES.map((item) => (
            <View key={item} style={styles.includeRow}>
              <View style={styles.checkCircle}><Text style={styles.checkMark}>✓</Text></View>
              <Text style={styles.includeText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Total price</Text>
          <Text style={styles.priceValue}>${selectedHotel.price_per_night}</Text>
        </View>
        <Pressable
          onPress={() => {
            void onBook();
          }}
          style={styles.bookBtn}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  heroWrap: { height: 400 },
  hero: { width: '100%', height: '100%' },
  backBtn: { position: 'absolute', top: 56, left: 24, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 24, color: '#1a2332', marginTop: -2 },
  heartBtn: { position: 'absolute', top: 56, right: 24, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' },
  heartIcon: { fontSize: 18, color: '#ea4335' },
  content: { marginTop: -28, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 28, paddingHorizontal: 28, paddingBottom: 110 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#1a2332', fontFamily: 'Inter_700Bold', fontSize: 26 },
  ratingBadge: { backgroundColor: '#fff4e0', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6 },
  ratingText: { color: '#f5a623', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  location: { color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 6 },
  amenities: { flexDirection: 'row', gap: 12, marginTop: 20 },
  amenityChip: { backgroundColor: '#f4f6fb', borderRadius: 14, width: 54, height: 58, alignItems: 'center', justifyContent: 'center' },
  amenityEmoji: { fontSize: 18 },
  amenityLabel: { color: '#5a6373', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 },
  sectionTitle: { color: '#1a2332', fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 24 },
  body: { color: '#6b7485', fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, marginTop: 8 },
  includeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 10 },
  checkCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#2e7df6', alignItems: 'center', justifyContent: 'center' },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  includeText: { color: '#5a6373', fontFamily: 'Inter_400Regular', fontSize: 14 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 96, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  priceLabel: { color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 12 },
  priceValue: { color: '#1a2332', fontFamily: 'Inter_700Bold', fontSize: 22 },
  bookBtn: {
    width: 150, height: 52, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#2e7df6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 3,
  },
  bookBtnText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 15 },
});
