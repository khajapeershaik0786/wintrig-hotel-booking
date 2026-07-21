import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { backendApi, type AuthUser, type Booking, type Hotel, type Profile } from './src/api/backend';
import { hydrateItineraryFromApi } from './src/api/itineraryApi';
import { mockSantoriniItinerary } from './src/data/mockItinerary';
import { MainTabs } from './src/navigation/MainTabs';
import { DestinationDetailScreen } from './src/screens/DestinationDetailScreen';
import { ItineraryScreen } from './src/screens/ItineraryScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MapPrototypeScreen } from './src/screens/MapPrototypeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { colors } from './src/theme/colors';
import type { TripItinerary } from './src/types/itinerary';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_STORAGE_KEY = 'wintrig_auth_token';
const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.screenBackground },
};

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const [itinerary, setItinerary] = useState<TripItinerary>(mockSantoriniItinerary);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadItinerary() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/trips/santorini-escape/itinerary`);
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setItinerary(hydrateItineraryFromApi(data));
      } catch {
        // Offline — keep bundled mock data.
      }
    }
    void loadItinerary();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    void AsyncStorage.getItem(TOKEN_STORAGE_KEY).then((storedToken) => {
      if (storedToken) {
        setToken(storedToken);
      }
    });
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    void Promise.all([
      backendApi.getProfile(token).then(setProfile).catch(() => undefined),
      backendApi.myBookings(token).then(setBookings).catch(() => undefined),
      backendApi.listHotels().then(setHotels).catch(() => undefined),
    ]);
  }, [token]);

  const authHandlers = useMemo(
    () => ({
      login: async (payload: { email: string; password: string }) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
          const result = await backendApi.login(payload);
          setToken(result.token);
          setUser(result.user);
          await AsyncStorage.setItem(TOKEN_STORAGE_KEY, result.token);
          return true;
        } catch (error) {
          setAuthError((error as Error).message);
          return false;
        } finally {
          setAuthLoading(false);
        }
      },
      signup: async (payload: { name: string; email: string; password: string }) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
          const result = await backendApi.signup(payload);
          setToken(result.token);
          setUser(result.user);
          await AsyncStorage.setItem(TOKEN_STORAGE_KEY, result.token);
          return true;
        } catch (error) {
          setAuthError((error as Error).message);
          return false;
        } finally {
          setAuthLoading(false);
        }
      },
      logout: async () => {
        setToken(null);
        setUser(null);
        setProfile(null);
        setBookings([]);
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      },
    }),
    [],
  );

  async function searchHotels(query: string) {
    setHotelsLoading(true);
    try {
      const result = await backendApi.listHotels(query);
      setHotels(result);
    } catch {
      // keep previous list
    } finally {
      setHotelsLoading(false);
    }
  }

  async function refreshBookings() {
    if (!token) return;
    setBookingsLoading(true);
    try {
      const result = await backendApi.myBookings(token);
      setBookings(result);
    } catch {
      // ignore
    } finally {
      setBookingsLoading(false);
    }
  }

  async function saveProfile(payload: { name?: string; phone?: string }) {
    if (!token) return;
    try {
      const updated = await backendApi.updateProfile(token, payload);
      setProfile(updated);
      Alert.alert('Profile updated');
    } catch (error) {
      Alert.alert('Profile update failed', (error as Error).message);
    }
  }

  async function askRag(question: string) {
    if (!question.trim()) {
      return 'Please enter a question.';
    }
    try {
      const result = await backendApi.ragQuery(question);
      return result.answer;
    } catch (error) {
      return `Assistant failed: ${(error as Error).message}`;
    }
  }

  async function createBookingFromSelectedHotel() {
    if (!token || !selectedHotel) {
      Alert.alert('Login required', 'Please log in before booking.');
      return;
    }
    try {
      await backendApi.createBooking(token, {
        hotelId: selectedHotel.id,
        checkIn: '2026-08-10',
        checkOut: '2026-08-14',
        guests: 2,
      });
      await refreshBookings();
      Alert.alert('Booking confirmed', `${selectedHotel.name} booked successfully.`);
    } catch (error) {
      Alert.alert('Booking failed', (error as Error).message);
    }
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Auth flow */}
          <Stack.Screen name="Splash">
            {({ navigation }) => <SplashScreen onContinue={() => navigation.replace('Onboarding')} />}
          </Stack.Screen>
          <Stack.Screen name="Onboarding">
            {({ navigation }) => (
              <OnboardingScreen
                onGetStarted={() => navigation.replace('Login')}
                onHaveAccount={() => navigation.replace('Login')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Login">
            {({ navigation }) => (
              <LoginScreen
                onLogin={async (payload) => {
                  const ok = await authHandlers.login(payload);
                  if (ok) {
                    navigation.replace('MainApp');
                  }
                }}
                onSignUp={() => navigation.navigate('SignUp')}
                loading={authLoading}
                error={authError}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {({ navigation }) => (
              <SignUpScreen
                onSignUp={async (payload) => {
                  const ok = await authHandlers.signup(payload);
                  if (ok) {
                    navigation.replace('MainApp');
                  }
                }}
                onLogin={() => navigation.goBack()}
                loading={authLoading}
                error={authError}
              />
            )}
          </Stack.Screen>

          {/* Main app with bottom tabs */}
          <Stack.Screen name="MainApp">
            {({ navigation }) => (
              <MainTabs
                onOpenItinerary={() => navigation.navigate('Itinerary')}
                onOpenDestination={(hotel) => {
                  setSelectedHotel(hotel);
                  navigation.navigate('DestinationDetail');
                }}
                hotels={hotels}
                hotelsLoading={hotelsLoading}
                onSearchHotels={(query) => {
                  void searchHotels(query);
                }}
                bookings={bookings}
                bookingsLoading={bookingsLoading}
                onRefreshBookings={() => {
                  void refreshBookings();
                }}
                profile={profile}
                onSaveProfile={saveProfile}
                onAskRag={askRag}
                onLogout={async () => {
                  await authHandlers.logout();
                  navigation.replace('Login');
                }}
              />
            )}
          </Stack.Screen>

          {/* Detail screens (pushed over tabs) */}
          <Stack.Screen name="Itinerary">
            {({ navigation }) => (
              <ItineraryScreen
                itinerary={itinerary}
                onViewMap={() => navigation.navigate('MapPrototype')}
                onBack={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="DestinationDetail">
            {({ navigation }) => (
              <DestinationDetailScreen
                hotel={selectedHotel}
                onBack={() => navigation.goBack()}
                onBook={createBookingFromSelectedHotel}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="MapPrototype">
            {({ navigation }) => <MapPrototypeScreen onBack={() => navigation.goBack()} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.screenBackground },
});
