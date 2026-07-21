import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';
import { colors } from '../theme/colors';

type DashboardScreenProps = {
  onOpenItinerary: () => void;
};

export function DashboardScreen({ onOpenItinerary }: DashboardScreenProps) {
  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>Alex Morgan</Text>
          <Text style={styles.prompt}>Where do you want to go?</Text>
          <View style={styles.search}><Text style={styles.searchText}>Search destinations, hotels...</Text></View>
          <Image source={{ uri: figmaPrototypeAssets.dashboardAvatar }} style={styles.avatar} contentFit="cover" />
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <View style={styles.row}>
            <View style={styles.destinationCard}>
              <Image source={{ uri: figmaPrototypeAssets.destinationSantorini }} style={styles.destinationImage} contentFit="cover" />
              <Text style={styles.cardTitle}>Santorini</Text>
              <Text style={styles.cardSub}>Greece</Text>
            </View>
            <View style={styles.destinationCard}>
              <Image source={{ uri: figmaPrototypeAssets.destinationKyoto }} style={styles.destinationImage} contentFit="cover" />
              <Text style={styles.cardTitle}>Kyoto</Text>
              <Text style={styles.cardSub}>Japan</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Popular Trips</Text>
          <Pressable style={styles.tripRow} onPress={onOpenItinerary}>
            <Image source={{ uri: figmaPrototypeAssets.tripBali }} style={styles.tripImage} contentFit="cover" />
            <View style={styles.tripText}>
              <Text style={styles.tripTitle}>Bali Adventure</Text>
              <Text style={styles.cardSub}>7 days · Indonesia</Text>
            </View>
            <Text style={styles.tripPrice}>$980</Text>
          </Pressable>
          <Pressable style={styles.tripRow} onPress={onOpenItinerary}>
            <Image source={{ uri: figmaPrototypeAssets.tripSwiss }} style={styles.tripImage} contentFit="cover" />
            <View style={styles.tripText}>
              <Text style={styles.tripTitle}>Swiss Alps Tour</Text>
              <Text style={styles.cardSub}>5 days · Switzerland</Text>
            </View>
            <Text style={styles.tripPrice}>$1,420</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screenBackground },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: { color: '#dce8ff', fontFamily: 'Inter_400Regular', fontSize: 14 },
  name: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 34, marginTop: 4 },
  prompt: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 24, marginTop: 16, maxWidth: 220 },
  search: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#fff',
    marginTop: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  searchText: { color: '#9aa3b2', fontFamily: 'Inter_400Regular', fontSize: 14 },
  avatar: { position: 'absolute', right: 24, top: 62, width: 44, height: 44, borderRadius: 22 },
  content: { padding: 24 },
  sectionTitle: { color: '#1a2332', fontFamily: 'Inter_700Bold', fontSize: 18, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  destinationCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#1a2640',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 2,
  },
  destinationImage: { width: '100%', height: 120, borderRadius: 14 },
  cardTitle: { marginTop: 10, color: '#1a2332', fontFamily: 'Inter_700Bold', fontSize: 16 },
  cardSub: { marginTop: 4, color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 12 },
  tripRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
  },
  tripImage: { width: 60, height: 60, borderRadius: 14 },
  tripText: { marginLeft: 12, flex: 1 },
  tripTitle: { color: '#1a2332', fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  tripPrice: { color: colors.primary, fontFamily: 'Inter_700Bold', fontSize: 22 },
});
