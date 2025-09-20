import OrderBook from './components/orderBook'
import OrderBookHeader from './components/orderBook/OrderBookHeader'
import { MAX_COUNT, ORDER_BOOK_TYPE } from './constants'
import { useLastPriceStream, useUpdatePriceStream } from './hooks'
import styled from '@/style/app.module.css'

function App() {
  useUpdatePriceStream()
  useLastPriceStream()

  return (
    <div className={styled.container}>
      <div className={styled.title}>Order Book</div>
      <div className={styled.wrapper}>
        <OrderBookHeader />
        <OrderBook type={ORDER_BOOK_TYPE.ASKS} maxCount={MAX_COUNT} />
        <div>---</div>
        <OrderBook type={ORDER_BOOK_TYPE.BIDS} maxCount={MAX_COUNT} />
      </div>
    </div>
  )
}

export default App
