import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import * as SecureStore from 'expo-secure-store'
import { api } from './api'

const BASE = 'https://sendbook.pages.dev'

type User = {
  id: string
  email: string
  name: string
  storeId: string | null
}

type Store = {
  id: string
  slug: string
  name: string
  [key: string]: any
}

type AuthContext = {
  user: User | null
  store: Store | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const ctx = createContext<AuthContext>(null!)

async function fetchStore(token: string): Promise<Store | null> {
  try {
    return await api('/api/dashboard/store', { headers: { Cookie: `sendbook_session=${token}` } })
  } catch { return null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [store, setStore] = useState<Store | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    const stored = await SecureStore.getItemAsync('session_token')
    if (!stored) { setIsLoading(false); return }
    try {
      const data = await api('/api/dashboard/me', { headers: { Cookie: `sendbook_session=${stored}` } })
      setUser(data.user)
      setToken(stored)
      setStore(await fetchStore(stored))
    } catch {
      await SecureStore.deleteItemAsync('session_token')
      setUser(null); setToken(null); setStore(null)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const login = async (email: string, password: string) => {
    const res = await fetch(BASE + '/api/dashboard/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Login failed' }))
      throw new Error(body.error)
    }
    const data = await res.json()
    const cookie = res.headers.get('set-cookie') || ''
    const match = cookie.match(/sendbook_session=([^;]+)/)
    const t = match?.[1]
    if (!t) throw new Error('No session token')
    await SecureStore.setItemAsync('session_token', t)
    setUser(data.user)
    setToken(t)
    setStore(await fetchStore(t))
  }

  const logout = async () => {
    if (token) {
      await api('/api/dashboard/logout', {
        method: 'POST',
        headers: { Cookie: `sendbook_session=${token}` },
      }).catch(() => {})
    }
    await SecureStore.deleteItemAsync('session_token')
    setUser(null); setToken(null); setStore(null)
  }

  return (
    <ctx.Provider value={{ user, store, token, isLoading, login, logout, refresh }}>
      {children}
    </ctx.Provider>
  )
}

export function useAuth() {
  return useContext(ctx)
}
