import type { CONTRACT_SYMBOL } from '@/constants'

interface IUpdatePriceData {
  bids: Array<[string, string]>
  asks: Array<[string, string]>
  seqNum: number
  prevSeqNum: number
  type: 'snapshot' | 'delta'
  timestamp: number
  symbol: CONTRACT_SYMBOL
}

interface IUpdatePriceRes {
  topic: string
  data: IUpdatePriceData
}

export { type IUpdatePriceRes, type IUpdatePriceData }
