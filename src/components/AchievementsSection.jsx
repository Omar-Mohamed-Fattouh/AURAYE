import { motion } from "framer-motion";

import { Eye, Layers, Globe, Users } from "lucide-react";

export default function AchievementsSection() {
  const stats = [
    {
      icon: <Eye className="w-10 h-10" />,
      title: "50,000+ Virtual Try-Ons",
      desc: "Users testing frames instantly with AR try-on.",
    },
    {
      icon: <Layers className="w-10 h-10" />,
      title: "4,000+ Frame Models",
      desc: "Premium glasses & sunglasses available.",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "120K+ Happy Customers",
      desc: "Trusted by buyers worldwide.",
    },
    {
      icon: <Globe className="w-10 h-10" />,
      title: "20+ Countries Shipped",
      desc: "Fast worldwide delivery services.",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Explore Our Achievements</h2>
        <p className="text-xl text-gray-400 mb-10">
          We take pride in our growth and the trust our customers place in us.
        </p>
        {/* CIRCLE ICONS DESIGN LIKE THE IMAGE */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-28 h-28 rounded-full border border-gray-300 flex items-center justify-center bg-white shadow-sm hover:shadow-lg transition">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-500 text-sm max-w-[180px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
