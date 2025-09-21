import { CONTRACT_SYMBOL, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import type { IUpdatePriceRes } from '@/types'
import { isNotNil } from 'ramda'
import { updateOrderBookTop } from '@/utils'
import { useOrderBookStore, type IOrderBookState } from '@/store'
import { startTransition, useRef } from 'react'

export const MAX_COUNT = 8

function useUpdatePriceStream() {
  const {
    actions: { setPrevOrderBookState, setFormatOrderBookState, setPrevOrderBookPriceMap },
  } = useOrderBookStore()
  const orderBook = useRef<IOrderBookState | null>(null)
  const prevOrderBookTopBids = useRef<Array<[string, string]>>([])
  const prevOrderBookTopAsks = useRef<Array<[string, string]>>([])

  // REFACTOR
  // const { value, update } = useThrottle<IUpdatePriceData>({
  //   intervalMs: 25,
  // })

  const { subscribe, unsubscribe } = useWebSocket<IUpdatePriceRes>({
    url: WS_URL.UPDATE_PRICE,
    args: [`update:${CONTRACT_SYMBOL.BTCPFC}_0`],
    cachePrevData: true,
    onopen() {
      subscribe()
    },
    onmessage({ parseData: { data }, prevData }) {
      if (isNotNil(prevData?.data) && data.prevSeqNum !== prevData?.data.seqNum) {
        unsubscribe()
        subscribe()
        return
      }

      startTransition(() => {
        const isDelta = data.type === 'delta'

        const bids = isDelta
          ? updateOrderBookTop(orderBook.current?.bids ?? [], data.bids)
          : data.bids
        const asks = isDelta
          ? updateOrderBookTop(orderBook.current?.asks ?? [], data.asks)
          : data.asks

        orderBook.current = { ...data, bids, asks }

        setFormatOrderBookState({ bids, asks }, MAX_COUNT)

        setPrevOrderBookPriceMap(
          { bids: prevOrderBookTopBids.current, asks: prevOrderBookTopAsks.current },
          MAX_COUNT,
        )

        if (isNotNil(prevData?.data)) {
          setPrevOrderBookState({
            ...prevData.data,
            bids: prevOrderBookTopBids.current,
            asks: prevOrderBookTopAsks.current,
          })
        }

        prevOrderBookTopBids.current = bids
        prevOrderBookTopAsks.current = asks
      })
    },
  })

  // REFACTOR
  // useEffect(() => {
  //   if (isNil(value)) return
  //   startTransition(() => {
  //     setOrderBookState({
  //       ...value,
  //       bids: isDelta.current ? updateOrderBookTop(bids ?? [], value.bids) : value.bids,
  //       asks: isDelta
  //         ? updateOrderBookTop(asks ?? [], value.asks)
  //         : value.asks,
  //     })
  //   })
  // }, [value])
}

export { useUpdatePriceStream }
