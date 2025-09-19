import OrderBook from './components/orderBook'
import OrderBookHeader from './components/orderBook/OrderBookHeader'
import { useLastPriceStream, useUpdatePriceStream } from './hooks'
import styled from '@/style/app.module.css'

function App() {
  useUpdatePriceStream()
  useLastPriceStream()

  return (
    <div className={styled.container}>
      <div className={styled.title}>Order Book</div>
      <div className={styled.wrapper}>
        <OrderBook type="asks">
          <OrderBookHeader />
        </OrderBook>
      </div>
    </div>
  )
}

export default App
