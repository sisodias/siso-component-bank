import { cn } from "@/lib/utils";


export const Component = () => {

  return (
    <div className="max-w-sm rounded-2xl shadow-lg bg-white p-4 hover:shadow-xl transition">
      <div className="overflow-hidden rounded-xl border border-black">
        <img
          src="https://via.placeholder.com/400"
          alt="Product"
          className="w-full h-56 object-cover hover:scale-105 transition"
        />
      </div>

      <h2 className="text-xl font-semibold mt-4 text-black">Awesome Product</h2>
      <p className="text-gray-600 mt-1">
        A short description of the product goes here. Clean, modern, and effective.
      </p>

      <div className="flex items-center justify-between mt-4">
        <span className="text-2xl font-bold text-black">$49.99</span>

        <div className="flex text-yellow-400">
          ⭐⭐⭐⭐☆
        </div>
      </div>

      <button className="w-full mt-5 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
        Buy Now
      </button>
    </div>
  );
};
