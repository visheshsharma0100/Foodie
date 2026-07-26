import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "foodiehub_cart";

function readCart() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addItem = useCallback((food, quantity = 1) => {
    const foodId = food._id || food.id;
    const qty = Math.max(1, quantity);
    setItems((prev) => {
      const existing = prev.find((line) => line.foodId === foodId);
      if (existing) {
        return prev.map((line) =>
          line.foodId === foodId ? { ...line, quantity: line.quantity + qty } : line
        );
      }
      return [
        ...prev,
        {
          foodId,
          name: food.name,
          price: food.price,
          image: food.image,
          isVeg: food.isVeg,
          description: food.description,
          quantity: qty,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((foodId, quantity) => {
    const qty = Math.max(1, quantity);
    setItems((prev) => prev.map((line) => (line.foodId === foodId ? { ...line, quantity: qty } : line)));
  }, []);

  const removeItem = useCallback((foodId) => {
    setItems((prev) => prev.filter((line) => line.foodId !== foodId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items,
      cartCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, cartCount, addItem, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
