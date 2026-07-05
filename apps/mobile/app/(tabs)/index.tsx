import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { useAuth } from '../../lib/auth'
import { apiWithToken } from '../../lib/api'
import { theme } from '../../lib/theme'
import { Share } from 'react-native'

export default function BerandaScreen() {
  const { user, token } = useAuth()
  const [store, setStore] = useState<any>(null)
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    if (!token || !user?.storeId) { setLoading(false); return }
    try {
      const s = await apiWithToken('/api/stores/warung-bu-ana', token)
      setStore(s)
      const st = await apiWithToken(`/api/stores/${s.slug}/analytics`, token)
      setStats(st)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [token])

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const visits = stats.filter((s: any) => s.type === 'visit').reduce((a: number, b: any) => a + Number(b.count), 0)
  const clicks = stats.filter((s: any) => s.type === 'whatsapp_click').reduce((a: number, b: any) => a + Number(b.count), 0)

  const handleShare = () => {
    if (store) {
      Share.share({ url: `https://sendbook.pages.dev/store/${store.slug}`, message: `Toko ${store.name}: https://sendbook.pages.dev/store/${store.slug}` })
    }
  }

  return (
    <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Halo, {user?.name || 'Admin'}</Text>
        {store && <Text style={styles.storeName}>{store.name}</Text>}
        {store && (
          <TouchableOpacity onPress={handleShare}>
            <Text style={styles.share}>🔗 Bagikan toko</Text>
          </TouchableOpacity>
        )}
      </View>

      {store && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{visits}</Text>
            <Text style={styles.statLabel}>Kunjungan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{clicks}</Text>
            <Text style={styles.statLabel}>Klik WA</Text>
          </View>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { padding: 24, paddingTop: 60 },
  greeting: { fontSize: theme.fontSize.md, color: theme.textDim, marginBottom: 4 },
  storeName: { fontSize: theme.fontSize['2xl'], fontWeight: '700', color: theme.text },
  share: { fontSize: theme.fontSize.sm, color: theme.primary, marginTop: 8 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.md, padding: 20, alignItems: 'center' },
  statNum: { fontSize: 32, fontWeight: '700', color: theme.text },
  statLabel: { fontSize: theme.fontSize.sm, color: theme.textDim, marginTop: 4 },
})
