import React from "react";
// import HomeHero from "../components/HomeHero";
import AchievementsSection from "../components/AchievementsSection";
import HeroSection from "../components/HeroSection";
import ARVideoSection from "../components/ARVideoSection.";
import DealsSection from "../components/DealSeaction";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <DealsSection />
      <AchievementsSection />
      <ARVideoSection />
    </div>
  );
};

export default Home;
