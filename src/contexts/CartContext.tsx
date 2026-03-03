import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  style: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, style: string) => void;
  updateQuantity: (productId: string, style: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === newItem.productId && i.style === newItem.style);
      if (existing) {
        return prev.map((i) =>
          i.productId === newItem.productId && i.style === newItem.style
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, style: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.style === style)));
  };

  const updateQuantity = (productId: string, style: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId, style);
    setItems((prev) =>
      prev.map((i) => (i.productId === productId && i.style === style ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
