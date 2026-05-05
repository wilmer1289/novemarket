import { A, useParams } from "@solidjs/router";
import { createMemo, createSignal, createEffect, For, Show } from "solid-js";
import "./Profile.css";

import { useAuth } from "../../context/AuthContext";
import { getStorageItem } from "../../utils/storage";
import { formatPrice } from "../../utils/formatPrice";

function Profile() {
  const params = useParams();
  const { auth, updateUser } = useAuth();
  const section = createMemo(() => params.section || "cuenta");

  const [nombre, setNombre] = createSignal(auth.user?.nombre || "");
  const [apellido, setApellido] = createSignal(auth.user?.apellido || "");
  const [email, setEmail] = createSignal(auth.user?.email || "");
  const [message, setMessage] = createSignal("");
  const [status, setStatus] = createSignal("");

  const [selectedPurchase, setSelectedPurchase] = createSignal(null);
  const [selectedReceipt, setSelectedReceipt] = createSignal(null);

  createEffect(() => {
    setNombre(auth.user?.nombre || "");
    setApellido(auth.user?.apellido || "");
    setEmail(auth.user?.email || "");
  });

  const handleSave = (event) => {
    event.preventDefault();

    updateUser({
      nombre: nombre().trim(),
      apellido: apellido().trim(),
      email: email().trim(),
    });

    setMessage("Tu información se actualizó correctamente.");
    setStatus("success");
  };

  const getOrdersKey = (userId) => `novamarket_orders_${userId}`;

  const purchases = createMemo(() => {
    if (!auth.user) return [];

    const orders = getStorageItem(getOrdersKey(auth.user.id), []);

    return [...orders].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getTotalItems = (items = []) => {
    return items.reduce((total, item) => total + Number(item.cantidad || 1), 0);
  };

  const getItemSubtotal = (item) => {
    return Number(item.precio || 0) * Number(item.cantidad || 1);
  };

  const getOrderSubtotal = (purchase) => {
    return (purchase?.items || []).reduce((total, item) => {
      return total + getItemSubtotal(item);
    }, 0);
  };

  const getOrderIgv = (purchase) => {
    return getOrderSubtotal(purchase) * 0.18;
  };

  const getOrderTotalWithoutIgv = (purchase) => {
    return getOrderSubtotal(purchase) - getOrderIgv(purchase);
  };

  const getPaymentName = (paymentMethod) => {
    const methods = {
      tarjeta: "Tarjeta",
      yape: "Yape / Plin",
      contraentrega: "Contraentrega",
    };

    return methods[paymentMethod] || paymentMethod || "No especificado";
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  if (!auth.user) {
    return (
      <section class="profile-page profile-page--guest">
        <div class="profile-page__card">
          <span>Mi cuenta</span>
          <h1>Accede para ver tu perfil</h1>
          <p>Inicia sesión para ver tus compras y editar tu información.</p>

          <div class="profile-page__actions">
            <A href="/login" class="profile-page__button">
              Iniciar sesión
            </A>

            <A
              href="/register"
              class="profile-page__button profile-page__button-secondary"
            >
              Registrarse
            </A>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section class="profile-page">
      <div class="profile-page__header">
        <span>Mi cuenta</span>
        <h1>Hola, {auth.user.nombre}</h1>
        <p>
          Desde aquí puedes revisar tus compras recientes o actualizar tu
          información de perfil.
        </p>
      </div>

      <div class="profile-page__tabs">
        <A
          href="/perfil/cuenta"
          class="profile-page__tab"
          classList={{ active: section() === "cuenta" }}
        >
          Mi cuenta
        </A>

        <A
          href="/perfil/compras"
          class="profile-page__tab"
          classList={{ active: section() === "compras" }}
        >
          Mis compras
        </A>
      </div>

      {section() === "compras" ? (
        <div class="profile-page__content">
          {purchases().length === 0 ? (
            <div class="profile-page__empty">
              <h2>No tienes compras registradas</h2>
              <p>Aquí aparecerán tus órdenes luego de finalizar el checkout.</p>

              <A href="/productos" class="profile-page__button">
                Ver productos
              </A>
            </div>
          ) : (
            <div class="profile-page__grid">
              <For each={purchases()}>
                {(purchase) => (
                  <article class="purchase-card">
                    <div class="purchase-card__head">
                      <div>
                        <span>Orden #{purchase.id}</span>
                        <strong>{formatPrice(purchase.total)}</strong>
                      </div>

                      <span class="purchase-card__status">
                        {purchase.status}
                      </span>
                    </div>

                    <p class="purchase-card__date">
                      {formatDate(purchase.date)}
                    </p>

                    <div class="purchase-card__items-preview">
                      <For each={purchase.items?.slice(0, 2) || []}>
                        {(item) => (
                          <div class="purchase-card__item">
                            <img src={item.imagen} alt={item.nombre} />

                            <div>
                              <strong>{item.nombre}</strong>
                              <span>
                                {item.categoria} · Cantidad:{" "}
                                {item.cantidad || 1}
                              </span>
                            </div>
                          </div>
                        )}
                      </For>

                      <Show when={(purchase.items?.length || 0) > 2}>
                        <div class="purchase-card__more">
                          +{purchase.items.length - 2} producto(s) más
                        </div>
                      </Show>
                    </div>

                    <div class="purchase-card__summary">
                      <span>{getTotalItems(purchase.items)} artículo(s)</span>
                      <span>Pago: {getPaymentName(purchase.paymentMethod)}</span>
                    </div>

                    <div class="purchase-card__actions">
                      <button
                        type="button"
                        class="purchase-card__button"
                        onClick={() => setSelectedPurchase(purchase)}
                      >
                        Ver detalle
                      </button>

                      <button
                        type="button"
                        class="purchase-card__button purchase-card__button--secondary"
                        onClick={() => setSelectedReceipt(purchase)}
                      >
                        Ver boleta
                      </button>
                    </div>
                  </article>
                )}
              </For>
            </div>
          )}

          <Show when={selectedPurchase()}>
            <div class="purchase-detail">
              <div
                class="purchase-detail__overlay"
                onClick={() => setSelectedPurchase(null)}
              ></div>

              <article class="purchase-detail__modal">
                <div class="purchase-detail__header">
                  <div>
                    <span>Detalle de pedido</span>
                    <h2>Orden #{selectedPurchase().id}</h2>
                    <p>{formatDate(selectedPurchase().date)}</p>
                  </div>

                  <button
                    type="button"
                    class="purchase-detail__close"
                    onClick={() => setSelectedPurchase(null)}
                  >
                    ×
                  </button>
                </div>

                <div class="purchase-detail__info">
                  <div>
                    <span>Estado</span>
                    <strong>{selectedPurchase().status}</strong>
                  </div>

                  <div>
                    <span>Método de pago</span>
                    <strong>
                      {getPaymentName(selectedPurchase().paymentMethod)}
                    </strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>{formatPrice(selectedPurchase().total)}</strong>
                  </div>
                </div>

                <div class="purchase-detail__section">
                  <h3>Productos comprados</h3>

                  <div class="purchase-detail__products">
                    <For each={selectedPurchase().items || []}>
                      {(item) => (
                        <div class="purchase-detail__product">
                          <img src={item.imagen} alt={item.nombre} />

                          <div class="purchase-detail__product-info">
                            <strong>{item.nombre}</strong>
                            <span>{item.categoria}</span>
                            <small>Cantidad: {item.cantidad || 1}</small>
                          </div>

                          <div class="purchase-detail__prices">
                            <span>{formatPrice(item.precio)}</span>
                            <strong>{formatPrice(getItemSubtotal(item))}</strong>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                <div class="purchase-detail__section">
                  <h3>Datos de entrega</h3>

                  <div class="purchase-detail__shipping">
                    <p>
                      <strong>Cliente:</strong>{" "}
                      {selectedPurchase().shipping?.cliente ||
                        "No especificado"}
                    </p>

                    <p>
                      <strong>Correo:</strong>{" "}
                      {selectedPurchase().shipping?.email || "No especificado"}
                    </p>

                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {selectedPurchase().shipping?.telefono ||
                        "No especificado"}
                    </p>

                    <p>
                      <strong>Dirección:</strong>{" "}
                      {selectedPurchase().shipping?.direccion ||
                        "No especificada"}
                    </p>
                  </div>
                </div>

                <div class="purchase-detail__total">
                  <span>Total pagado</span>
                  <strong>{formatPrice(selectedPurchase().total)}</strong>
                </div>

                <div class="purchase-detail__actions">
                  <button
                    type="button"
                    class="purchase-detail__button"
                    onClick={() => setSelectedReceipt(selectedPurchase())}
                  >
                    Ver boleta
                  </button>
                </div>
              </article>
            </div>
          </Show>

          <Show when={selectedReceipt()}>
            <div class="receipt-modal">
              <div
                class="receipt-modal__overlay"
                onClick={() => setSelectedReceipt(null)}
              ></div>

              <article class="receipt-modal__content">
                <div class="receipt-modal__top">
                  <div>
                    <span>Comprobante de compra</span>
                    <h2>NOVAMARKET</h2>
                    <p>Tienda tecnológica online</p>
                  </div>

                  <button
                    type="button"
                    class="receipt-modal__close"
                    onClick={() => setSelectedReceipt(null)}
                  >
                    ×
                  </button>
                </div>

                <div class="receipt-document">
                  <div class="receipt-document__header">
                    <div>
                      <h3>Boleta de venta</h3>
                      <p>RUC: 00000000000</p>
                      <p>Av. Principal 123 - Trujillo, Perú</p>
                    </div>

                    <div class="receipt-document__number">
                      <span>Orden</span>
                      <strong>#{selectedReceipt().id}</strong>
                    </div>
                  </div>

                  <div class="receipt-document__info">
                    <div>
                      <span>Cliente</span>
                      <strong>
                        {selectedReceipt().shipping?.cliente ||
                          `${auth.user.nombre} ${auth.user.apellido}`}
                      </strong>
                    </div>

                    <div>
                      <span>Correo</span>
                      <strong>
                        {selectedReceipt().shipping?.email || auth.user.email}
                      </strong>
                    </div>

                    <div>
                      <span>Fecha</span>
                      <strong>{formatDate(selectedReceipt().date)}</strong>
                    </div>

                    <div>
                      <span>Método de pago</span>
                      <strong>
                        {getPaymentName(selectedReceipt().paymentMethod)}
                      </strong>
                    </div>
                  </div>

                  <div class="receipt-document__table">
                    <div class="receipt-document__row receipt-document__row--head">
                      <span>Producto</span>
                      <span>Cant.</span>
                      <span>Precio</span>
                      <span>Subtotal</span>
                    </div>

                    <For each={selectedReceipt().items || []}>
                      {(item) => (
                        <div class="receipt-document__row">
                          <span>{item.nombre}</span>
                          <span>{item.cantidad || 1}</span>
                          <span>{formatPrice(item.precio)}</span>
                          <span>{formatPrice(getItemSubtotal(item))}</span>
                        </div>
                      )}
                    </For>
                  </div>

                  <div class="receipt-document__totals">
                    <div>
                      <span>Subtotal sin IGV</span>
                      <strong>
                        {formatPrice(getOrderTotalWithoutIgv(selectedReceipt()))}
                      </strong>
                    </div>

                    <div>
                      <span>IGV 18%</span>
                      <strong>
                        {formatPrice(getOrderIgv(selectedReceipt()))}
                      </strong>
                    </div>

                    <div class="receipt-document__total-final">
                      <span>Total pagado</span>
                      <strong>{formatPrice(selectedReceipt().total)}</strong>
                    </div>
                  </div>

                  <div class="receipt-document__footer">
                    <p>
                      Gracias por comprar en NOVAMARKET. Este comprobante
                      corresponde a una compra simulada dentro del sistema.
                    </p>
                  </div>
                </div>

                <div class="receipt-modal__actions">
                  <button
                    type="button"
                    class="receipt-modal__button"
                    onClick={handlePrintReceipt}
                  >
                    Imprimir boleta
                  </button>

                  <button
                    type="button"
                    class="receipt-modal__button receipt-modal__button--secondary"
                    onClick={() => setSelectedReceipt(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </article>
            </div>
          </Show>
        </div>
      ) : (
        <div class="profile-page__content profile-page__content--form">
          <div class="profile-card">
            <div class="profile-card__header">
              <span>Datos personales</span>
              <h2>Editar perfil</h2>
            </div>

            <form class="profile-form" onSubmit={handleSave}>
              <div class="profile-form__row">
                <label>
                  Nombre
                  <input
                    type="text"
                    value={nombre()}
                    onInput={(e) => setNombre(e.target.value)}
                  />
                </label>

                <label>
                  Apellido
                  <input
                    type="text"
                    value={apellido()}
                    onInput={(e) => setApellido(e.target.value)}
                  />
                </label>
              </div>

              <label>
                Correo electrónico
                <input
                  type="email"
                  value={email()}
                  onInput={(e) => setEmail(e.target.value)}
                />
              </label>

              <button type="submit" class="profile-form__button">
                Guardar cambios
              </button>

              {message() && (
                <div class={`profile-form__message ${status()}`}>
                  {message()}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Profile;