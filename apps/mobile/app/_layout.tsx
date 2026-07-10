import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'
import { AuthProvider, useAuth } from '../lib/auth'
import { ToastProvider } from '../lib/toast'
import { ToastContainer } from '../components/ToastContainer'
import { theme } from '../lib/theme'

function RootNavigator() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <View style={[styles.root, { backgroundColor: theme.bg }]} />
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
        {!user ? (
          <>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
          </>
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
      </Stack>
      <ToastContainer />
    </>
  )
}

export default function RootLayout() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AuthProvider>
    </ToastProvider>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
})
