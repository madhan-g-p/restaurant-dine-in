import { useState } from "react";
import type { MenuItem as MenuItemType } from "../../types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addToCart } from "../../features/cart/cartSlice";

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const dispatch = useAppDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(item));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="card overflow-hidden flex flex-col group"
      style={{ transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "#fff",
          }}
        >
          {item.category}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3
          className="text-base font-bold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {item.name}
        </h3>
        <p
          className="text-sm leading-relaxed flex-1 line-clamp-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {item.description}
        </p>

        <div
          className="flex items-center justify-between mt-2 pt-3 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span
            className="text-lg font-extrabold"
            style={{ color: "var(--color-primary-500)" }}
          >
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className={`px-4 py-2 cursor-pointer rounded-xl text-sm font-semibold transition-all duration-200 ${
              added ? "" : "hover:shadow-md active:scale-95"
            }`}
            style={{
              backgroundColor: added
                ? "var(--color-success)"
                : "var(--btn-primary-bg)",
              color: "#fff",
            }}
          >
            {added ? "✓ Added" : "+ Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
