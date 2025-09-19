import { CONTRACT_SYMBOL, WS_URL } from '@/constants'
import { useWebSocket } from './useWebSocket'
import { isNotNil } from 'ramda'
import { useOrderBookStore } from '@/store'
import type { ILastPriceRes } from '@/types'

function useLastPriceStream() {
  const {
    actions: { setLastPriceInfo },
  } = useOrderBookStore()

  const { subscribe } = useWebSocket<ILastPriceRes>({
    url: WS_URL.LAST_PRICE,
    args: [`tradeHistoryApi:${CONTRACT_SYMBOL.BTCPFC}`],
    onopen() {
      subscribe()
    },
    onmessage({ parseData: { data: lastPriceData } }) {
      isNotNil(lastPriceData) && setLastPriceInfo(lastPriceData[0])
    },
  })
}

export { useLastPriceStream }
