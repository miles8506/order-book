function updateOrderBookTop(prevData: Array<[string, string]>, currData: Array<[string, string]>) {
  const map = new Map([...prevData, ...currData])

  // return Array.from(map.entries()).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
  return Array.from(map.entries())
    .filter(([_, size]) => Number(size) !== 0)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
}

export { updateOrderBookTop }
