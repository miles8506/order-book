import React, { useEffect, useMemo, useRef, useState } from 'react'
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

  // const [orderBookList, setOrderBookList] = useState<
  //   {
  //     price: number
  //     size: number
  //     total: number
  //   }[]
  // >([])
  const prevOrderPriceMap = useRef<Map<number, IPrevOrderPriceMap> | null>(null)
  const orderBookList = useMemo(
    () => formatOrderBook(orderBook[type], type, maxCount),
    [orderBook[type], type],
  )

  // useEffect(() => {
  //   setOrderBookList(prev => {
  //     if (prev.length > 0) {
  //       prevOrderPriceMap.current = new Map(
  //         prev.map(({ price, size, total }, index) => [price, { size, total, index }]),
  //       )
  //     }
      // console.log("prev:", prevOrderPriceMap.current);
      // console.log("curr:", formatOrderBook(orderBook[type], type, maxCount));
      // console.log('object');
  //     return formatOrderBook(orderBook[type], type, maxCount)
  //   })
  // }, [orderBook[type], type])

  return (
    <>
      {orderBookList.map((item, index) => (
        <OrderBookItem
          key={index}
          type={type}
          prevOrderPriceMap={prevOrderPriceMap.current}
          index={index}
          {...item}
        />
      ))}
    </>
  )
}
