import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'
import { AuthProvider, useAuth } from '../lib/auth'
import { theme } from '../lib/theme'

function RootNavigator() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <View style={[styles.root, { backgroundColor: theme.bg }]} />
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
      {!user ? (
        <Stack.Screen name="onboarding" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
