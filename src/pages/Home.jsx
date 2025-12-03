import React from "react";
// import HomeHero from "../components/HomeHero";
import AchievementsSection from "../components/AchievementsSection";
import HeroSection from "../components/HeroSection";
import ARVideoSection from "../components/ARVideoSection.";
import DealsSection from "../components/DealSeaction";
import CategoriesSection from "../components/CategoriesSection";
import BestSellerSection from "../components/BestSellerSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <DealsSection />
      <BestSellerSection />
      <CategoriesSection />
      <AchievementsSection />
      <ARVideoSection />
    </div>
  );
};

export default Home;
