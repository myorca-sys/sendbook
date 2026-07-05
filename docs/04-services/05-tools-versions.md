# Tools & Packages Versions

## Runtime

| Tool | Version |
|------|---------|
| Node.js | 24.17.0 |
| npm | 11.18.0 |
| OS | Android (Termux) |
| Architecture | aarch64 |

## Mobile App (`apps/mobile`)

| Package | Resolved Version (npm) | Range |
|---------|----------------------|-------|
| expo | 57.0.2 | ~57.0.0 |
| @expo/metro-runtime | 57.0.3 | ~57.0.0 |
| expo-router | 57.0.3 | ~57.0.0 |
| expo-constants | 57.0.3 | ~57.0.0 |
| expo-linking | 57.0.1 | ~57.0.0 |
| expo-secure-store | 57.0.0 | ~57.0.0 |
| expo-splash-screen | 57.0.2 | ~57.0.0 |
| expo-status-bar | 57.0.0 | ~57.0.0 |
| expo-image-picker | 57.0.2 | ~57.0.0 |
| expo-build-properties | 57.0.3 | ~57.0.0 |
| expo-dev-client | 57.0.5 | ~57.0.0 |
| react-native | 0.86.0 | ~0.86.0 |
| react | 19.2.3 | 19.2.3 |
| react-native-safe-area-context | 5.7.0 | ~5.7.0 |
| react-native-screens | 4.25.2 | ~4.25.2 |
| react-native-svg | 15.15.5 | ^15.0.0 |
| react-native-gesture-handler | 2.32.0 | ~2.32.0 |
| react-native-reanimated | 4.5.1 | ~4.5.1 |
| lucide-react-native | 1.23.0 | ^1.17.0 |
| typescript | 5.9.3 | ^5.9.0 |
| @types/react | 19.2.17 | ^19.2.0 |
| babel-preset-expo | 57.0.1 | ~57.0.0 |
| patch-package | 8.0.1 | ^8.0.1 |
| postinstall-postinstall | 2.1.0 | ^2.1.0 |

## EAS CLI

| Tool | Version |
|------|---------|
| eas-cli | 18.9.1 |

## API Functions (Cloudflare Pages)

| Package | Resolved Version | Range |
|---------|-----------------|-------|
| hono | 4.12.27 | ^4.12.27 |
| postgres | 3.4.9 | ^3.4.4 |
| zod | 4.4.3 | ^3.23.8 |
| @hono/zod-validator | 0.4.3 | — |
| better-auth | 1.6.23 | — |
| drizzle-orm | 0.45.2 | — |
| @upstash/redis | 1.38.0 | — |

## Landing Page (`apps/web`)

| Package | Version |
|---------|---------|
| astro | ^4.16.18 |
| hono | ^4.12.27 |
| postgres | ^3.4.4 |
| zod | ^3.23.8 |
| wrangler | ^4.101.0 |

## Vendor Libraries (`apps/mobile/lib/qrcode-lib/`)

| File | Purpose |
|------|---------|
| 8BitByte.js | Byte mode data encoding |
| BitBuffer.js | Bit buffer management |
| ErrorCorrectLevel.js | Error correction level enum |
| Polynomial.js | Polynomial arithmetic for Reed-Solomon |
| QRCode.js | QR code generation engine |
| RSBlock.js | Reed-Solomon block calculation |
| index.js | Entry point |
| math.js | GF(256) math operations |
| mode.js | Data mode enum |
| util.js | Utilities (mask, pattern, BCH) |

## Infrastructure

| Service | Version / Config |
|---------|-----------------|
| Cloudflare Pages | Sendbook project, `nodejs_compat` flag |
| Supabase (production) | Project `mpbtxvgkoekwulzlebjh`, PostgreSQL |
| Upstash Redis | Instance `powerful-crow-69427`, Redis |
| R2 | Bucket `sendbook-products`, public |
| Expo EAS | Project ID `0ec15b5b-cf0f-47f5-879f-f83f97d03ee8` |
| GitHub | `myorca-sys/sendbook`, auto-deploy to Pages |
