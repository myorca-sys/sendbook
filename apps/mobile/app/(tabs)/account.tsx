import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../../lib/auth'
import { apiWithToken } from '../../lib/api'
import { theme } from '../../lib/theme'

export default function AccountScreen() {
  const { user, token, logout } = useAuth()
  const [store, setStore] = useState<any>(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [wa, setWa] = useState('')
  const [address, setAddress] = useState('')
  const [maps, setMaps] = useState('')
  const [published, setPublished] = useState(false)

  const load = async () => {
    if (!token) return
    try {
      const s = await apiWithToken('/api/stores/warung-bu-ana', token) // ponytail: hardcoded fallback for dev until storeId mapping works end-to-end
      setStore(s)
      setName(s.name)
      setDesc(s.description || '')
      setWa(s.whatsapp || '')
      setAddress(s.address || '')
      setMaps(s.maps_url || '')
      setPublished(s.is_published)
    } catch {}
  }

  useEffect(() => { load() }, [token])

  const save = async () => {
    if (!token || !store) return
    try {
      await apiWithToken('/api/stores/' + store.slug, token, {
        method: 'PATCH',
        body: JSON.stringify({ name, description: desc, whatsapp: wa, address, maps_url: maps, is_published: published }),
      })
      Alert.alert('Tersimpan', 'Pengaturan toko berhasil disimpan.')
    } catch (e: any) { Alert.alert('Error', e.message) }
  }

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: async () => {
        await logout()
        router.replace('/login')
      }},
    ])
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Akun</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pengaturan Toko</Text>

        <Text style={styles.label}>Nama Toko</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={theme.textMuted} />

        <Text style={styles.label}>Deskripsi</Text>
        <TextInput style={[styles.input, { minHeight: 80 }]} value={desc} onChangeText={setDesc} multiline placeholderTextColor={theme.textMuted} />

        <Text style={styles.label}>No. WhatsApp</Text>
        <TextInput style={styles.input} value={wa} onChangeText={setWa} placeholder="6281234567890" placeholderTextColor={theme.textMuted} />

        <Text style={styles.label}>Alamat</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholderTextColor={theme.textMuted} />

        <Text style={styles.label}>Link Google Maps</Text>
        <TextInput style={styles.input} value={maps} onChangeText={setMaps} placeholder="https://maps.google.com/..." placeholderTextColor={theme.textMuted} />

        <View style={styles.switchRow}>
          <Text style={styles.label}>Toko Dipublikasikan</Text>
          <Switch value={published} onValueChange={setPublished} trackColor={{ false: theme.border, true: theme.primaryLight }} thumbColor={published ? theme.primary : '#ccc'} />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnText}>Simpan</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>

      <View style={{ height: 60 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  header: { padding: 24, paddingTop: 60 },
  title: { fontSize: theme.fontSize['2xl'], fontWeight: '700', color: theme.text },
  email: { fontSize: theme.fontSize.sm, color: theme.textDim, marginTop: 4 },
  section: { backgroundColor: theme.surface, marginHorizontal: 16, borderRadius: theme.radius.md, padding: 16, borderWidth: 1, borderColor: theme.border },
  sectionTitle: { fontSize: theme.fontSize.lg, fontWeight: '600', color: theme.text, marginBottom: 16 },
  label: { fontSize: theme.fontSize.sm, fontWeight: '500', color: theme.text, marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.sm, padding: 12, fontSize: theme.fontSize.md, backgroundColor: theme.bg, color: theme.text },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  saveBtn: { backgroundColor: theme.primary, paddingVertical: 14, borderRadius: theme.radius.sm, alignItems: 'center', marginTop: 20 },
  saveBtnText: { color: '#fff', fontSize: theme.fontSize.md, fontWeight: '600' },
  logoutBtn: { marginHorizontal: 16, marginTop: 20, paddingVertical: 14, borderRadius: theme.radius.sm, alignItems: 'center', borderWidth: 1, borderColor: theme.red },
  logoutText: { color: theme.red, fontSize: theme.fontSize.md, fontWeight: '600' },
})
