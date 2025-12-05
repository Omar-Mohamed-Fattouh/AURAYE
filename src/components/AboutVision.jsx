import { useState } from "react";
import { Eye, Scale } from "lucide-react";
import { motion, delay } from "framer-motion";

import { Link } from "react-router-dom";



const aboutAccordionContent = [
  {
      id: 1,
  title: "AR Virtual Try-On",
  content:
    "Instantly try on any pair of glasses using advanced AR technology and see how they look on your face in real time.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
  {
     id: 2,
  title: "Smart Frame Recommendations",
  content:
    "Get personalized frame suggestions based on your face shape, style preferences, and AR analysis.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
  {
   id: 3,
  title: "3D Frame Viewer",
  content:
    "Explore glasses in full 3D, rotate frames, zoom in on details, and view colors before you buy.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
  {
   id: 4,
  title: "Lens & Fit Guidance",
  content:
    "Receive simple guidance on the best lens options and frame fit through AR measurements.",
    image: "/HP_JUPITER_SECONDARY_BANNER_D.avif",
  },
];

export default function AboutVision() {
  const [activeId, setActiveId] = useState(1);

  function handleToggleAccordion(id) {
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <section className="relative py-20 bg-gray-50  text-white">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
        {/* Left side */}
        <LeftTextSide />

        {/* Right side - Accordion */}
        <div className="pl-6 relative">
          {aboutAccordionContent.map((service) => (
            <AccordionContent
              key={service.id}
              service={service}
              activeId={activeId}
              onToggleAccordion={handleToggleAccordion}
            />
          ))}
          {/* Vertical line with glowing dot */}
          <VerticalLineAndGlowingdot activeId={activeId} />
        </div>
      </div>
    </section>
  );
}

function LeftTextSide() {
  return (
    <div>
      <div className=" font-semibold uppercase tracking-wide mb-3 flex gap-4">
        <motion.div
          className="w-8 h-8 rounded-full overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Eye className="text-black w-8 h-8" />
        </motion.div>
        <span className="text-gray-500">Welcome To Auraye</span>
      </div>
      <h3 className="text-3xl text-black md:text-4xl font-bold leading-snug mb-6 relative">
         We Provide a New Way <br /> To Try On Glasses with AR
      </h3>
      <p className="text-gray-500 mb-10">
        Our AR eyewear brand delivers cutting-edge smart glasses designed to blend digital layers seamlessly into the real world. We combine advanced technology, immersive visuals, and modern design to transform how users interact, explore, and experience everyday life.
      </p>
      
    </div>
  );
}

function AccordionContent({
  service: { id, title, content, image },
  activeId,
  onToggleAccordion,
}) {
  const isOpen = activeId === id;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Button */}
      <button
        className={`relative group w-full text-left text-2xl font-semibold cursor-pointer py-6
              border-b border-gray-700  duration-500
              transition-colors ${
                isOpen ? "text-black" : "text-gray-300"
              } hover:text-black`}
        onClick={() => onToggleAccordion(id)}
      >
        {id}- {title}
        <span
          className={`absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-500 
                ${isOpen ? "w-full" : "w-0"} group-hover:w-full `}
        ></span>
      </button>

      {/* Animated wrapper */}
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="relative">
            <img
              src={image}
              alt={title}
              className="rounded-md mb-4 w-full h-[160px] object-cover object-center grayscale brightness-75"
            />
            <Link
              to={"/"}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white hover:hover:bg-gray-200
 px-4 py-2 rounded-md transition-colors text-black font-bold cursor-pointer"
            >
              Read More
            </Link>
          </div>

          <p className="text-gray-700 text-l leading-relaxed mb-4">{content}</p>
        </div>
      </div>
    </motion.div>
  );
}

function VerticalLineAndGlowingdot({ activeId }) {
  return (
    <>
      <span
        className="absolute left-0 -translate-x-1/2 top-[0] h-[100%] w-[4px] bg-gray-300"
      ></span>
      <span
        className="absolute left-0 -translate-x-1/2 top-0 w-[4px] bg-black transition-all duration-500 ease-in-out"
        style={{ height: `${25 * activeId}%` }}
      ></span>
      <span
        className="absolute left-[-6px] w-3 h-3 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.7)] transition-all duration-500 ease-in-out"
        style={{ top: `${25 * activeId}%` }}
      ></span>
    </>
  );
}