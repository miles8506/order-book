import { useEffect, useRef, useState } from 'react'

interface IUseThrottleOptions {
  intervalMs?: number
}

export function useThrottle<T>({ intervalMs = 100 }: IUseThrottleOptions = {}) {
  const [value, setValue] = useState<T>()
  const latestRef = useRef<T | null>(null)
  const timerRef = useRef<number | null>(null)

  const flush = () => {
    if (latestRef.current !== null) {
      setValue(latestRef.current)
      latestRef.current = null
    }
    timerRef.current = null
  }

  const update = (v: T) => {
    latestRef.current = v
    if (timerRef.current == null) {
      timerRef.current = window.setTimeout(flush, intervalMs)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  return { value, update }
}
