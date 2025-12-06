import React from "react";
import SunGlasses from "../components/SunGlasses";
import DealsSection from "../components/DealSeaction";
import BestSellerSection from "../components/BestSellerSection";
import SubscribeSection from "../components/SubscribeSection";

const SunGlassesPage = () => {
  return (
    <div>
      <SunGlasses />
      <DealsSection />
      <BestSellerSection />
      <SubscribeSection />
    </div>
  );
};

export default SunGlassesPage;
