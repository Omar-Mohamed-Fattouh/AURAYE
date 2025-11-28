import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItem({ item, handleQuantityChange, handleRemove }) {
  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md flex gap-5 transition">
      <img
        src={item.image_url}
        alt={item.name}
        className="w-28 h-28 object-cover rounded-md border"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-primary font-bold text-lg">
          ${Number(item.price || 0).toFixed(2)}
        </p>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
            className="p-1.5 hover:bg-gray-100 rounded transition"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="w-8 text-center font-semibold">{item.quantity}</span>

          <button
            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            className="p-1.5 hover:bg-gray-100 rounded transition"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleRemove(item.id)}
            className="ml-auto p-2 hover:bg-red-50 text-red-600 rounded transition"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
