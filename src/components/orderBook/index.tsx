import React, { useEffect, useMemo } from 'react'
import { useOrderBookStore } from '@/store'
import { formatOrderBook } from '@/utils'
import OrderBookItem from './OrderBookItem'
import { ORDER_BOOK_TYPE } from '@/constants'

interface IOrderBookProps {
  type: ORDER_BOOK_TYPE
}

export default function OrderBook({ type }: IOrderBookProps) {
  const { state: { orderBook = { asks: [], bids: [] } } = {} } = useOrderBookStore()
  const orderBookList = useMemo(
    () => formatOrderBook(orderBook[type], type),
    [orderBook[type], type],
  )

  useEffect(() => {
    console.log(orderBookList)
  }, [orderBookList])

  return (
    <>
      {orderBookList.map((item, index) => (
        <OrderBookItem {...item} key={index} />
      ))}
    </>
  )
}
