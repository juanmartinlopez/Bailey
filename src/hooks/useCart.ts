import { useEffect, useRef, useState } from "react";
import type { Cart, CartItem } from "../types";

const CART_STORAGE_KEY = "bailey_cart";

export const useCart = () => {
  // Inicialización perezosa para evitar sobrescribir el carrito en StrictMode
  const [cart, setCart] = useState<Cart>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error al leer el carrito desde localStorage:", error);
      return [];
    }
  });

  // Flag para saltar el guardado si el valor inicial ya es el mismo
  const isFirstRender = useRef(true);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    // Evita doble escritura innecesaria durante el primer ciclo de StrictMode
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateCartItem = (itemId: string, updatedItem: CartItem) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? updatedItem : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};
