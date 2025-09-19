import { CONTRACT_SYMBOL, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import type { IUpdatePriceRes } from '@/types'
import { isNotNil } from 'ramda'
import { updateOrderBookTop } from '@/utils'
import { useOrderBookStore } from '@/store'
import { startTransition, useRef } from 'react'

function useUpdatePriceStream() {
  const {
    actions: { setOrderBookState },
  } = useOrderBookStore()
  // TODO
  // const { value, update } = useThrottle<IUpdatePriceData>({
  //   intervalMs: 20,
  // })
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

      startTransition(() => {
        setOrderBookState({
          ...data,
          bids: isDelta.current
            ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.bids, data.bids)
            : data.bids,
          asks: isDelta
            ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.asks, data.asks)
            : data.asks,
        })
      })
    },
  })
}

export { useUpdatePriceStream }
