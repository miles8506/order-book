import { parse, stringify } from '@/utils'
import { useEffect, useRef } from 'react'

interface IWebSocket<T> {
  url: string
  args: string[]
  cachePrevData?: boolean
  onopen?: () => void
  onmessage?: (payload: { ev: MessageEvent; parseData: T; prevData?: T | null }) => void
  onerror?: (ev: Event) => void
  onclose?: (ev: Event) => void
}

// check if response object has an event key
function hasEventKey(obj: unknown): obj is { event: string } {
  return typeof obj === 'object' && obj !== null && 'event' in obj
}

export function useWebSocket<T>({
  url,
  args,
  cachePrevData = false,
  onopen,
  onmessage,
  onerror,
  onclose,
}: IWebSocket<T>) {
  const socket = useRef<WebSocket | null>(null)
  const prevData = useRef<T | null>(null)

  const initWebSocket = () => {
    socket.current = new WebSocket(url)
    socket.current.onopen = () => {
      onopen?.()
    }
    socket.current.onmessage = (ev: MessageEvent) => {
      const parseData = parse<T>(ev.data)

      if (hasEventKey(parseData) && parseData.event === 'subscribe') return

      onmessage?.({ ev, parseData, ...(cachePrevData ? { prevData: prevData.current } : {}) })
      prevData.current = cachePrevData ? parseData : null
    }
    socket.current.onerror = ev => {
      console.error(ev)
      onerror?.(ev)
    }
    socket.current.onclose = ev => {
      onclose?.(ev)
    }
  }

  const subscribe = () => {
    socket.current?.send(stringify({ op: 'subscribe', args }))
  }

  const unsubscribe = () => {
    socket.current?.send(stringify({ op: 'unsubscribe', args }))
  }

  const closeWebSocket = () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      unsubscribe()
      socket.current.close()
    } else {
      socket.current?.close()
    }
  }

  const reconnect = () => {
    closeWebSocket()
    initWebSocket()
  }

  useEffect(() => {
    initWebSocket()

    return () => {
      closeWebSocket()
    }
  }, [url])

  return {
    socket,
    subscribe,
    unsubscribe,
    closeWebSocket,
    reconnect,
  }
}
