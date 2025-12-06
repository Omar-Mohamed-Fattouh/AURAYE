import React from 'react'
import AllProducts from '../components/AllProduct'
import DealsSection from '../components/DealSeaction'
import BestSellerSection from '../components/BestSellerSection'
import SubscribeSection from '../components/SubscribeSection'

const AllProductPage = () => {
  return (
    <div>
        <AllProducts />
        <DealsSection />
        <BestSellerSection />
        <SubscribeSection />
    </div>
  )
}

export default AllProductPage