import { type CONTRACT_SYMBOL } from '@/constants'
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
  setOrderBookTopState: (data: { bids: IOrderBookTopState[]; asks: IOrderBookTopState[] }) => void
  setPrevOrderBookPriceMap: (data: {
    bids: IOrderBookTopState[]
    asks: IOrderBookTopState[]
  }) => void
  setLastPriceInfo: (data: ILastPriceState) => void
  setPrevLastPriceInfo: (data: ILastPriceState) => void
}

interface IOrderBookStore {
  state: {
    orderBookTopState: {
      bids: IOrderBookTopState[]
      asks: IOrderBookTopState[]
    }
    prevOrderBookPriceMap: {
      bids: Map<number, IPrevOrderBookPriceMap> | null
      asks: Map<number, IPrevOrderBookPriceMap> | null
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
        asks: null,
        bids: null,
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
      setOrderBookTopState(data) {
        set(store => {
          store.state.orderBookTopState = data
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
      setPrevOrderBookPriceMap({ bids, asks }) {
        set(store => {
          store.state.prevOrderBookPriceMap = {
            bids:
              bids.length > 0
                ? new Map(
                    bids.map(({ price, size, total, percent }) => [
                      price,
                      { size, total, percent },
                    ]),
                  )
                : null,
            asks:
              asks.length > 0
                ? new Map(
                    asks.map(({ price, size, total, percent }) => [
                      price,
                      { size, total, percent },
                    ]),
                  )
                : null,
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
