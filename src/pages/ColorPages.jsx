import React from 'react'
import ColorProduct from '../components/ColorProduct'
import DealsSection from '../components/DealSeaction'
import BestSellerSection from '../components/BestSellerSection'
import SubscribeSection from '../components/SubscribeSection'

const ColorsPage = () => {
  return (
    <div>
        <ColorProduct />
        <DealsSection />
        <BestSellerSection />
        <SubscribeSection />
    </div>
  )
}

export default ColorsPage