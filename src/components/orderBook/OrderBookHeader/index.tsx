import styled from './style.module.css'
import clsx from 'clsx'

export default function OrderBookHeader() {
  return (
    <div className={styled['order-book-header']}>
      <span className={clsx(styled['order-book-header-cell'], styled['order-book-header-price'])}>
        Price (USD)
      </span>
      <span className={clsx(styled['order-book-header-cell'], styled['order-book-header-size'])}>
        Size
      </span>
      <span className={clsx(styled['order-book-header-cell'], styled['order-book-header-total'])}>
        Total
      </span>
    </div>
  )
}
