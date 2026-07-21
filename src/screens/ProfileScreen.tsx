import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Profile } from '../api/backend';
import { figmaPrototypeAssets } from '../data/figmaPrototypeAssets';
import { colors } from '../theme/colors';

type ProfileScreenProps = {
  profile?: Profile | null;
  onSaveProfile: (payload: { name?: string; phone?: string }) => Promise<void>;
  onAskRag: (question: string) => Promise<string>;
  onLogout: () => void;
};

const MENU_ITEMS = [
  { label: 'Personal Information', icon: '👤', bg: '#eaf1ff' },
  { label: 'My Trips', icon: '📅', bg: '#eaf1ff' },
  { label: 'Favorites', icon: '❤️', bg: '#eaf1ff' },
  { label: 'Notifications', icon: '🔔', bg: '#eaf1ff' },
  { label: 'Settings', icon: '⚙️', bg: '#eaf1ff' },
];

export function ProfileScreen({ profile, onSaveProfile, onAskRag, onLogout }: ProfileScreenProps) {
  const [name, setName] = useState(profile?.name ?? 'Alex Morgan');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Image source={{ uri: figmaPrototypeAssets.profileAvatar }} style={styles.avatar} contentFit="cover" />
        </View>
        <Text style={styles.name}>{profile?.name ?? 'Alex Morgan'}</Text>
        <Text style={styles.email}>{profile?.email ?? 'alex.morgan@email.com'}</Text>

        <View style={styles.statsCard}>
          <View style={styles.statItem}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Trips</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statValue}>8</Text><Text style={styles.statLabel}>Countries</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statValue}>4.9</Text><Text style={styles.statLabel}>Rating</Text></View>
        </View>

        <View style={styles.menuSection}>
          <View style={styles.editorCard}>
            <Text style={styles.editorTitle}>Update profile</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Name" />
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} placeholder="Phone" />
            <Pressable
              style={styles.saveButton}
              onPress={() => {
                void onSaveProfile({ name, phone });
              }}
            >
              <Text style={styles.saveText}>Save Profile</Text>
            </Pressable>
          </View>

          <View style={styles.editorCard}>
            <Text style={styles.editorTitle}>Travel Assistant (RAG)</Text>
            <TextInput
              value={question}
              onChangeText={setQuestion}
              style={styles.input}
              placeholder="Ask: Can I cancel after booking?"
            />
            <Pressable
              style={styles.saveButton}
              onPress={() => {
                void onAskRag(question).then(setAnswer);
              }}
            >
              <Text style={styles.saveText}>Ask Assistant</Text>
            </Pressable>
            {answer ? <Text style={styles.answer}>{answer}</Text> : null}
          </View>

          {MENU_ITEMS.map((item) => (
            <Pressable key={item.label} style={styles.menuRow}>
              <View style={[styles.menuIcon, { backgroundColor: item.bg }]}><Text style={{ fontSize: 16 }}>{item.icon}</Text></View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </Pressable>
          ))}
          <Pressable style={styles.menuRow} onPress={onLogout}>
            <View style={[styles.menuIcon, { backgroundColor: '#feecec' }]}><Text style={{ fontSize: 16 }}>🚪</Text></View>
            <Text style={[styles.menuLabel, { color: '#ea4335' }]}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.screenBackground },
  header: {
    backgroundColor: colors.primary, paddingTop: 60, paddingHorizontal: 24, paddingBottom: 80,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center',
  },
  headerTitle: { position: 'absolute', top: 60, left: 24, color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 20 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#fff' },
  name: { textAlign: 'center', color: '#12203a', fontFamily: 'Inter_700Bold', fontSize: 20, marginTop: 10 },
  email: { textAlign: 'center', color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 4 },
  statsCard: {
    flexDirection: 'row', marginHorizontal: 24, marginTop: 18, backgroundColor: '#fff', borderRadius: 18, paddingVertical: 16,
    shadowColor: '#1a2640', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.06, shadowRadius: 16, elevation: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { color: '#12203a', fontFamily: 'Inter_700Bold', fontSize: 20 },
  statLabel: { color: '#8a93a3', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, height: 44, backgroundColor: '#eaedf4' },
  menuSection: { paddingHorizontal: 24, marginTop: 18, gap: 10, paddingBottom: 24 },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, height: 58, paddingHorizontal: 12,
  },
  menuIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, marginLeft: 12, color: '#12203a', fontFamily: 'Inter_500Medium', fontSize: 15 },
  menuChevron: { color: '#c4c9d4', fontSize: 24 },
  editorCard: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginBottom: 10 },
  editorTitle: { color: '#12203a', fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 8 },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e8ef',
    paddingHorizontal: 10,
    marginBottom: 8,
    fontFamily: 'Inter_400Regular',
  },
  saveButton: {
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: { color: '#fff', fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  answer: { color: '#5a6373', fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 8 },
});
