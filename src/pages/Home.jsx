import React, { useEffect, useState } from "react";
import AchievementsSection from "../components/AchievementsSection";
import HeroSection from "../components/HeroSection";
import ARVideoSection from "../components/ARVideoSection.";
import DealsSection from "../components/DealSeaction";
import CategoriesSection from "../components/CategoriesSection";
import BestSellerSection from "../components/BestSellerSection";
import AurayeSpinner, { AurayePulse } from "../components/AurayeLoader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة تحميل البيانات
    const timer = setTimeout(() => setLoading(false), 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center gap-6">
        <AurayeSpinner size={56} />
        <AurayePulse size={48} />
      </div>
    );
  }

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
