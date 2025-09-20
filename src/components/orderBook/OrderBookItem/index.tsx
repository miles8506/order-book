import styled from './style.module.css'
import clsx from 'clsx'
import { ORDER_BOOK_TYPE } from '@/constants'
import { numberFormatter } from '@/utils'
import { isNil } from 'ramda'

interface IOrderBookItemProps {
  total: number
  price: number
  size: number
  type: ORDER_BOOK_TYPE
  isNew: boolean
  isIncreased: boolean | null
  percent: number
}

export default function OrderBookItem({
  total,
  price,
  size,
  type,
  isNew,
  isIncreased,
  percent,
}: IOrderBookItemProps) {
  return (
    <div
      className={clsx([
        styled['order-book-item'],
        isNew
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
          isNil(isIncreased)
            ? ''
            : isIncreased
              ? styled['order-book-item-size-increased']
              : styled['order-book-item-size-decreased'],
        ])}
      >
        {numberFormatter(size)}
      </span>
      <span className={clsx([styled['order-book-item-cell'], styled['order-book-item-total']])}>
        <span
          className={clsx(
            styled['percent-bar'],
            type === ORDER_BOOK_TYPE.BIDS
              ? styled['bids-percent-bar-background-color']
              : styled['asks-percent-bar-background-color'],
          )}
          style={{
            width: `${percent}%`,
          }}
        />
        {numberFormatter(total)}
      </span>
    </div>
  )
}
