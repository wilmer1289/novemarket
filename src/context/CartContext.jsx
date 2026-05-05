import { createContext, useContext, createEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { getStorageItem, setStorageItem } from "../utils/storage";

const CartContext = createContext();

export function CartProvider(props) {
  const [userId, setUserId] = createSignal(null);

  const getCartKey = () => {
    const id = userId();
    return id ? `novamarket_cart_${id}` : "novamarket_cart_guest";
  };

  const [cartItems, setCartItems] = createStore(
    getStorageItem(getCartKey(), [])
  );

  createEffect(() => {
    const currentKey = getCartKey();
    setStorageItem(currentKey, cartItems);
  });

  const setCurrentUser = (user) => {
    if (user && user.id) {
      const guestCart = getStorageItem("novamarket_cart_guest", []);
      const userCartKey = `novamarket_cart_${user.id}`;
      const userCart = getStorageItem(userCartKey, []);

      // Migrar items del guest al usuario (combinar)
      const mergedCart = [...userCart];
      guestCart.forEach((guestItem) => {
        const existingItem = mergedCart.find((item) => item.id === guestItem.id);
        if (existingItem) {
          existingItem.cantidad += guestItem.cantidad;
        } else {
          mergedCart.push(guestItem);
        }
      });

      setUserId(user.id);
      setCartItems(mergedCart);
      setStorageItem(userCartKey, mergedCart);
    } else {
      setUserId(null);
      const guestCart = getStorageItem("novamarket_cart_guest", []);
      setCartItems(guestCart);
    }
  };

  const addToCart = (producto) => {
    const itemExistente = cartItems.find((item) => item.id === producto.id);

    if (itemExistente) {
      setCartItems(
        (item) => item.id === producto.id,
        "cantidad",
        (cantidad) => cantidad + 1
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          ...producto,
          cantidad: 1,
        },
      ]);
    }
  };

  const removeFromCart = (productoId) => {
    setCartItems(cartItems.filter((item) => item.id !== productoId));
  };

  const increaseQuantity = (productoId) => {
    setCartItems(
      (item) => item.id === productoId,
      "cantidad",
      (cantidad) => cantidad + 1
    );
  };

  const decreaseQuantity = (productoId) => {
    const item = cartItems.find((item) => item.id === productoId);

    if (!item) return;

    if (item.cantidad <= 1) {
      removeFromCart(productoId);
      return;
    }

    setCartItems(
      (item) => item.id === productoId,
      "cantidad",
      (cantidad) => cantidad - 1
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = createMemo(() => {
    return cartItems.reduce((total, item) => total + item.cantidad, 0);
  });

  const cartTotal = createMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  });

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartCount,
    cartTotal,
    setCurrentUser,
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}