import React from 'react'
import styled from './style.module.css'
import clsx from 'clsx'

interface IOrderBookItemProps {
  total: number
  price: string
  size: string
  unique: number
}

export default function OrderBookItem({ total, price, size, unique }: IOrderBookItemProps) {
  return (
    <div className={styled['order-book-item']}>
      <div
        className={clsx([styled['order-book-item-cell'], styled['order-book-item-price']])}
        key={price + unique}
      >
        {price}
      </div>
      <div
        className={clsx([styled['order-book-item-cell'], styled['order-book-item-size']])}
        key={size + unique}
      >
        {size}
      </div>
      <div
        className={clsx([styled['order-book-item-cell'], styled['order-book-item-total']])}
        key={total + unique}
      >
        {total}
      </div>
    </div>
  )
}
