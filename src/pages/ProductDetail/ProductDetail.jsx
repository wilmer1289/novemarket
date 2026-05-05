import { A, useParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import "./ProductDetail.css";

import { productos } from "../../data/productos";
import { formatPrice } from "../../utils/formatPrice";
import { useCart } from "../../context/CartContext";

const reviewTexts = [
  "La calidad es excelente y el producto llegó en perfecto estado.",
  "Muy satisfecho con la compra, lo recomiendo al 100%.",
  "Cumple con todo lo que esperaba y el envío fue rápido.",
  "Fantástico, la relación calidad-precio es muy buena.",
  "El diseño es precioso y la batería dura mucho tiempo.",
  "Un producto muy sólido, volvería a comprarlo.",
  "Atendieron todas mis dudas y el producto funciona perfecto.",
  "La experiencia de compra fue muy buena y el producto cumple.",
];

const reviewAuthors = ["Ana", "Carlos", "Marta", "Jorge", "Sofía", "David", "Luisa", "Tomás"];

const generateReviews = (productId) => {
  const seed = productId * 17 + 5;
  return [0, 1, 2].map((index) => {
    const value = seed + index * 9;
    const rating = 4 + (value % 2);
    const text = reviewTexts[(value + 2) % reviewTexts.length];
    const author = reviewAuthors[(value + 5) % reviewAuthors.length];
    return { rating, text, author };
  });
};

const averageRating = (reviews) => {
  if (!reviews.length) return "0.0";
  const total = reviews.reduce((sum, item) => sum + item.rating, 0);
  return (total / reviews.length).toFixed(1);
};

function ProductDetail() {
  const params = useParams();
  const { addToCart } = useCart();

  const producto = createMemo(() => {
    return productos.find((item) => item.id === Number(params.id));
  });

  const productosRelacionados = createMemo(() => {
    if (!producto()) return [];

    return productos
      .filter(
        (item) =>
          item.categoria === producto().categoria && item.id !== producto().id
      )
      .slice(0, 4);
  });

  const valoraciones = createMemo(() => {
    if (!producto()) return [];
    return generateReviews(producto().id);
  });

  return (
    <section class="product-detail-page">
      {producto() ? (
        <>
          <A href="/productos" class="product-detail-page__back">
            ← Volver a productos
          </A>

          <div class="product-detail">
            <div class="product-detail__image">
              <img src={producto().imagen} alt={producto().nombre} />
            </div>

            <div class="product-detail__info">
              <span class="product-detail__category">
                {producto().categoria}
              </span>

              <h1>{producto().nombre}</h1>

              <p>{producto().descripcion}</p>

              <div class="product-detail__price">
                <strong>{formatPrice(producto().precio)}</strong>

                {producto().precioAnterior && (
                  <span>{formatPrice(producto().precioAnterior)}</span>
                )}
              </div>

              <div class="product-detail__stock">
                <span>Stock disponible:</span>
                <strong>{producto().stock} unidades</strong>
              </div>

              <div class="product-detail__benefits">
                <div>
                  <strong>Envío rápido</strong>
                  <span>Entrega segura a tu dirección.</span>
                </div>

                <div>
                  <strong>Compra protegida</strong>
                  <span>Atención y soporte en todo momento.</span>
                </div>

                <div>
                  <strong>Garantía</strong>
                  <span>Productos tecnológicos verificados.</span>
                </div>
              </div>

              <div class="product-detail__actions">
                <button
                  type="button"
                  class="product-detail__button"
                  onClick={() => addToCart(producto())}
                >
                  Agregar al carrito
                </button>

                <A href="/carrito" class="product-detail__button-secondary">
                  Ir al carrito
                </A>
              </div>
            </div>
          </div>

          {productosRelacionados().length > 0 && (
            <section class="related-products">
              <div class="related-products__header">
                <span>También te puede interesar</span>
                <h2>Productos relacionados</h2>
              </div>

              <div class="related-products__grid">
                {productosRelacionados().map((item) => (
                  <A href={`/productos/${item.id}`} class="related-card">
                    <img src={item.imagen} alt={item.nombre} />

                    <div>
                      <span>{item.categoria}</span>
                      <h3>{item.nombre}</h3>
                      <strong>{formatPrice(item.precio)}</strong>
                    </div>
                  </A>
                ))}
              </div>
            </section>
          )}

          <section class="product-reviews">
            <div class="product-reviews__header">
              <span>Opiniones</span>
              <h2>Valoraciones y comentarios</h2>
              <p>Comentarios generados aleatoriamente para este producto.</p>
            </div>

            <div class="product-reviews__summary">
              <div>
                <strong>{averageRating(valoraciones())} / 5</strong>
                <span>Promedio de valoraciones</span>
              </div>
              <div>
                <strong>{valoraciones().length}</strong>
                <span>Reseñas</span>
              </div>
            </div>

            <div class="product-reviews__grid">
              {valoraciones().map((review) => (
                <article class="review-card">
                  <div class="review-card__rating">
                    <span>{review.rating}.0</span>
                    <div class="review-card__stars">
                      {Array.from({ length: review.rating }, (_, idx) => (
                        <span>★</span>
                      ))}
                    </div>
                  </div>
                  <p>{review.text}</p>
                  <footer>
                    <strong>{review.author}</strong>
                    <span>Cliente verificado</span>
                  </footer>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : (
        <div class="product-detail-empty">
          <h1>Producto no encontrado</h1>
          <p>El producto que buscas no existe o ya no está disponible.</p>

          <A href="/productos">Volver al catálogo</A>
        </div>
      )}
    </section>
  );
}

export default ProductDetail;