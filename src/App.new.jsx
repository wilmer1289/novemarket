import { Router } from "@solidjs/router";
import { createEffect } from "solid-js";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";
import { useFavorites } from "./context/FavoritesContext";
import { useCart } from "./context/CartContext";
import "./App.css";

function UserSyncComponent() {
  const { auth } = useAuth();
  const { setCurrentUser: setFavoritesUser } = useFavorites();
  const { setCurrentUser: setCartUser } = useCart();

  createEffect(() => {
    // Sincronizar usuario en favoritos y carrito
    setFavoritesUser(auth.user);
    setCartUser(auth.user);
  });

  return null;
}

function App() {
  return (
    <Router
      root={(props) => (
        <div class="app">
          <UserSyncComponent />
          <Header />

          <main class="app-main">{props.children}</main>

          <Footer />
        </div>
      )}
    >
      <AppRoutes />
    </Router>
  );
}

export default App;
