import { useEffect } from 'react'
import OrderBook from './components/orderBook'
import LastPriceSection from './components/orderBook/LastPriceSection'
import OrderBookHeader from './components/orderBook/OrderBookHeader'
import { ORDER_BOOK_TYPE } from './constants'
import { useLastPriceStream, useUpdatePriceStream } from './hooks'
import styled from '@/style/app.module.css'

function App() {
  const {
    initWebSocket: initPriceStream,
    clearPrevData: clearPricePrevData,
    unsubscribe: unsubscribePriceStream,
    closeWebSocket: closePriceStream,
  } = useUpdatePriceStream()
  const {
    initWebSocket: initLastPriceStream,
    clearPrevData: clearLastPriceData,
    unsubscribe: unsubscribeLastPrice,
    closeWebSocket: closeLastPriceStream,
  } = useLastPriceStream()

  useEffect(() => {
    initPriceStream()

    return () => {
      clearPricePrevData()
      unsubscribePriceStream()
      closePriceStream()
    }
  }, [])

  useEffect(() => {
    initLastPriceStream()

    return () => {
      clearLastPriceData()
      unsubscribeLastPrice()
      closeLastPriceStream()
    }
  }, [])

  return (
    <div className={styled.container}>
      <div className={styled.title}>Order Book</div>
      <div className={styled.wrapper}>
        <OrderBookHeader />
        <OrderBook type={ORDER_BOOK_TYPE.ASKS} />
        <LastPriceSection />
        <OrderBook type={ORDER_BOOK_TYPE.BIDS} />
      </div>
    </div>
  )
}

export default App
