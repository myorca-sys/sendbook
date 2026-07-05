import { useState, useRef } from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { theme } from '../lib/theme'

const { width } = Dimensions.get('window')

const slides = [
  {
    title: 'Etalase Digital 1 Halaman',
    desc: 'Buat toko online UMKM kamu dalam 5 menit. Cukup satu link, bisa langsung dibagikan ke pelanggan.',
    emoji: '🏪',
  },
  {
    title: 'Share via WhatsApp',
    desc: 'Pelanggan bisa lihat menu, klik Chat WA, dan pesan langsung. Simple, tanpa ribet.',
    emoji: '💬',
  },
  {
    title: 'Siap Mulai?',
    desc: 'Kelola toko, atur produk, dan pantau pengunjung — semua dari HP kamu.',
    emoji: '🚀',
  },
]

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0)
  const flatRef = useRef<FlatList>(null)
  const isLast = index === slides.length - 1

  const handleNext = () => {
    if (isLast) {
      SecureStore.setItemAsync('onboarding_done', 'true')
      router.replace('/login')
    } else {
      flatRef.current?.scrollToIndex({ index: index + 1 })
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
        keyExtractor={(_, i) => String(i)}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.btn}>
          <Text style={styles.btnText}>{isLast ? 'Mulai' : 'Lanjut'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  slide: { width, flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  emoji: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: theme.fontSize.xl, fontWeight: '700', textAlign: 'center', color: theme.text, marginBottom: 12 },
  desc: { fontSize: theme.fontSize.md, textAlign: 'center', color: theme.textDim, lineHeight: 22 },
  footer: { paddingHorizontal: 24, paddingBottom: 48, alignItems: 'center', gap: 24 },
  dots: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.border },
  dotActive: { width: 24, backgroundColor: theme.primary },
  btn: { backgroundColor: theme.primary, paddingVertical: 14, paddingHorizontal: 48, borderRadius: theme.radius.md, width: '100%', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: theme.fontSize.lg, fontWeight: '600' },
})
