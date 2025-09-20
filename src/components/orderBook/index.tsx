import { useEffect, useMemo, useRef } from 'react'
import { useOrderBookStore } from '@/store'
import { formatOrderBook, formatPriceStatus } from '@/utils'
import OrderBookItem from './OrderBookItem'
import { ORDER_BOOK_TYPE } from '@/constants'

interface IOrderBookProps {
  type: ORDER_BOOK_TYPE
  maxCount: number
}

export interface IPrevOrderPriceMap {
  size: number
  total: number
  percent: number
}

export default function OrderBook({ type, maxCount }: IOrderBookProps) {
  const { orderBook = { asks: [], bids: [] } } = useOrderBookStore(state => state.state)

  const prevOrderPriceMap = useRef<Map<number, IPrevOrderPriceMap> | null>(null)
  const orderBookList = useMemo(() => {
    const data = formatOrderBook(orderBook[type], type, maxCount)
    return formatPriceStatus(prevOrderPriceMap.current, data)
  }, [orderBook[type], type])

  useEffect(() => {
    prevOrderPriceMap.current = new Map(
      orderBookList.map(({ price, size, total, percent }) => [price, { size, total, percent }]),
    )
  }, [orderBookList])

  return (
    <>
      {orderBookList.map(item => {
        return (
          <OrderBookItem
            key={item.price}
            type={type}
            {...item}
          />
        )
      })}
    </>
  )
}
