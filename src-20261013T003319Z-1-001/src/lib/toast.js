import { useSyncExternalStore } from 'react'

let list = []
const subs = new Set()
const emit = () => subs.forEach((f) => f())
const subscribe = (f) => { subs.add(f); return () => subs.delete(f) }
const snapshot = () => list

export const toast = (text, kind = 'info') => {
  const id = Math.random()
  list = [...list, { id, text, kind }]
  emit()
  setTimeout(() => { list = list.filter((t) => t.id !== id); emit() }, 3400)
}

export const useToasts = () => useSyncExternalStore(subscribe, snapshot)

// Run an action; show its error (or an optional success message) as a toast.
export function tryDo(fn, okMessage) {
  try {
    const result = fn()
    if (okMessage) toast(okMessage, 'ok')
    return result === undefined ? true : result
  } catch (e) {
    toast(e.message, 'err')
    return false
  }
}
