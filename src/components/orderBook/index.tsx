import { useOrderBookStore } from '@/store'
import { formatPriceStatus } from '@/utils'
import OrderBookItem from './OrderBookItem'
import { ORDER_BOOK_TYPE } from '@/constants'

interface IOrderBookProps {
  type: ORDER_BOOK_TYPE
}

export default function OrderBook({ type }: IOrderBookProps) {
  const { prevOrderBookPriceMap, formatOrderBookState } = useOrderBookStore(state => state.state)
  const orderBookList = formatPriceStatus(prevOrderBookPriceMap[type], formatOrderBookState[type])

  return (
    <>
      {orderBookList.map(item => {
        return <OrderBookItem key={item.price} type={type} {...item} />
      })}
    </>
  )
}
