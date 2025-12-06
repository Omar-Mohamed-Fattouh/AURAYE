import React from "react";
import Wishlist from "../components/Wishlist";
import DealsSection from "../components/DealSeaction";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";

const WishlistPage = () => {
  return (
    <div>
      <Wishlist />
      <DealsSection />
      <BestSellerSection />
      <SubscribeSection />
    </div>
  );
};

export default WishlistPage;
