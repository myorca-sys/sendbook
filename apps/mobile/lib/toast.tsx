import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' }

type ToastContextType = {
  toasts: Toast[]
  showToast: (message: string, type?: Toast['type']) => void
  hideToast: (id: number) => void
}

const ToastCtx = createContext<ToastContextType>({ toasts: [], showToast: () => {}, hideToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  const hideToast = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  return (
    <ToastCtx.Provider value={{ toasts, showToast, hideToast }}>
      {children}
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}