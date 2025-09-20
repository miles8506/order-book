import React, { useEffect, useRef, useState } from 'react'
import styled from './style.module.css'
import clsx from 'clsx'
import { ORDER_BOOK_TYPE } from '@/constants'
import { numberFormatter } from '@/utils'
import { isNil, isNotNil } from 'ramda'
import type { IPrevOrderPriceMap } from '..'

interface IOrderBookItemProps {
  total: number
  price: number
  size: number
  type: ORDER_BOOK_TYPE
  index: number
  prevOrderPriceMap: Map<number, IPrevOrderPriceMap> | null
}

export default function OrderBookItem({
  total,
  price,
  size,
  type,
  index,
  prevOrderPriceMap,
}: IOrderBookItemProps) {
  const [isNewOrder, setIsNewOrder] = useState(false)
  const [isSizeIncreased, setIsSizeIncreased] = useState<boolean | null>(null)

  const newOrderTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const sizeIncreasedTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // highline bar background
  useEffect(() => {
    if (isNil(prevOrderPriceMap)) {
      return
    }

    if (!prevOrderPriceMap.has(price) && !isNewOrder) {
      setIsNewOrder(true)

      newOrderTimeoutRef.current && clearTimeout(newOrderTimeoutRef.current)
      newOrderTimeoutRef.current = setTimeout(() => {
        setIsNewOrder(false)
      }, 100)
    }
  }, [prevOrderPriceMap])

  // size cell background
  useEffect(() => {
    if (isNil(prevOrderPriceMap)) return

    if (isNotNil(prevOrderPriceMap.has(price)) && prevOrderPriceMap.get(price)?.index === index) {
      const isIncreased = (prevOrderPriceMap.get(price)?.size ?? 0) > price
      const isDecreased = (prevOrderPriceMap.get(price)?.size ?? 0) < price
      if (isIncreased) {
        setIsSizeIncreased(true)
      }

      if (isDecreased) {
        setIsSizeIncreased(false)
      }

      sizeIncreasedTimeoutRef.current && clearTimeout(sizeIncreasedTimeoutRef.current)
      sizeIncreasedTimeoutRef.current = setTimeout(() => {
        setIsSizeIncreased(null)
      }, 100)
    } else {
      setIsSizeIncreased(null)
    }
  }, [prevOrderPriceMap])

  return (
    <div
      className={clsx([
        styled['order-book-item'],
        isNewOrder
          ? type === ORDER_BOOK_TYPE.BIDS
            ? styled['order-book-item-bids-new-price']
            : styled['order-book-item-asks-new-price']
          : styled['order-book-item-base-bg'],
      ])}
    >
      <span
        className={clsx([
          styled['order-book-item-cell'],
          styled['order-book-item-price'],
          type === ORDER_BOOK_TYPE.BIDS
            ? styled['order-book-item-price-bids']
            : styled['order-book-item-price-asks'],
        ])}
      >
        {numberFormatter(price, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </span>
      <span
        className={clsx([
          styled['order-book-item-cell'],
          styled['order-book-item-size'],
          isNil(isSizeIncreased)
            ? ''
            : isSizeIncreased
              ? styled['order-book-item-size-increased']
              : styled['order-book-item-size-decreased'],
        ])}
      >
        {numberFormatter(size)}
      </span>
      <span className={clsx([styled['order-book-item-cell'], styled['order-book-item-total']])}>
        {numberFormatter(total)}
      </span>
    </div>
  )
}
