import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../lib/auth'
import { useToast } from '../lib/toast'
import { theme } from '../lib/theme'

export default function RegisterScreen() {
  const { register } = useAuth()
  const { showToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [store_name, setStoreName] = useState('')
  const [store_slug, setStoreSlug] = useState('')
  const [whatsapp, setWhatsApp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!email || !password || !name || !store_name || !store_slug || !whatsapp) {
      showToast('Semua field wajib diisi', 'error'); return
    }
    if (password.length < 6) {
      showToast('Password minimal 6 karakter', 'error'); return
    }
    setLoading(true)
    try {
      await register({ email, password, name, store_name, store_slug, whatsapp })
      showToast('Toko berhasil dibuat!', 'success')
      router.replace('/(tabs)')
    } catch (e: any) {
      showToast(e.message, 'error')
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.box}>
        <Text style={styles.logo}>Sendbook</Text>
        <Text style={styles.sub}>Daftar toko baru</Text>

        <Text style={styles.label}>Nama Lengkap</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholder="Budi Santoso"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={styles.label}>Nama Toko</Text>
        <TextInput
          style={styles.input}
          value={store_name}
          onChangeText={setStoreName}
          placeholder="Warung Budi"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={styles.label}>Slug Toko (URL)</Text>
        <TextInput
          style={styles.input}
          value={store_slug}
          onChangeText={setStoreSlug}
          autoCapitalize="none"
          placeholder="warung-budi"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={styles.label}>No. WhatsApp</Text>
        <TextInput
          style={styles.input}
          value={whatsapp}
          onChangeText={setWhatsApp}
          keyboardType="phone-pad"
          placeholder="6281234567890"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="budi@example.com"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="minimal 6 karakter"
          placeholderTextColor={theme.textMuted}
        />

        <TouchableOpacity style={styles.btn} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Daftar</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link} onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>Sudah punya akun? Masuk</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, justifyContent: 'center', padding: 24 },
  box: { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.lg, padding: 24 },
  logo: { fontSize: theme.fontSize['2xl'], fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  sub: { fontSize: theme.fontSize.sm, color: theme.textDim, textAlign: 'center', marginBottom: 20 },
  label: { fontSize: theme.fontSize.sm, fontWeight: '500', color: theme.text, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: theme.border, borderRadius: theme.radius.sm, padding: 12, fontSize: theme.fontSize.md, backgroundColor: theme.bg, marginBottom: 14, color: theme.text },
  btn: { backgroundColor: theme.primary, paddingVertical: 14, borderRadius: theme.radius.sm, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontSize: theme.fontSize.md, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: 16 },
  linkText: { fontSize: theme.fontSize.sm, color: theme.primary },
})