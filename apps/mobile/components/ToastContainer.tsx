import { useEffect } from 'react'
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native'
import { useToast } from '../lib/toast'
import { theme } from '../lib/theme'

const { height: screenHeight } = Dimensions.get('window')

export function ToastContainer() {
  const { toasts, hideToast } = useToast()

  useEffect(() => {
    if (toasts.length > 3) {
      // Only keep latest 3
    }
  }, [toasts])

  if (toasts.length === 0) return null

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {toasts.slice(-3).map(t => (
        <TouchableOpacity
          key={t.id}
          style={[styles.toast, t.type === 'error' && styles.toastError, t.type === 'success' && styles.toastSuccess]}
          onPress={() => hideToast(t.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.text}>{t.message}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: screenHeight * 0.06,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    backgroundColor: theme.text,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    marginBottom: 8,
    maxWidth: '88%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  toastError: {
    backgroundColor: theme.red,
  },
  toastSuccess: {
    backgroundColor: theme.green,
  },
  text: {
    color: '#fff',
    fontSize: theme.fontSize.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
})
