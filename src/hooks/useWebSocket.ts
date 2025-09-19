import { parse, stringify } from '@/utils'
import { useEffect, useRef } from 'react'

interface IWebSocket<T> {
  url: string
  args: string[]
  cachePrevData?: boolean
  onopen: () => void
  onmessage: (payload: { ev: MessageEvent; parseData: T; prevData?: T | null }) => void
}

export function useWebSocket<T>({
  url,
  args,
  cachePrevData = false,
  onopen,
  onmessage,
}: IWebSocket<T>) {
  const socket = useRef<WebSocket | null>(null)
  const prevData = useRef<T | null>(null)

  const subscribe = () => {
    socket.current?.send(stringify({ op: 'subscribe', args }))
  }

  const unsubscribe = () => {
    socket.current?.send(stringify({ op: 'unsubscribe', args }))
  }

  useEffect(() => {
    socket.current = new WebSocket(url)
    socket.current.onopen = () => onopen()
    socket.current.onmessage = (ev: MessageEvent) => {
      const parseData = parse<T>(ev.data)

      // TODO
      if ((parseData as unknown as any).event === 'subscribe') return

      onmessage({ ev, parseData, ...(cachePrevData ? { prevData: prevData.current } : {}) })
      prevData.current = cachePrevData ? parseData : null
    }
    socket.current.onerror = ev => {
      console.error(ev)
    }

    return () => {
      unsubscribe()
    }
  }, [])

  return {
    socket,
    subscribe,
    unsubscribe,
  }
}
