import { useEffect, useState } from 'react'
import { toast, type ToastMessage } from './toast'

export default function ToastViewport() {
  const [items, setItems] = useState<ToastMessage[]>([])

  useEffect(() => toast.subscribe((item) => {
    setItems((current) => [...current, item])
    window.setTimeout(() => setItems((current) => current.filter((candidate) => candidate.id !== item.id)), item.duration)
  }), [])

  return (
    <div className="toast-viewport" aria-live="polite" aria-atomic="true">
      {items.map((item) => <div className={`toast toast--${item.kind}`} key={item.id} role="status">{item.message}</div>)}
    </div>
  )
}
