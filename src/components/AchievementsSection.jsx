import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Layers, Globe, Users } from "lucide-react";

export default function AchievementsSection() {
  const stats = [
    {
      icon: <Eye className="w-10 h-10" />,
      title: "50,000+ Virtual Try‑Ons",
      desc: "Users testing frames instantly with AR try‑on.",
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
        <h2 className="text-4xl font-bold mb-4">Why Shop With Us?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Discover cutting‑edge AR technology and premium eyewear curated for the
          modern shopper.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="rounded-2xl shadow-md hover:shadow-xl transition p-2">
                <CardContent className="flex flex-col items-center py-8 gap-4">
                  <div className="p-4 rounded-full bg-gray-100">{item.icon}</div>
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-gray-500 text-sm max-w-[200px] text-center">{item.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
