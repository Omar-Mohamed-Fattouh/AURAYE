// import React, { useEffect, useState } from "react";
import AchievementsSection from "../components/AchievementsSection";
import HeroSection from "../components/HeroSection";
import ARVideoSection from "../components/ARVideoSection.";
import DealsSection from "../components/DealSeaction";
import CategoriesSection from "../components/CategoriesSection";
import BestSellerSection from "../components/BestSellerSection";
// import AurayeSpinner, { AurayePulse } from "../components/AurayeLoader";
import SubscribeSection from "../components/SubscribeSection";

const Home = () => {




  return (
    <div>
      <HeroSection />
      <DealsSection />
      <BestSellerSection />
      <CategoriesSection />
      <AchievementsSection />
      <SubscribeSection />
      <ARVideoSection />
    </div>
  );
};

export default Home;
