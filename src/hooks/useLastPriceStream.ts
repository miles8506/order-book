import { CONTRACT_SYMBOL, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import { isNotNil } from 'ramda'
import { useOrderBookStore } from '@/store'
import type { ILastPriceRes } from '@/types'

function useLastPriceStream() {
  const {
    actions: { setLastPriceInfo, setPrevLastPriceInfo },
  } = useOrderBookStore()

  const { subscribe } = useWebSocket<ILastPriceRes>({
    url: WS_URL.LAST_PRICE,
    args: [`tradeHistoryApi:${CONTRACT_SYMBOL.BTCPFC}`],
    cachePrevData: true,
    onopen() {
      subscribe()
    },
    onmessage({ parseData: { data }, prevData }) {
      if (isNotNil(data)) {
        setLastPriceInfo(data[0])
      }

      if (isNotNil(prevData?.data)) {
        setPrevLastPriceInfo(prevData.data[0])
      }
    },
  })
}

export { useLastPriceStream }
