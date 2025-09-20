import { CONTRACT_SYMBOL, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import type { IUpdatePriceData, IUpdatePriceRes } from '@/types'
import { isNil, isNotNil } from 'ramda'
import { updateOrderBookTop, useThrottle } from '@/utils'
import { useOrderBookStore } from '@/store'
import { startTransition, useEffect, useRef } from 'react'

function useUpdatePriceStream() {
  const {
    actions: { setOrderBookState },
  } = useOrderBookStore()

  const { value, update } = useThrottle<IUpdatePriceData>({
    intervalMs: 30,
  })
  const isDelta = useRef(false)

  const { subscribe, unsubscribe } = useWebSocket<IUpdatePriceRes>({
    url: WS_URL.UPDATE_PRICE,
    args: [`update:${CONTRACT_SYMBOL.BTCPFC}_0`],
    cachePrevData: true,
    onopen() {
      subscribe()
    },
    onmessage({ parseData: { data }, prevData }) {
      isDelta.current = prevData?.data.type === 'delta'

      if (
        isNotNil(prevData?.data) &&
        isDelta.current &&
        data.prevSeqNum !== prevData?.data.seqNum
      ) {
        unsubscribe()
        subscribe()
        return
      }

      update(data)
    },
  })

  useEffect(() => {
    if (isNil(value)) return
    startTransition(() => {
      setOrderBookState({
        ...value,
        bids: isDelta.current
          ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.bids, value.bids)
          : value.bids,
        asks: isDelta
          ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.asks, value.asks)
          : value.asks,
      })
    })
  }, [value])
}

export { useUpdatePriceStream }
