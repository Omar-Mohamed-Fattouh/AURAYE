import React from 'react'
import Wishlist from '../components/Wishlist'
import DealsSection from '../components/DealSeaction'
import BestSellerSection from '../components/BestSellerSection'

const WishlistPage = () => {
  return (
    <div>
        <Wishlist />
        <DealsSection />
        <BestSellerSection />
    </div>
  )
}

export default WishlistPage