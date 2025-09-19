import { MAX_COUNT } from '@/constants'

export function formatOrderBookList(data: Array<[string, string]>, key: number, type: 'bids' | 'asks') {
  const sliceData = type === 'bids' ? data.slice(0, MAX_COUNT) : data.slice(-MAX_COUNT)
  return sliceData.map(([price, size], index, arr) => {
    const total =
      type === 'bids'
        ? arr.slice(0, index + 1).reduce((prev, [_, size]) => prev + Number(size), 0)
        : arr.slice(index).reduce((prev, [_, size]) => prev + Number(size), 0)
    return { price, size, total, unique: key }
  })

  // const formatData = data
  //   .map(([price, size]) => ({ price, size }))
  //   .sort((a, b) =>
  //     type === 'asks' ? Number(b.price) - Number(a.price) : Number(a.price) - Number(b.price),
  //   )
  //   .slice(0, MAX_COUNT)

  // console.log(formatData);

  // let total = 0
  // const mappingTotalList = formatData.map(item => {
  //   total += Number(item.size)
  //   return {
  //   ...item,
  //   total,
  // }
  // })

  // return type === 'asks'
  //   ? mappingTotalList
  //   : mappingTotalList.sort((a, b) => Number(b.price) - Number(a.price))
}
