import { CONTRACT_SYMBOL, MAX_COUNT, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import type { IUpdatePriceRes } from '@/types'
import { isNotNil } from 'ramda'
import { updateOrderBookTop } from '@/utils'
import { useOrderBookStore, type IOrderBookState } from '@/store'
import { startTransition, useRef } from 'react'

function useUpdatePriceStream() {
  const {
    actions: {
      setOrderBookState,
      setPrevOrderBookState,
      setFormatOrderBookState,
      setPrevOrderBookPriceMap,
    },
  } = useOrderBookStore()
  const orderBook = useRef<IOrderBookState | null>(null)
  const prevOrderBookTopBids = useRef<Array<[string, string]>>([])
  const prevOrderBookTopAsks = useRef<Array<[string, string]>>([])

  // REFACTOR
  // const { value, update } = useThrottle<IUpdatePriceData>({
  //   intervalMs: 25,
  // })
  // const isDelta = useRef(false)

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
        orderBook.current = data

        const bids = isDelta
          ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.bids ?? [], data.bids)
          : data.bids
        const asks = isDelta
          ? updateOrderBookTop(useOrderBookStore.getState().state.orderBook.asks, data.asks)
          : data.asks

        setOrderBookState({
          ...data,
          bids,
          asks,
        })

        setFormatOrderBookState(
          {
            bids,
            asks,
          },
          MAX_COUNT,
        )

        setPrevOrderBookPriceMap(
          {
            bids: prevOrderBookTopBids.current,
            asks: prevOrderBookTopAsks.current,
          },
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

      // update(data)
    },
  })

  // REFACTOR
  // useEffect(() => {
  //   if (isNil(value)) return
  //   startTransition(() => {
  //     console.log('old:', bids)
  //     console.log('new:', value.bids)
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
