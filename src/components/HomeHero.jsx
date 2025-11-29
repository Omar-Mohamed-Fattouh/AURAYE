import React from "react";
import { Link } from "react-router-dom";

export default function HomeHero() {
  return (
    <section className="container relative w-full h-full mx-auto mt-4">
      {/* Wrapper similar to example layout */}
      <div className="w-full h-[10vh] container mx-auto px-4 lg:px-8 text-center">
        <h1 className="text-3xl md:text-6xl font-bold tracking-wide mt-6">
          Elevate Your Vision with Smart AR Try-On
        </h1>
        
        <p className="text-sm md:text-lg text-gray-500 uppercase mt-2 tracking-wide">
          AURAYE SUPREME EYEWEAR
        </p>
      </div>

      {/* Image Section */}
      <div className="container h-[80vh] mx-auto px-4 lg:px-8 mt-6">
        <div className="container h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden relative">
          <img
            src="/VTOOO.jpg"
            alt="Virtual Try-On Hero"
            className="w-full h-full object-contain"
          />

          <div className="absolute bottom-6 left-6">
            <a
              href="/tryon"
              className="text-white bg-black/60 backdrop-blur px-4 py-2 rounded-md text-sm hover:bg-black/80 transition"
            >
              Try AR Experience
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
