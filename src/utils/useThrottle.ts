import { useEffect, useRef, useState } from 'react'

interface IUseThrottleOptions {
  intervalMs?: number
}

export function useThrottle<T>({ intervalMs = 100 }: IUseThrottleOptions = {}) {
  const [value, setValue] = useState<T | null>(null)
  const latestRef = useRef<T | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const update = (value: T) => {
    latestRef.current = value
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (latestRef.current !== null) {
        setValue(latestRef.current)
        latestRef.current = null
      }
    }, intervalMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [intervalMs])

  return { value, update }
}
