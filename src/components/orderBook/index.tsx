import React, { useEffect, type PropsWithChildren } from 'react'
import OrderBookHeader from './OrderBookHeader'
import { useOrderBookStore } from '@/store'
import { formatOrderBookList } from '@/utils'
import OrderBookItem from './OrderBookItem'

interface IOrderBookProps {
  type: 'bids' | 'asks'
}

export default function OrderBook({ type, children }: PropsWithChildren<IOrderBookProps>) {
  const { state: { orderBook } = {} } = useOrderBookStore()
  const data = formatOrderBookList(orderBook?.[type] ?? [], orderBook?.seqNum ?? 0, type)

  useEffect(() => {
    console.log(data)
    // if (data.length !== 8) console.log('error:', data.length)
  }, [data])

  return (
    <>
      {children}
      {data.map((item, index) => (
        <OrderBookItem {...item} key={index} />
      ))}
    </>
  )
}
