import { A } from "@solidjs/router";
import "./Favorites.css";

import ProductCard from "../../components/ProductCard/ProductCard";
import { useFavorites } from "../../context/FavoritesContext";

function Favorites() {
  const { favoritesItems, clearFavorites } = useFavorites();

  return (
    <section class="favorites-page">
      <div class="favorites-page__header">
        <span>Favoritos</span>
        <h1>Productos guardados</h1>
        <p>
          Aquí encontrarás los productos tecnológicos que marcaste como favoritos
          para revisarlos después.
        </p>
      </div>

      {favoritesItems.length === 0 ? (
        <div class="favorites-empty">
          <h2>No tienes favoritos todavía</h2>
          <p>
            Explora el catálogo de NOVAMARKET y guarda los productos que más te
            interesen.
          </p>

          <A href="/productos" class="favorites-empty__button">
            Ver productos
          </A>
        </div>
      ) : (
        <>
          <div class="favorites-page__top">
            <span>{favoritesItems.length} productos favoritos</span>

            <button type="button" onClick={clearFavorites}>
              Limpiar favoritos
            </button>
          </div>

          <div class="favorites-page__grid">
            {favoritesItems.map((producto) => (
              <ProductCard producto={producto} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Favorites;