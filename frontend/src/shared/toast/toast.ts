export type ToastKind = 'success' | 'error'

export type ToastMessage = {
  id: string
  kind: ToastKind
  message: string
  duration: number
}

type ToastListener = (message: ToastMessage) => void

const listeners = new Set<ToastListener>()

function publish(kind: ToastKind, message: string, duration = 4_000): void {
  const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
  const toastMessage = { id, kind, message, duration }
  listeners.forEach((listener) => listener(toastMessage))
}

export const toast = {
  success: (message: string, duration?: number) => publish('success', message, duration),
  error: (message: string, duration?: number) => publish('error', message, duration),
  subscribe: (listener: ToastListener) => {
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  },
}
