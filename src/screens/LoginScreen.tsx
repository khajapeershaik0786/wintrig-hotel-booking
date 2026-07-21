import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';
import { colors } from '../theme/colors';

type LoginScreenProps = {
  onLogin: () => void;
  onSignUp: () => void;
};

export function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={['#2e7df6', 'rgba(18,194,233,0.35)']} style={styles.header} />
      <View style={styles.logoRow}>
        <View style={styles.badge}>
          <Image source={{ uri: figmaPrototypeAssets.logoPlane }} style={styles.plane} contentFit="contain" />
        </View>
        <View>
          <Text style={styles.logoTitle}>Wintrig</Text>
          <Text style={styles.logoSub}>TRAVEL & EXPLORE</Text>
        </View>
      </View>
      <Text style={styles.welcome}>Welcome back 👋</Text>
      <Text style={styles.subWelcome}>Sign in to continue your journey</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput placeholder="you@email.com" placeholderTextColor="#9aa3b2" style={styles.input} />
        <Text style={styles.label}>Password</Text>
        <TextInput placeholder="••••••••" placeholderTextColor="#5a6373" secureTextEntry style={styles.input} />
        <Text style={styles.forgot}>Forgot password?</Text>

        <Pressable onPress={onLogin} style={styles.primaryButton}>
          <Text style={styles.primaryText}>Log In</Text>
        </Pressable>
        <Pressable onPress={onSignUp} style={styles.linkRow}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <Text style={styles.linkAction}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  header: { height: 220, borderBottomLeftRadius: 42, borderBottomRightRadius: 18 },
  logoRow: { position: 'absolute', top: 58, left: 24, flexDirection: 'row', alignItems: 'center', gap: 12 },
  badge: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#2e7df6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plane: { width: 26, height: 26 },
  logoTitle: { color: '#0f1b34', fontFamily: 'Inter_700Bold', fontSize: 38 },
  logoSub: { color: '#6e7891', fontFamily: 'Inter_600SemiBold', letterSpacing: 1.2, fontSize: 9 },
  welcome: { position: 'absolute', top: 150, left: 24, color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 38 },
  subWelcome: { position: 'absolute', top: 186, left: 24, color: '#eaf2ff', fontFamily: 'Inter_400Regular', fontSize: 14 },
  form: { flex: 1, paddingTop: 240, paddingHorizontal: 24 },
  label: { color: '#5a6373', fontFamily: 'Inter_500Medium', fontSize: 13, marginBottom: 6 },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#e5e8ef',
    backgroundColor: '#f4f6fb',
    paddingHorizontal: 18,
    color: '#1a2332',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginBottom: 14,
  },
  forgot: { textAlign: 'right', color: colors.primary, fontFamily: 'Inter_500Medium', fontSize: 13, marginBottom: 20 },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2e7df6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 2,
  },
  primaryText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  linkRow: { marginTop: 28, alignSelf: 'center', flexDirection: 'row' },
  linkText: { color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 13 },
  linkAction: { color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});
