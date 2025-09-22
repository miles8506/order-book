import { ORDER_BOOK_TYPE, type CONTRACT_SYMBOL } from '@/constants'
import { formatOrderBook } from '@/utils'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface IOrderBookState {
  bids: Array<[string, string]>
  asks: Array<[string, string]>
  seqNum: number | null
  prevSeqNum: number | null
  type: 'snapshot' | 'delta' | null
  timestamp: number | null
  symbol: CONTRACT_SYMBOL | null
}
interface IOrderBookTopState {
  price: number
  size: number
  total: number
  percent: number
}

interface ILastPriceState {
  symbol: string | null
  side: 'BUY' | 'SELL' | null
  size: number | null
  price: number | null
  tradeId: number | null
  timestamp: number | null
}

interface IPrevOrderBookPriceMap {
  size: number
  total: number
  percent: number
}

interface IOrderBookActions {
  setOrderBookTopState: (
    data: {
      bids: Array<[string, string]>
      asks: Array<[string, string]>
    },
    maxCount: number,
  ) => void
  setPrevOrderBookPriceMap: (
    data: {
      bids: Array<[string, string]>
      asks: Array<[string, string]>
    },
    maxCount: number,
  ) => void
  setLastPriceInfo: (data: ILastPriceState) => void
  setPrevLastPriceInfo: (data: ILastPriceState) => void
}

interface IOrderBookStore {
  state: {
    orderBookTopState: {
      bids: IOrderBookTopState[]
      asks: IOrderBookTopState[]
    }
    // prevOrderBookState: IOrderBookState
    prevOrderBookPriceMap: {
      bids: Map<number, IPrevOrderBookPriceMap>
      asks: Map<number, IPrevOrderBookPriceMap>
    }
    lastPriceInfo: ILastPriceState
    prevLastPriceInfo: ILastPriceState
  }
  actions: IOrderBookActions
}

export const useOrderBookStore = create<IOrderBookStore>()(
  immer(set => ({
    state: {
      orderBookTopState: {
        bids: [],
        asks: [],
      },
      prevOrderBookPriceMap: {
        asks: new Map(),
        bids: new Map(),
      },
      lastPriceInfo: {
        symbol: null,
        side: null,
        size: null,
        price: null,
        tradeId: null,
        timestamp: null,
      },
      prevLastPriceInfo: {
        symbol: null,
        side: null,
        size: null,
        price: null,
        tradeId: null,
        timestamp: null,
      },
    },
    actions: {
      setOrderBookTopState({ bids, asks }, maxCount) {
        set(store => {
          store.state.orderBookTopState = {
            bids: formatOrderBook(bids, ORDER_BOOK_TYPE.BIDS, maxCount),
            asks: formatOrderBook(asks, ORDER_BOOK_TYPE.ASKS, maxCount),
          }
        })
      },
      setLastPriceInfo(data) {
        set(store => {
          store.state.lastPriceInfo = data
        })
      },
      setPrevLastPriceInfo(data) {
        set(store => {
          store.state.prevLastPriceInfo = data
        })
      },
      setPrevOrderBookPriceMap({ bids, asks }, maxCount) {
        set(store => {
          store.state.prevOrderBookPriceMap = {
            bids: new Map(
              formatOrderBook(bids, ORDER_BOOK_TYPE.BIDS, maxCount).map(
                ({ price, size, total, percent }) => [price, { size, total, percent }],
              ),
            ),
            asks: new Map(
              formatOrderBook(asks, ORDER_BOOK_TYPE.ASKS, maxCount).map(
                ({ price, size, total, percent }) => [price, { size, total, percent }],
              ),
            ),
          }
        })
      },
    },
  })),
)

export {
  type IOrderBookState,
  type IOrderBookTopState,
  type ILastPriceState,
  type IPrevOrderBookPriceMap,
}
