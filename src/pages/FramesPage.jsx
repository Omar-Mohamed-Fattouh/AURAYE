import React from 'react'
import FrameProduct from '../components/FrameProduct'
import DealsSection from '../components/DealSeaction'
import BestSellerSection from '../components/BestSellerSection'
import SubscribeSection from '../components/SubscribeSection'

const FramesPage = () => {
  return (
    <div>
      <FrameProduct />
      <DealsSection />
      <BestSellerSection />
      <SubscribeSection />
    </div>
  )
}

export default FramesPage