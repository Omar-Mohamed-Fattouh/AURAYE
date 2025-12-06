import React from "react";
import ProductDetails from "../components/ProductDetails";
import RelatedProducts from "../components/RelatedProducts";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";

const ProductID = () => {
  return (
    <div>
      <ProductDetails />
      <RelatedProducts />
      <BestSellerSection />
      <SubscribeSection />
    </div>
  );
};

export default ProductID;
