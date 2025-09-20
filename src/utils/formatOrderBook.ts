import type { IPrevOrderPriceMap } from '@/components/orderBook'
import { ORDER_BOOK_TYPE } from '@/constants'
import { isNil } from 'ramda'

function updateOrderBookTop(prevData: Array<[string, string]>, currData: Array<[string, string]>) {
  const map = new Map([...prevData, ...currData])

  return Array.from(map.entries())
    .filter(([_, size]) => Number(size) !== 0)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
}

function calculateTotal(data: Array<[string, string]>) {
  return data.reduce((prev, [_, size]) => prev + Number(size), 0)
}

function formatOrderBook(data: Array<[string, string]>, type: ORDER_BOOK_TYPE, maxCount: number) {
  const sliceOrderBook =
    type === ORDER_BOOK_TYPE.BIDS ? data.slice(0, maxCount) : data.slice(-maxCount)

  const totals = sliceOrderBook.map(([], index, arr) =>
    type === ORDER_BOOK_TYPE.BIDS
      ? arr.slice(0, index + 1).reduce((prev, [_, size]) => prev + Number(size), 0)
      : arr.slice(index).reduce((prev, [_, size]) => prev + Number(size), 0),
  )
  const maxTotal = Math.max(...totals)

  return sliceOrderBook.map(([price, size], index, arr) => {
    const total = totals[index]
    return {
      price: Number(price),
      size: Number(size),
      total,
      percent: maxTotal > 0 ? (total / maxTotal) * 100 : 0,
    }
  })
}

function compareSizeChange(oldSize: number, newSize: number) {
  if (newSize > oldSize) return true
  if (newSize < oldSize) return false
  return null
}

function formatPriceStatus(
  prevOrderPriceMap: Map<number, IPrevOrderPriceMap> | null,
  currOrderPriceList: {
    price: number
    size: number
    total: number
    percent: number
  }[],
) {
  return isNil(prevOrderPriceMap)
    ? currOrderPriceList.map(item => ({ ...item, isNew: false, isIncreased: null }))
    : currOrderPriceList.map(item => {
        const isNew = !prevOrderPriceMap.has(item.price)
        const isIncreased = isNew
          ? null
          : compareSizeChange(prevOrderPriceMap.get(item.price)!.size, item.size)

        return {
          ...item,
          isNew,
          isIncreased,
        }
      })
}

export { updateOrderBookTop, calculateTotal, formatOrderBook, formatPriceStatus }
