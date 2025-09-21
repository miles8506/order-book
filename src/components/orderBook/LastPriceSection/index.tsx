import { useMemo } from 'react'
import ArrowIcon from '@/assets/images/icon/IconArrowDown.svg?react'
import { useOrderBookStore } from '@/store'
import { getSizeChangeDirection, numberFormatter } from '@/utils'
import { isNil } from 'ramda'
import styled from './style.module.css'
import clsx from 'clsx'
import Skeleton from '@/components/base/Skeleton'
import { DIRECTION } from '@/constants'

export default function LastPriceSection() {
  const { prevLastPriceInfo: { price: prevPrice } = {}, lastPriceInfo: { price } = {} } =
    useOrderBookStore(state => state.state)

  const directionClassName = useMemo(() => {
    if (isNil(prevPrice) || isNil(price)) return DIRECTION.FLAT

    return getSizeChangeDirection(prevPrice, price)
  }, [price, prevPrice])

  if (isNil(price)) {
    return <Skeleton style={{ height: '28px' }} />
  }

  return (
    <div className={clsx([styled['last-price-section'], styled[directionClassName]])}>
      <div className={styled['last-price']}>
        {numberFormatter(price ?? 0, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
      </div>
      <ArrowIcon width={15} height={15} className={clsx([styled[`${directionClassName}-icon`]])} />
    </div>
  )
}
