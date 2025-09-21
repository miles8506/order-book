import { DIRECTION } from '@/constants'

function getSizeChangeDirection(oldN: number, newN: number) {
  if (newN > oldN) return DIRECTION.INCREASED
  if (newN < oldN) return DIRECTION.DECREASED
  return DIRECTION.FLAT
}

export { getSizeChangeDirection }
