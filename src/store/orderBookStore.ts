import type { CONTRACT_SYMBOL } from '@/constants'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface IOrderBookState {
  bids: Array<[string, string]>
  asks: Array<[string, string]>
  seqNum: number | null
  prevSeqNum: number | null
  type: 'snapshot' | 'delta' | null
  timestamp: number | null
  symbol: CONTRACT_SYMBOL | null
}

export interface ILastPriceState {
  symbol: string | null
  side: 'BUY' | 'SELL' | null
  size: number | null
  price: number | null
  tradeId: number | null
  timestamp: number | null // Unix timestamp (ms)
}

interface IOrderBookActions {
  setOrderBookState: (data: IOrderBookState) => void
  setLastPriceInfo: (data: ILastPriceState) => void
}

interface IOrderBookStore {
  state: {
    orderBook: IOrderBookState
    lastPriceInfo: ILastPriceState
  }
  actions: IOrderBookActions
}

export const useOrderBookStore = create<IOrderBookStore>()(
  immer(set => ({
    state: {
      orderBook: {
        bids: [],
        asks: [],
        seqNum: null,
        prevSeqNum: null,
        type: null,
        timestamp: null,
        symbol: null,
      },
      lastPriceInfo: {
        symbol: null,
        side: null,
        size: null,
        price: null,
        tradeId: null,
        timestamp: null,
      },
    },
    actions: {
      setOrderBookState(data) {
        set(store => {
          store.state.orderBook = data
        })
      },
      setLastPriceInfo(data) {
        set(store => {
          store.state.lastPriceInfo = data
        })
      },
    },
  })),
)
