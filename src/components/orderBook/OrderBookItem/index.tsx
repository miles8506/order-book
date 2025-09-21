import styled from './style.module.css'
import clsx from 'clsx'
import { DIRECTION, ORDER_BOOK_TYPE } from '@/constants'
import { numberFormatter } from '@/utils'

interface IOrderBookItemProps {
  total: number
  price: number
  size: number
  type: ORDER_BOOK_TYPE
  isNew: boolean
  direction: DIRECTION
  percent: number
}

export default function OrderBookItem({
  total,
  price,
  size,
  type,
  isNew,
  direction,
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
          direction === DIRECTION.INCREASED && styled['order-book-item-size-increased'],
          direction === DIRECTION.DECREASED && styled['order-book-item-size-decreased'],
        ])}
      >
        {numberFormatter(size)}
      </span>
      <div className={clsx([styled['order-book-item-cell'], styled['order-book-item-total']])}>
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
      </div>
    </div>
  )
}
