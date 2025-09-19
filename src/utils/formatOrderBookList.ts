import { MAX_COUNT, ORDER_BOOK_TYPE } from '@/constants'

export function formatOrderBookList(data: Array<[string, string]>, type: ORDER_BOOK_TYPE) {
  const sliceData =
    type === ORDER_BOOK_TYPE.BIDS ? data.slice(0, MAX_COUNT) : data.slice(-MAX_COUNT)
  return sliceData.map(([price, size], index, arr) => {
    const total =
      type === ORDER_BOOK_TYPE.BIDS
        ? arr.slice(0, index + 1).reduce((prev, [_, size]) => prev + Number(size), 0)
        : arr.slice(index).reduce((prev, [_, size]) => prev + Number(size), 0)

    return {
      price,
      size,
      total,
    }
  })
}
