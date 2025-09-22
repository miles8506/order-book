import { useOrderBookStore } from '@/store'
import { formatPriceStatus } from '@/utils'
import OrderBookItem from './OrderBookItem'
import { ORDER_BOOK_TYPE } from '@/constants'
import Skeleton from '../base/Skeleton'
import { MAX_COUNT } from '@/hooks/useUpdatePriceStream'

interface IOrderBookProps {
  type: ORDER_BOOK_TYPE
}

export default function OrderBook({ type }: IOrderBookProps) {
  const { prevOrderBookPriceMap, formatOrderBookState } = useOrderBookStore(state => state.state)
  const orderBookList = formatPriceStatus(prevOrderBookPriceMap[type], formatOrderBookState[type])

  if (orderBookList.length === 0) {
    return Array(MAX_COUNT)
      .fill(null)
      .map(() => <Skeleton style={{ height: '20px' }} />)
  }

  return (
    <>
      {orderBookList.map((item, index) => {
        return <OrderBookItem key={index} type={type} {...item} />
      })}
    </>
  )
}
