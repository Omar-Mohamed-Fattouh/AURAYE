import React from "react";
import ShapeProduct from "../components/ShapeProduct";
import DealsSection from "../components/DealSeaction";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";

const ShapesPage = () => {
  return (
    <div>
      <ShapeProduct />
      <DealsSection />
      <BestSellerSection />
      <SubscribeSection />
    </div>
  );
};

export default ShapesPage;
