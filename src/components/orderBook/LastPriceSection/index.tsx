import { useMemo } from 'react'
import ArrowIcon from '@/assets/images/icon/IconArrowDown.svg?react'
import { useOrderBookStore } from '@/store'
import { compareSizeChange, numberFormatter } from '@/utils'
import { isNil } from 'ramda'
import styled from './style.module.css'
import clsx from 'clsx'
import Skeleton from '@/components/base/Skeleton'

export default function LastPriceSection() {
  const { prevLastPriceInfo: { price: prevPrice } = {}, lastPriceInfo: { price } = {} } =
    useOrderBookStore(state => state.state)

  const lastPriceClassName = useMemo(() => {
    if (isNil(prevPrice) || isNil(price)) return 'flat'
    const status = compareSizeChange(prevPrice, price)

    if (isNil(status)) return 'flat'
    return status ? 'increased' : 'decreased'
  }, [price, prevPrice])

  if (isNil(price)) {
    return <Skeleton style={{ height: '28px' }} />
  }

  return (
    <div className={clsx([styled['last-price-section'], styled[lastPriceClassName]])}>
      <div className={styled['last-price']}>
        {numberFormatter(price ?? 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </div>
      <ArrowIcon width={15} height={15} className={clsx([styled[`${lastPriceClassName}-icon`]])} />
    </div>
  )
}
