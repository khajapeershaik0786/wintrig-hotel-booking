import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.screenBackground },
};

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold });
  const [itinerary, setItinerary] = useState<TripItinerary>(mockSantoriniItinerary);

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
                onLogin={() => navigation.replace('MainApp')}
                onSignUp={() => navigation.navigate('SignUp')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {({ navigation }) => (
              <SignUpScreen
                onSignUp={() => navigation.replace('MainApp')}
                onLogin={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          {/* Main app with bottom tabs */}
          <Stack.Screen name="MainApp">
            {({ navigation }) => (
              <MainTabs
                onOpenItinerary={() => navigation.navigate('Itinerary')}
                onOpenDestination={() => navigation.navigate('DestinationDetail')}
                onLogout={() => navigation.replace('Login')}
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
                onBack={() => navigation.goBack()}
                onBook={() => navigation.navigate('Itinerary')}
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
