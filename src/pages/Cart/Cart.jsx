import { A } from "@solidjs/router";
import "./Cart.css";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/formatPrice";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  return (
    <section class="cart-page">
      <div class="cart-page__header">
        <span>Carrito de compras</span>
        <h1>Productos agregados</h1>
        <p>
          Revisa los productos que agregaste antes de continuar con tu compra.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div class="cart-empty">
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos tecnológicos para verlos aquí.</p>

          <A href="/productos" class="cart-empty__button">
            Ver productos
          </A>
        </div>
      ) : (
        <div class="cart-layout">
          <div class="cart-list">
            {cartItems.map((item) => (
              <article class="cart-item">
                <div class="cart-item__image">
                  <img src={item.imagen} alt={item.nombre} />
                </div>

                <div class="cart-item__info">
                  <span>{item.categoria}</span>
                  <h3>{item.nombre}</h3>
                  <p>{item.descripcion}</p>

                  <button
                    type="button"
                    class="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Eliminar
                  </button>
                </div>

                <div class="cart-item__actions">
                  <strong>{formatPrice(item.precio)}</strong>

                  <div class="cart-item__quantity">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <small>
                    Subtotal: {formatPrice(item.precio * item.cantidad)}
                  </small>
                </div>
              </article>
            ))}
          </div>

          <aside class="cart-summary">
            <h2>Resumen</h2>

            <div class="cart-summary__row">
              <span>Productos</span>
              <strong>{cartItems.length}</strong>
            </div>

            <div class="cart-summary__row">
              <span>Total</span>
              <strong>{formatPrice(cartTotal())}</strong>
            </div>

            <A href="/checkout" class="cart-summary__checkout">
              Continuar compra
            </A>

            <button
              type="button"
              class="cart-summary__clear"
              onClick={clearCart}
            >
              Vaciar carrito
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;