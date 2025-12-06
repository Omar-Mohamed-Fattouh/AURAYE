import React from 'react'
import WomenProduct from '../components/WomenProduct'
import DealsSection from '../components/DealSeaction'
import BestSellerSection from '../components/BestSellerSection'
import SubscribeSection from '../components/SubscribeSection'

const WomenPage = () => {
  return (
    <div>
        <WomenProduct />
        <DealsSection />
        <BestSellerSection />
        <SubscribeSection />
    </div>
  )
}

export default WomenPage