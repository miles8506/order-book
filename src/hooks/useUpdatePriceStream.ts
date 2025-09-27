import { CONTRACT_SYMBOL, ORDER_BOOK_TYPE, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import type { IUpdatePriceRes } from '@/types'
import { isNotNil } from 'ramda'
import { formatOrderBook, updateOrderBookTop } from '@/utils'
import { useOrderBookStore } from '@/store'
import { startTransition, useRef } from 'react'

export const MAX_COUNT = 8

function useUpdatePriceStream() {
  const {
    actions: { setOrderBookTopState, setPrevOrderBookPriceMap },
  } = useOrderBookStore()
  const prevOrderBookTopBids = useRef<Array<[string, string]>>([])
  const prevOrderBookTopAsks = useRef<Array<[string, string]>>([])

  const { subscribe, unsubscribe, clearPrevData, initWebSocket, closeWebSocket } =
    useWebSocket<IUpdatePriceRes>({
      url: WS_URL.UPDATE_PRICE,
      args: [`update:${CONTRACT_SYMBOL.BTCPFC}_0`],
      cachePrevData: true,
      onopen() {
        subscribe()
      },
      onmessage({ parseData: { data }, prevData }) {
        if (isNotNil(prevData?.data) && data.prevSeqNum !== prevData.data.seqNum) {
          clearPrevData()
          unsubscribe()
          subscribe()
          return
        }

        startTransition(() => {
          const isDelta = data.type === 'delta'
          const bids = isDelta
            ? updateOrderBookTop(prevOrderBookTopBids.current, data.bids)
            : data.bids
          const asks = isDelta
            ? updateOrderBookTop(prevOrderBookTopAsks.current, data.asks)
            : data.asks

          setOrderBookTopState({
            bids: formatOrderBook(bids, ORDER_BOOK_TYPE.BIDS, MAX_COUNT),
            asks: formatOrderBook(asks, ORDER_BOOK_TYPE.ASKS, MAX_COUNT),
          })

          setPrevOrderBookPriceMap({
            bids: formatOrderBook(prevOrderBookTopBids.current, ORDER_BOOK_TYPE.BIDS, MAX_COUNT),
            asks: formatOrderBook(prevOrderBookTopAsks.current, ORDER_BOOK_TYPE.ASKS, MAX_COUNT),
          })

          prevOrderBookTopBids.current = bids
          prevOrderBookTopAsks.current = asks
        })
      },
    })

  return {
    initWebSocket,
    subscribe,
    unsubscribe,
    clearPrevData,
    closeWebSocket,
  }
}

export { useUpdatePriceStream }
