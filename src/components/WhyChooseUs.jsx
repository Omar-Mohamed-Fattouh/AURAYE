// src/components/WhyChooseUs.jsx
import React from "react";

const reasonsData = [
  {
    title: "High-Quality Eyewear",
    description:
      "Our glasses are crafted with premium materials to ensure durability and comfort. For example, Sarah, who struggled with daily headaches due to poor vision, found relief after choosing our AR-fit glasses. She now enjoys clear vision all day without discomfort.",
    img: "/Sunglasses.jpg",
  },
  {
    title: "Stylish & Modern Designs",
    description:
      "We provide trendy eyewear that helps customers express their personality. Ahmed wanted a stylish look for his online meetings; using our AR try-on, he found the perfect frame that matches his style and boosted his confidence at work.",
    img: "/Eyeglasses.jpg",
  },
  {
    title: "Personalized AR Experience",
    description:
      "With our AR try-on, customers can virtually try glasses before buying, ensuring a perfect fit. Lina was unsure which frames suited her face; the AR tool helped her see the glasses on her face in real time, making the choice easy and risk-free.",
    img: "/aviator-sunglasses-men.jpg",
  },
];

const ReasonCard = ({ title, description, img }) => (
  <div
    className="group flex flex-col md:flex-row items-stretch gap-4 border border-white/10 rounded-2xl p-5 md:p-6 bg-white/0 hover:bg-white/5 transition-colors duration-300"
  >
    {/* Text Block */}
    <div className="flex-1">
      <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm md:text-[15px] leading-relaxed text-white/70">
        {description}
      </p>
    </div>

    {/* Image Block */}
    <div className="w-full md:w-64 flex items-center justify-center">
      <div className="w-full h-28 md:h-32 rounded-xl overflow-hidden border border-white/20 bg-black/40">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </div>
  </div>
);

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-black text-white py-14 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 md:mb-14">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Choose Us</h2>
            <p className="text-sm md:text-base text-white/70 max-w-xl">
              Enjoy a smooth shopping experience with high-quality frames,
              advanced AR try-on, and support that actually cares about your
              vision.
            </p>
          </div>

          <button className="mt-2 inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white text-sm font-semibold tracking-wide hover:bg-black bg-white text-black hover:text-white transition-colors duration-300">
            Shop Now
          </button>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {reasonsData.map((reason, index) => (
            <ReasonCard
              key={index}
              title={reason.title}
              description={reason.description}
              img={reason.img}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
