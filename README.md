# Wintrig Hotel Booking

Cross-platform **React Native (Expo) + TypeScript** app implementing the Figma **Wintrig – Itinerary** screen (`Santorini Escape`). One codebase targets **iOS**, **Android**, and **web**.

## Stack

| Layer | Choice |
| --- | --- |
| Mobile & web UI | Expo SDK 57, React Native, TypeScript |
| Styling | `StyleSheet` + design tokens (no Tailwind) |
| Fonts | Inter via `@expo-google-fonts/inter` |
| API (optional) | Node.js + Express in `server/` |

Angular is not used here: Expo gives you a single TypeScript UI for all three platforms. The Express API can later back admin tools or a separate web dashboard if you add one.

## Run the app

```bash
npm install
npm run web      # browser
npm run ios      # iOS simulator (macOS + Xcode)
npm run android  # Android emulator
```

## Run the API (optional)

```bash
cd server
npm install
npm run dev
```

Set `EXPO_PUBLIC_API_URL=http://localhost:4000` when testing API-driven data on web. The app falls back to bundled mock data if the API is offline.

## Project layout

- `App.tsx` — entry, fonts, optional API fetch
- `src/screens/ItineraryScreen.tsx` — main screen from Figma
- `src/components/` — header, day tabs, timeline cards, map CTA
- `assets/images/itinerary/` — exported Figma assets (committed)
- `server/` — REST itinerary endpoint

## Figma reference

[Wintrig – Itinerary (node 1:763)](https://www.figma.com/design/989eewUr2mQKY2k7MAWVp0/Untitled?node-id=1-763)
