import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native'
import { router } from 'expo-router'
import { useAuth } from '../lib/auth'
import { theme } from '../lib/theme'

export default function LoginScreen() {
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@sendbook.id')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Isi email dan password'); return }
    setLoading(true)
    try {
      await login(email, password)
      router.replace('/(tabs)')
    } catch (e: any) {
      Alert.alert('Login Gagal', e.message)
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.box}>
        <Text style={styles.logo}>Sendbook</Text>
        <Text style={styles.sub}>Masuk ke dashboard merchant</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="admin@sendbook.id"
          placeholderTextColor={theme.textMuted}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="password"
          placeholderTextColor={theme.textMuted}
        />

        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Masuk</Text>}
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
})
