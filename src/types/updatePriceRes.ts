import type { CONTRACT_SYMBOL } from "@/constants"

interface IUpdatePriceData {
  bids: Array<[string, string]> // [price, amount]
  asks: Array<[string, string]> // [price, amount]
  seqNum: number
  prevSeqNum: number
  type: 'snapshot' | 'delta' // 根據常見 orderbook event 類型
  timestamp: number // unix ms
  symbol: CONTRACT_SYMBOL // e.g. "BTCPFC"
}

interface IUpdatePriceRes {
  topic: string // e.g. "update:BTCPFC_0"
  data: IUpdatePriceData
}

export {
  type IUpdatePriceRes,
  type IUpdatePriceData
}
