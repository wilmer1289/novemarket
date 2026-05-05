import { A } from "@solidjs/router";
import "./ProductCard.css";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

function ProductCard(props) {
  const producto = props.producto;
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const descuento = producto.precioAnterior
    ? Math.round(
        ((producto.precioAnterior - producto.precio) / producto.precioAnterior) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    addToCart(producto);
  };

  const handleFavorite = () => {
    toggleFavorite(producto);
  };

  return (
    <article class="product-card">
      <A href={`/productos/${producto.id}`} class="product-card__image">
        <img src={producto.imagen} alt={producto.nombre} />

        {descuento > 0 && (
          <span class="product-card__discount">-{descuento}%</span>
        )}
      </A>

      <button
        type="button"
        class={`product-card__favorite ${
          isFavorite(producto.id) ? "active" : ""
        }`}
        onClick={handleFavorite}
        aria-label="Agregar a favoritos"
      >
        ♥
      </button>

      <div class="product-card__content">
        <span class="product-card__category">{producto.categoria}</span>

        <h3>
          <A href={`/productos/${producto.id}`}>{producto.nombre}</A>
        </h3>

        <p>{producto.descripcion}</p>

        <div class="product-card__price">
          <strong>{formatPrice(producto.precio)}</strong>

          {producto.precioAnterior && (
            <span>{formatPrice(producto.precioAnterior)}</span>
          )}
        </div>

        <div class="product-card__footer">
          <span class="product-card__stock">Stock: {producto.stock}</span>

          <button
            type="button"
            class="product-card__button"
            onClick={handleAddToCart}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;