import { A } from "@solidjs/router";
import "./Banner.css";

function Banner() {
  return (
    <section class="banner">
      <div class="banner__content">
        <span class="banner__label">Tecnología para todos</span>

        <h1>Compra productos tecnológicos modernos, rápidos y seguros.</h1>

        <p>
          En NOVAMARKET encontrarás laptops, celulares, audífonos, teclados,
          accesorios gamer y más productos tecnológicos para tu día a día.
        </p>

        <div class="banner__buttons">
          <A href="/productos" class="banner__btn banner__btn--primary">
            Ver productos
          </A>

          <A href="/productos" class="banner__btn banner__btn--secondary">
            Ver ofertas
          </A>
        </div>
      </div>

      <div class="banner__image">
        <img
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
          alt="Productos tecnológicos modernos"
        />
      </div>
    </section>
  );
}

export default Banner;