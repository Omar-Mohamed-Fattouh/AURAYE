import React from 'react'
import AllProducts from '../components/AllProduct'
import DealsSection from '../components/DealSeaction'
import BestSellerSection from '../components/BestSellerSection'

const AllProductPage = () => {
  return (
    <div>
        <AllProducts />
        <DealsSection />
        <BestSellerSection />
    </div>
  )
}

export default AllProductPage