import { A } from "@solidjs/router";
import { createSignal, createEffect, onCleanup, Show } from "solid-js";
import "./Header.css";

import logo from "../../assets/logo.png";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { auth, logout } = useAuth();
  const [menuOpen, setMenuOpen] = createSignal(false);

  const profileInitials = () => {
    const nombre = auth.user?.nombre || "";
    const apellido = auth.user?.apellido || "";

    const inicialNombre = nombre.charAt(0);
    const inicialApellido = apellido.charAt(0);

    return `${inicialNombre}${inicialApellido}`.toUpperCase() || "U";
  };

  const handleDocumentClick = (event) => {
    const menu = document.querySelector(".header__profile");

    if (menu && !menu.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  createEffect(() => {
    if (menuOpen()) {
      document.addEventListener("click", handleDocumentClick);
    } else {
      document.removeEventListener("click", handleDocumentClick);
    }
  });

  onCleanup(() => {
    document.removeEventListener("click", handleDocumentClick);
  });

  return (
    <header class="header">
      <div class="header__container">
        <A href="/" class="header__logo">
          <img src={logo} alt="Logo de NOVAMARKET" />
          <span>NOVAMARKET</span>
        </A>

        <nav class="header__nav">
          <A href="/" end>
            Inicio
          </A>

          <A href="/productos">Productos</A>

          <A href="/favoritos" class="header__cart-link">
            Favoritos
            {favoritesCount() > 0 && (
              <span class="header__cart-count">{favoritesCount()}</span>
            )}
          </A>

          <A href="/carrito" class="header__cart-link">
            Carrito
            {cartCount() > 0 && (
              <span class="header__cart-count">{cartCount()}</span>
            )}
          </A>
        </nav>

        <div class="header__actions">
          <Show
            when={auth.user}
            fallback={
              <div class="header__auth-links">
                <A href="/login" class="header__auth-link">
                  Iniciar sesión
                </A>

                <A href="/register" class="header__auth-link header__auth-link--primary">
                  Registrarse
                </A>
              </div>
            }
          >
            <div
              class="header__profile"
              classList={{ "header__profile-open": menuOpen() }}
            >
              <button
                type="button"
                class="header__profile-button"
                onClick={() => setMenuOpen(!menuOpen())}
              >
                <span class="header__profile-avatar">{profileInitials()}</span>
                <span class="header__profile-text">
                  Hola, {auth.user.nombre}
                </span>
              </button>

              {menuOpen() && (
                <div class="header__profile-menu">
                  <A href="/perfil/cuenta" onClick={() => setMenuOpen(false)}>
                    Mi cuenta
                  </A>

                  <A href="/perfil/compras" onClick={() => setMenuOpen(false)}>
                    Mis compras
                  </A>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}

export default Header;