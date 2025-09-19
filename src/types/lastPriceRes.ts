interface ILastPrice {
  symbol: string
  side: 'BUY' | 'SELL'
  size: number
  price: number
  tradeId: number
  timestamp: number
}

interface ILastPriceRes {
  topic: string
  data: ILastPrice[]
}

export { type ILastPrice, type ILastPriceRes }
