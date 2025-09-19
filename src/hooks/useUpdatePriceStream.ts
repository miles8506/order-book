import { CONTRACT_SYMBOL, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import type { IUpdatePriceData, IUpdatePriceRes } from '@/types'
import { isNil, isNotNil } from 'ramda'
import { updateOrderBookTop, useThrottle } from '@/utils'
import { useOrderBookStore } from '@/store'
import { useEffect, useRef } from 'react'

function useUpdatePriceStream() {
  const {
    actions: { setOrderBookState },
  } = useOrderBookStore()
  const { value, update } = useThrottle<IUpdatePriceData>({
    intervalMs: 20,
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

    setOrderBookState({
      ...value,
      bids: isDelta.current
        ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.bids, value.bids)
        : value.bids,
      asks: isDelta
        ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.asks, value.asks)
        : value.asks,
    })

    // setOrderBookState({
    //   ...value,
    //   bids: isDelta.current
    //     ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.bids, value.bids).slice(
    //         0,
    //         MAX_COUNT,
    //       )
    //     : value.bids.slice(0, MAX_COUNT),
    //   asks: isDelta
    //     ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.asks, value.asks).slice(
    //         0,
    //         MAX_COUNT,
    //       )
    //     : value.asks.slice(0, MAX_COUNT),
    // })
  }, [value])
}

export { useUpdatePriceStream }
