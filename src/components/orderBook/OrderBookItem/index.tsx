import React from 'react'
import styled from './style.module.css'
import clsx from 'clsx'

interface IOrderBookItemProps {
  total: number
  price: string
  size: string
}

export default function OrderBookItem({ total, price, size }: IOrderBookItemProps) {
  return (
    <div className={styled['order-book-item']}>
      <span className={clsx([styled['order-book-item-cell'], styled['order-book-item-price']])}>
        {price}
      </span>
      <span className={clsx([styled['order-book-item-cell'], styled['order-book-item-size']])}>
        {size}
      </span>
      <span className={clsx([styled['order-book-item-cell'], styled['order-book-item-total']])}>
        {total}
      </span>
    </div>
  )
}
