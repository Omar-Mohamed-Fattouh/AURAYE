import React from "react";
import { Link } from "react-router-dom";

export default function HomeHero() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto px-4 lg:px-8 mt-4">
      {/* Background Image */}
      <div className="w-full h-[70vh] md:h-[80vh] lg:h-[90vh] overflow-hidden rounded-2xl relative">
        <img
          src="/VTOO.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 text-white">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-wide">
            AURA SUPREME EYEWEAR
          </h1>

          <p className="mt-3 text-sm md:text-base lg:text-lg opacity-90">
            Discover the latest collection — try on any frame instantly with AR
          </p>

          <Link
            to="/tryon"
            className="mt-6 inline-block px-6 py-3 bg-white text-black rounded-lg shadow-md text-sm md:text-base font-semibold hover:bg-gray-200 transition"
          >
            Try AR Now
          </Link>
        </div>
      </div>
    </section>
  );
}