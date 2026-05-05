import { createContext, useContext, createEffect, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { getStorageItem, setStorageItem } from "../utils/storage";

const FavoritesContext = createContext();

export function FavoritesProvider(props) {
  const [userId, setUserId] = createSignal(null);
  
  const getUserFavoritesKey = () => {
    const id = userId();
    return id ? `novamarket_favorites_${id}` : "novamarket_favorites_guest";
  };

  const [favoritesItems, setFavoritesItems] = createStore(
    getStorageItem(getUserFavoritesKey(), [])
  );

  createEffect(() => {
    const currentKey = getUserFavoritesKey();
    setStorageItem(currentKey, favoritesItems);
  });

  const setCurrentUser = (user) => {
    if (user && user.id) {
      setUserId(user.id);
      const userFavoritesKey = `novamarket_favorites_${user.id}`;
      const userFavorites = getStorageItem(userFavoritesKey, []);
      setFavoritesItems(userFavorites);
    } else {
      setUserId(null);
      const guestFavorites = getStorageItem("novamarket_favorites_guest", []);
      setFavoritesItems(guestFavorites);
    }
  };

  const addToFavorites = (producto) => {
    const existe = favoritesItems.some((item) => item.id === producto.id);

    if (!existe) {
      setFavoritesItems([...favoritesItems, producto]);
    }
  };

  const removeFromFavorites = (productoId) => {
    setFavoritesItems(favoritesItems.filter((item) => item.id !== productoId));
  };

  const toggleFavorite = (producto) => {
    const existe = favoritesItems.some((item) => item.id === producto.id);

    if (existe) {
      removeFromFavorites(producto.id);
    } else {
      addToFavorites(producto);
    }
  };

  const isFavorite = (productoId) => {
    return favoritesItems.some((item) => item.id === productoId);
  };

  const favoritesCount = createMemo(() => {
    return favoritesItems.length;
  });

  const clearFavorites = () => {
    setFavoritesItems([]);
  };

  const value = {
    favoritesItems,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoritesCount,
    clearFavorites,
    setCurrentUser,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {props.children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider");
  }

  return context;
}
