import { A } from "@solidjs/router";
import "./ProductSlider.css";
import ProductCard from "../ProductCard/ProductCard";

function ProductSlider(props) {
  const titulo = props.titulo || "Ofertas especiales";
  const subtitulo = props.subtitulo || "Productos seleccionados para ti";
  const productos = props.productos || [];

  return (
    <section class="product-slider">
      <div class="product-slider__header">
        <div>
          <span>{subtitulo}</span>
          <h2>{titulo}</h2>
        </div>

        <A href="/productos" class="product-slider__link">
          Ver todos →
        </A>
      </div>

      <div class="product-slider__track">
        {productos.map((producto) => (
          <div class="product-slider__item">
            <ProductCard producto={producto} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductSlider;