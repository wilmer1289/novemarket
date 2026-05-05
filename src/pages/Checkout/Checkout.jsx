import { createSignal, createMemo, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import "./Checkout.css";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../utils/formatPrice";
import { getStorageItem, setStorageItem } from "../../utils/storage";
import { metodospago } from "../../data/metodosPago";
import { direcciones } from "../../data/direcciones";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { auth, isAuthenticated } = useAuth();

  const [nombre, setNombre] = createSignal(auth.user?.nombre || "");
  const [email, setEmail] = createSignal(auth.user?.email || "");
  const [telefono, setTelefono] = createSignal("");
  const [direccion, setDireccion] = createSignal("");
  const [metodoPago, setMetodoPago] = createSignal("tarjeta");
  const [message, setMessage] = createSignal("");
  const [messageType, setMessageType] = createSignal("");

  // Estados para tarjeta
  const [numeroTarjeta, setNumeroTarjeta] = createSignal("4532 1234 5678 9010");
  const [nombreTarjeta, setNombreTarjeta] = createSignal("CLIENTE DEMO");
  const [fechaTarjeta, setFechaTarjeta] = createSignal("12/26");
  const [cvvTarjeta, setCvvTarjeta] = createSignal("123");

  // Estados para Yape
  const [esperandoConfirmacionYape, setEsperandoConfirmacionYape] = createSignal(false);
  const [direccionEntrega, setDireccionEntrega] = createSignal(direcciones[0].id);

  const qrValue = createMemo(() => {
    const monto = cartTotal();
    return `yape://pago?monto=${monto}&comercio=novamarket&referencia=${Date.now()}`;
  });

  const getOrdersKey = (userId) => `novamarket_orders_${userId}`;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setMessage("Tu carrito está vacío.");
      setMessageType("error");
      return;
    }

    if (!nombre() || !email() || !telefono()) {
      setMessage("Completa todos los datos de envío.");
      setMessageType("error");
      return;
    }

    // Validaciones específicas por método de pago
    if (metodoPago() === "tarjeta") {
      if (!numeroTarjeta() || !nombreTarjeta() || !fechaTarjeta() || !cvvTarjeta()) {
        setMessage("Completa los datos de tu tarjeta.");
        setMessageType("error");
        return;
      }
    }

    if (metodoPago() === "yape") {
      if (!esperandoConfirmacionYape()) {
        setMessage("Confirma el pago en tu app Yape/Plin.");
        setMessageType("error");
        return;
      }
    }

    if (metodoPago() === "contraentrega") {
      if (!direccionEntrega()) {
        setMessage("Selecciona una dirección de entrega.");
        setMessageType("error");
        return;
      }
    }

    const items = cartItems.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      categoria: item.categoria,
      precio: item.precio,
      cantidad: item.cantidad,
      imagen: item.imagen,
    }));

    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      total: cartTotal(),
      status: "En proceso",
      paymentMethod: metodoPago(),
      shipping: {
        cliente: nombre(),
        email: email(),
        telefono: telefono(),
        direccion: direccion() || direcciones.find((d) => d.id === direccionEntrega())?.nombre || "Dirección no especificada",
      },
      items,
    };

    const userOrderKey = getOrdersKey(auth.user.id);
    const previousOrders = getStorageItem(userOrderKey, []);
    setStorageItem(userOrderKey, [order, ...previousOrders]);

    setMessage(
      "Compra realizada correctamente. Gracias por comprar en NOVAMARKET."
    );
    setMessageType("success");

    setTimeout(() => {
      clearCart();
      navigate("/perfil/compras");
    }, 1200);
  };

  return (
    <section class="checkout-page">
      <div class="checkout-page__header">
        <span>Finalizar compra</span>
        <h1>Checkout</h1>
        <p>
          Completa tus datos para simular el proceso de compra de tus productos
          tecnológicos.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div class="checkout-empty">
          <h2>No hay productos para comprar</h2>
          <p>Agrega productos al carrito antes de continuar con el checkout.</p>

          <A href="/productos">Ver productos</A>
        </div>
      ) : !isAuthenticated() ? (
        <div class="checkout-empty">
          <h2>Debes iniciar sesión para comprar</h2>
          <p>Por favor, inicia sesión o crea una cuenta para continuar con tu compra.</p>

          <div style="display: flex; gap: 1rem; justify-content: center;">
            <A href="/login" class="cart-empty__button">
              Iniciar sesión
            </A>
            <A href="/register" class="cart-empty__button">
              Crear cuenta
            </A>
          </div>
        </div>
      ) : (
        <div class="checkout-layout">
          <form class="checkout-form" onSubmit={handleSubmit}>
            <div class="checkout-form__section">
              <h2>Datos del cliente</h2>

              <div class="checkout-form__group">
                <label for="nombre">Nombre completo</label>
                <input
                  id="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  value={nombre()}
                  onInput={(event) => setNombre(event.currentTarget.value)}
                />
              </div>

              <div class="checkout-form__group">
                <label for="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email()}
                  onInput={(event) => setEmail(event.currentTarget.value)}
                />
              </div>

              <div class="checkout-form__group">
                <label for="telefono">Teléfono</label>
                <input
                  id="telefono"
                  type="tel"
                  placeholder="Ejemplo: 999 999 999"
                  value={telefono()}
                  onInput={(event) => setTelefono(event.currentTarget.value)}
                />
              </div>

              <div class="checkout-form__group">
                <label for="direccion">Dirección de entrega</label>
                <input
                  id="direccion"
                  type="text"
                  placeholder="Ingresa tu dirección"
                  value={direccion()}
                  onInput={(event) => setDireccion(event.currentTarget.value)}
                />
              </div>
            </div>

            <div class="checkout-form__section">
              <h2>Método de pago</h2>

              <div class="checkout-payment">
                {metodospago.map((metodo) => (
                  <label class={`checkout-payment__option ${metodoPago() === metodo.id ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="metodoPago"
                      value={metodo.id}
                      checked={metodoPago() === metodo.id}
                      onChange={() => setMetodoPago(metodo.id)}
                    />
                    <div class="checkout-payment__content">
                      <img src={metodo.imagen} alt={metodo.nombre} class="checkout-payment__image" />
                      <div class="checkout-payment__info">
                        <span class="checkout-payment__icon">{metodo.icono}</span>
                        <h4>{metodo.nombre}</h4>
                        <p>{metodo.descripcion}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Show when={metodoPago() === "tarjeta"}>
              <div class="checkout-form__section">
                <h2>Datos de la Tarjeta</h2>
                
                <div class="checkout-card-preview">
                  <div class="checkout-card">
                    <div class="checkout-card__chip"></div>
                    <p class="checkout-card__number">{numeroTarjeta()}</p>
                    <div class="checkout-card__footer">
                      <div>
                        <span class="checkout-card__label">Titular</span>
                        <p class="checkout-card__name">{nombreTarjeta()}</p>
                      </div>
                      <div>
                        <span class="checkout-card__label">Vence</span>
                        <p class="checkout-card__expiry">{fechaTarjeta()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="checkout-form__group">
                  <label for="numeroTarjeta">Número de tarjeta</label>
                  <input
                    id="numeroTarjeta"
                    type="text"
                    placeholder="4532 1234 5678 9010"
                    value={numeroTarjeta()}
                    onInput={(e) => setNumeroTarjeta(e.currentTarget.value)}
                    maxlength="19"
                  />
                </div>

                <div class="checkout-form__group">
                  <label for="nombreTarjeta">Titular</label>
                  <input
                    id="nombreTarjeta"
                    type="text"
                    placeholder="Ingresa el nombre del titular"
                    value={nombreTarjeta()}
                    onInput={(e) => setNombreTarjeta(e.currentTarget.value.toUpperCase())}
                  />
                </div>

                <div class="checkout-form__row">
                  <div class="checkout-form__group">
                    <label for="fechaTarjeta">Vence</label>
                    <input
                      id="fechaTarjeta"
                      type="text"
                      placeholder="MM/YY"
                      value={fechaTarjeta()}
                      onInput={(e) => setFechaTarjeta(e.currentTarget.value)}
                      maxlength="5"
                    />
                  </div>

                  <div class="checkout-form__group">
                    <label for="cvvTarjeta">CVV</label>
                    <input
                      id="cvvTarjeta"
                      type="text"
                      placeholder="123"
                      value={cvvTarjeta()}
                      onInput={(e) => setCvvTarjeta(e.currentTarget.value)}
                      maxlength="4"
                    />
                  </div>
                </div>
              </div>
            </Show>

            <Show when={metodoPago() === "yape"}>
              <div class="checkout-form__section">
                <h2>Paga con Yape/Plin</h2>
                
                <div class="checkout-yape">
                  <div class="checkout-yape__qr">
                    <div class="checkout-yape__qr-placeholder">
                      <img src="../../../public/yape.png" alt="Código QR Yape/Plin" class="checkout-yape__qr-code"/>
                    </div>
                  </div>

                  <div class="checkout-yape__info">
                    <h3>Escanea el código QR</h3>
                    <p>Abre tu app Yape o Plin y escanea este QR para confirmar el pago</p>
                    
                    <div class="checkout-yape__details">
                      <div class="checkout-yape__detail">
                        <span>Monto a pagar:</span>
                        <strong>{formatPrice(cartTotal())}</strong>
                      </div>
                      <div class="checkout-yape__detail">
                        <span>Comercio:</span>
                        <strong>NOVAMARKET</strong>
                      </div>
                      <div class="checkout-yape__detail">
                        <span>Ref:</span>
                        <strong>{Date.now()}</strong>
                      </div>
                    </div>

                    <label class="checkout-yape__confirm">
                      <input
                        type="checkbox"
                        checked={esperandoConfirmacionYape()}
                        onChange={(e) => setEsperandoConfirmacionYape(e.currentTarget.checked)}
                      />
                      <span>He confirmado el pago en mi app Yape/Plin</span>
                    </label>
                  </div>
                </div>
              </div>
            </Show>

            <Show when={metodoPago() === "contraentrega"}>
              <div class="checkout-form__section">
                <h2>Dirección de Entrega</h2>
                
                <div class="checkout-directions">
                  {direcciones.map((dir) => (
                    <label class={`checkout-direction ${direccionEntrega() === dir.id ? "active" : ""}`}>
                      <input
                        type="radio"
                        name="direccion"
                        value={dir.id}
                        checked={direccionEntrega() === dir.id}
                        onChange={() => setDireccionEntrega(dir.id)}
                      />
                      <div class="checkout-direction__content">
                        <h4>{dir.titulo}</h4>
                        <p>{dir.direccion}</p>
                        <small>{dir.referencia}</small>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </Show>

            {message() && (
              <div class={`checkout-message ${messageType()}`}>
                {message()}
              </div>
            )}

            <button type="submit" class="checkout-form__button">
              Confirmar compra
            </button>
          </form>

          <aside class="checkout-summary">
            <h2>Resumen del pedido</h2>

            <div class="checkout-summary__items">
              {cartItems.map((item) => (
                <div class="checkout-summary__item">
                  <img src={item.imagen} alt={item.nombre} />

                  <div>
                    <h3>{item.nombre}</h3>
                    <span>
                      {item.cantidad} x {formatPrice(item.precio)}
                    </span>
                  </div>

                  <strong>{formatPrice(item.precio * item.cantidad)}</strong>
                </div>
              ))}
            </div>

            <div class="checkout-summary__total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal())}</strong>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Checkout;