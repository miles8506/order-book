import { PING_PONG_TYPE } from '@/constants'
import { parse, stringify } from '@/utils'
import { useRef } from 'react'

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

const SEND_PING_TIMER = 10_000
const CHECK_PONG_TIMER = 5_000

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
  const pingTimer = useRef<NodeJS.Timeout | null>(null)
  const pongTimer = useRef<NodeJS.Timeout | null>(null)

  const clearPingTimer = () => {
    if (pingTimer.current) {
      clearTimeout(pingTimer.current)
      pingTimer.current = null
    }
  }

  const clearPongTimer = () => {
    if (pongTimer.current) {
      clearTimeout(pongTimer.current)
      pongTimer.current = null
    }
  }

  const sendPing = () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(PING_PONG_TYPE.PING)
    }
  }

  // start a timer, if no pong is received within CHECK_PONG_TIMER, trigger reconnect
  const startPongTimeout = () => {
    clearPongTimer()
    pongTimer.current = setTimeout(() => {
      reconnect()
    }, CHECK_PONG_TIMER)
  }

  const checkPingPongLoop = () => {
    clearPingTimer()

    pingTimer.current = setTimeout(() => {
      sendPing()
      startPongTimeout()
      checkPingPongLoop()
    }, SEND_PING_TIMER)
  }

  const initWebSocket = () => {
    socket.current = new WebSocket(url)
    socket.current.onopen = () => {
      // clear prev data when reconnect
      clearPrevData()
      sendPing()
      startPongTimeout()
      checkPingPongLoop()
      onopen?.()
    }
    socket.current.onmessage = (ev: MessageEvent) => {
      if (ev.data === PING_PONG_TYPE.PONG) {
        clearPongTimer()
        return
      }

      const parseData = parse<T>(ev.data)

      if (hasEventKey(parseData) && parseData.event === 'subscribe') return

      onmessage?.({ ev, parseData, ...(cachePrevData ? { prevData: prevData.current } : {}) })
      prevData.current = cachePrevData ? parseData : null
    }
    socket.current.onerror = ev => {
      console.error(ev)
      clearPingTimer()
      clearPongTimer()
      onerror?.(ev)
    }
    socket.current.onclose = ev => {
      clearPingTimer()
      clearPongTimer()
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
    if (
      socket.current &&
      (socket.current.readyState === WebSocket.OPEN ||
        socket.current.readyState === WebSocket.CONNECTING)
    ) {
      socket.current.close()
    }
  }

  const reconnect = () => {
    unsubscribe()
    closeWebSocket()
    initWebSocket()
  }

  const clearPrevData = () => {
    prevData.current = null
  }

  return {
    initWebSocket,
    subscribe,
    unsubscribe,
    closeWebSocket,
    reconnect,
    clearPrevData,
  }
}
