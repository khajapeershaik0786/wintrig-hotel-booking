import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet, View } from 'react-native';

import type { Booking, Hotel, Profile } from '../api/backend';
import { BookingsScreen } from '../screens/BookingsScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = { Home: '🏠', Explore: '🧭', Bookings: '🎫', Profile: '👤' };
  return (
    <View style={tabStyles.iconWrap}>
      {focused && <View style={tabStyles.indicator} />}
      <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>{icons[label] ?? '•'}</Text>
      <Text style={[tabStyles.label, focused ? tabStyles.labelFocused : tabStyles.labelDefault]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: { alignItems: 'center', paddingTop: 8 },
  indicator: { width: 24, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginBottom: 2 },
  icon: { fontSize: 20, marginBottom: 2 },
  iconFocused: { opacity: 1 },
  label: { fontSize: 11 },
  labelFocused: { color: colors.primary, fontFamily: 'Inter_600SemiBold' },
  labelDefault: { color: '#9aa3b2', fontFamily: 'Inter_400Regular' },
});

type MainTabsProps = {
  onOpenItinerary: () => void;
  onOpenDestination: (hotel: Hotel) => void;
  hotels: Hotel[];
  hotelsLoading: boolean;
  onSearchHotels: (query: string) => void;
  bookings: Booking[];
  bookingsLoading: boolean;
  onRefreshBookings: () => void;
  profile: Profile | null;
  onSaveProfile: (payload: { name?: string; phone?: string }) => Promise<void>;
  onAskRag: (question: string) => Promise<string>;
  onLogout: () => void;
};

export function MainTabs({
  onOpenItinerary,
  onOpenDestination,
  hotels,
  hotelsLoading,
  onSearchHotels,
  bookings,
  bookingsLoading,
  onRefreshBookings,
  profile,
  onSaveProfile,
  onAskRag,
  onLogout,
}: MainTabsProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 74,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
          backgroundColor: '#fff',
          position: 'absolute',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} /> }}
      >
        {() => <DashboardScreen onOpenItinerary={onOpenItinerary} />}
      </Tab.Screen>
      <Tab.Screen
        name="Explore"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Explore" focused={focused} /> }}
      >
        {() => (
          <ExploreScreen
            hotels={hotels}
            loading={hotelsLoading}
            onSearch={onSearchHotels}
            onOpenDestination={onOpenDestination}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Bookings"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Bookings" focused={focused} /> }}
      >
        {() => (
          <BookingsScreen
            bookings={bookings}
            loading={bookingsLoading}
            onRefresh={onRefreshBookings}
            onOpenItinerary={onOpenItinerary}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon label="Profile" focused={focused} /> }}
      >
        {() => (
          <ProfileScreen
            profile={profile}
            onSaveProfile={onSaveProfile}
            onAskRag={onAskRag}
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
