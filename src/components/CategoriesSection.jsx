import { useNavigate } from "react-router-dom";

const categories = [
  { name: "SUN", route: "/products/sun", image: "/Sunglasses.jpg" },
  { name: "OPTICAL", route: "/products/optical", image: "/Eyeglasses.jpg" },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="py-14 bg-white">
      {/* Text before images */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800">
          Explore Our Categories
        </h2>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Find the perfect eyewear that matches your style and personality
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-8 p-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 aspect-[16/9]"
            onClick={() => navigate(category.route)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 text-white font-bold underline underline-offset-4 text-[12px] md:text-xl bg-opacity-40">
              {category.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
