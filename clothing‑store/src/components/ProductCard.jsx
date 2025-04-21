/* ===== File: ProductCard.jsx ========================================== */
export default function ProductCard({ product, onAdd }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition duration-200 flex flex-col">
      <img
        src={typeof product.imageUrl === "string" ? product.imageUrl : "/fallback.jpg"}
        alt={product.name}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg flex-1">{product.name}</h3>
        <p className="text-gray-500 capitalize text-sm">
          {product.gender} • {product.category}
        </p>
        <p className="font-bold mt-2 mb-4">${Number(product.price).toFixed(2)}</p>
        <button
          onClick={() => onAdd(product)}
          className="mt-auto bg-black text-white rounded-xl py-2 hover:bg-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}