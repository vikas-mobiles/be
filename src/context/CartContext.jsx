// CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item._id === product._id);
      if (existingItem) {
        return currentCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stock)) }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartItemQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}