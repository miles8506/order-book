import React from 'react'
import styled from './style.module.css'
import clsx from 'clsx'

export default function OrderBookHeader() {
  return (
    <div className={styled['order-book-header']}>
      <div className={clsx(styled['order-book-header-cell'], styled['order-book-header-price'])}>
        Price (USD)
      </div>
      <div className={clsx(styled['order-book-header-cell'], styled['order-book-header-size'])}>
        Size
      </div>
      <div className={clsx(styled['order-book-header-cell'], styled['order-book-header-total'])}>
        Total
      </div>
    </div>
  )
}
