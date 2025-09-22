import type { CSSProperties } from 'react'
import styled from './style.module.css'
import clsx from 'clsx'

interface ISkeletonProps {
  style?: CSSProperties
}

export default function Skeleton({ style }: ISkeletonProps) {
  return <div className={clsx([styled['skeleton']])} style={style} />
}
