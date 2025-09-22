import { type IOrderBookTopState, type IPrevOrderBookPriceMap } from '@/store'
import { DIRECTION, ORDER_BOOK_TYPE } from '@/constants'
import { isNil } from 'ramda'
import { getSizeChangeDirection } from './getSizeChangeDirection'

function updateOrderBookTop(prevData: Array<[string, string]>, currData: Array<[string, string]>) {
  const map = new Map([...prevData, ...currData])

  return Array.from(map.entries())
    .filter(([_, size]) => Number(size) !== 0)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
}

function formatOrderBook(data: Array<[string, string]>, type: ORDER_BOOK_TYPE, maxCount: number) {
  const sliceOrderBook =
    type === ORDER_BOOK_TYPE.BIDS ? data.slice(0, maxCount) : data.slice(-maxCount)

  const totals = sliceOrderBook.map((_, index, arr) =>
    type === ORDER_BOOK_TYPE.BIDS
      ? arr.slice(0, index + 1).reduce((prev, [_, size]) => prev + Number(size), 0)
      : arr.slice(index).reduce((prev, [_, size]) => prev + Number(size), 0),
  )
  const maxTotal = Math.max(...totals)

  return sliceOrderBook.map(([price, size], index) => {
    const total = totals[index]
    return {
      price: Number(price),
      size: Number(size),
      total,
      percent: maxTotal > 0 ? (total / maxTotal) * 100 : 0,
    }
  })
}

function formatPriceStatus(
  prevOrderPriceMap: Map<number, IPrevOrderBookPriceMap> | null,
  currOrderBookList: IOrderBookTopState[],
) {
  return isNil(prevOrderPriceMap)
    ? currOrderBookList.map(item => ({ ...item, isNew: false, direction: DIRECTION.FLAT }))
    : currOrderBookList.map(item => {
        const isNew = !prevOrderPriceMap.has(item.price)
        const direction = isNew
          ? DIRECTION.FLAT
          : getSizeChangeDirection(prevOrderPriceMap.get(item.price)!.size, item.size)

        return {
          ...item,
          isNew,
          direction,
        }
      })
}

export { updateOrderBookTop, formatOrderBook, formatPriceStatus }
