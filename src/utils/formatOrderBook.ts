import { MAX_COUNT, ORDER_BOOK_TYPE } from '@/constants'

function updateOrderBookTop(prevData: Array<[string, string]>, currData: Array<[string, string]>) {
  const map = new Map([...prevData, ...currData])

  // return Array.from(map.entries()).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
  return Array.from(map.entries())
    .filter(([_, size]) => Number(size) !== 0)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
}

function calculateTotal(data: Array<[string, string]>) {
  return data.reduce((prev, [_, size]) => prev + Number(size), 0)
}

function formatOrderBook(data: Array<[string, string]>, type: ORDER_BOOK_TYPE) {
  const sliceOrderBook =
    type === ORDER_BOOK_TYPE.BIDS ? data.slice(0, MAX_COUNT) : data.slice(-MAX_COUNT)

  return sliceOrderBook.map(([price, size], index, arr) => ({
    price,
    size,
    total: calculateTotal(
      type === ORDER_BOOK_TYPE.BIDS ? arr.slice(0, index + 1) : arr.slice(index),
    ),
  }))
}

export { updateOrderBookTop, calculateTotal, formatOrderBook }
