import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Share, Modal } from 'react-native'
import { useAuth } from '../../lib/auth'
import { apiWithToken } from '../../lib/api'
import { theme } from '../../lib/theme'
import QRCode from '../../components/QRCode'

export default function BerandaScreen() {
  const { user, store, token } = useAuth()
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const load = async () => {
    if (!token || !store?.slug) { setLoading(false); return }
    try {
      const st = await apiWithToken(`/api/stores/${store.slug}/analytics`, token)
      setStats(st)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [token, store?.slug])

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

        {loading ? (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { opacity: 0.5 }]}><Text style={styles.statNum}>-</Text><Text style={styles.statLabel}>Loading...</Text></View>
            <View style={[styles.statCard, { opacity: 0.5 }]}><Text style={styles.statNum}>-</Text><Text style={styles.statLabel}>Loading...</Text></View>
          </View>
        ) : store ? (
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
        ) : null}

      {store && (
        <TouchableOpacity style={styles.qrButton} onPress={() => setShowQR(true)}>
          <Text style={styles.qrButtonText}>📱 Tampilkan QR Toko</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showQR} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowQR(false)}>
          <View style={styles.modalContent}>
            <QRCode value={`https://sendbook.pages.dev/store/${store?.slug}`} size={250} />
            <Text style={styles.qrLabel}>Scan untuk buka toko</Text>
            <TouchableOpacity onPress={() => setShowQR(false)}>
              <Text style={styles.closeBtn}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  qrButton: { marginHorizontal: 24, marginBottom: 24, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.md, padding: 16, alignItems: 'center' },
  qrButtonText: { fontSize: theme.fontSize.md, color: theme.primary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: theme.radius.lg, padding: 32, alignItems: 'center' },
  qrLabel: { fontSize: theme.fontSize.sm, color: theme.textDim, marginTop: 12 },
  closeBtn: { fontSize: theme.fontSize.md, color: theme.primary, marginTop: 16, fontWeight: '600' },
})
