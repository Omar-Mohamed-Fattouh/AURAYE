import { useNavigate } from "react-router-dom";

const categories = [
  { name: "SUN", route: "/products/sun", image: "/Sunglasses.jpg" },
  { name: "OPTICAL", route: "/products/optical", image: "/Eyeglasses.jpg" },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-8 p-4">
      {categories.map((category) => (
        <div
          key={category.name}
          className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          onClick={() => navigate(category.route)}
        >
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white font-bold text-xl bg-black bg-opacity-40 px-3 py-1 rounded">
            {category.name}
          </div>
        </div>
      ))}
    </div>
  );
}
