interface ILastPrice {
  symbol: string
  side: 'BUY' | 'SELL'
  size: number
  price: number
  tradeId: number
  timestamp: number // Unix timestamp (ms)
}

interface ILastPriceRes {
  topic: string
  data: ILastPrice[]
}

export { type ILastPrice, type ILastPriceRes }
