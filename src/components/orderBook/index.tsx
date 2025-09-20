import React, { useEffect, useMemo, useRef } from 'react'
import { useOrderBookStore } from '@/store'
import { formatOrderBook } from '@/utils'
import OrderBookItem from './OrderBookItem'
import { ORDER_BOOK_TYPE } from '@/constants'

interface IOrderBookProps {
  type: ORDER_BOOK_TYPE
  maxCount: number
}

export interface IPrevOrderPriceMap {
  size: number
  total: number
  index: number
}

export default function OrderBook({ type, maxCount }: IOrderBookProps) {
  const { state: { orderBook = { asks: [], bids: [] } } = {} } = useOrderBookStore()

  const prevOrderPriceMap = useRef<Map<number, IPrevOrderPriceMap> | null>(null)
  const orderBookList = useMemo(
    () => formatOrderBook(orderBook[type], type, maxCount),
    [orderBook[type], type],
  )

  useEffect(() => {
    prevOrderPriceMap.current = new Map(
      orderBookList.map(({ price, size, total }, index) => [price, { size, total, index }]),
    )
  }, [orderBookList])

  return (
    <>
      {orderBookList.map((item, index) => (
        <OrderBookItem
          key={item.price}
          type={type}
          prevOrderPriceMap={prevOrderPriceMap.current}
          index={index}
          {...item}
        />
      ))}
    </>
  )
}
