import React from "react";
import { MapPin, Clock } from "lucide-react";

export default function MapSection() {
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-10">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-black">
            Visit us
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
            Our showroom & office
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl">
            Try your favorite frames in person, pick up your order, or just say
            hi. We&apos;re happy to welcome you in Ismailia.
          </p>
        {/* Map Box */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 mt-6">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.550364141182!2d31.23571191506563!3d30.044419981878973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAyJzM5LjkiTiAzMcKwMTQnMDguNSJF!5e0!3m2!1sen!2seg!4v1697040000000"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
