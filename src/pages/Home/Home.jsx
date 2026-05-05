import "./Home.css";

import Banner from "../../components/Banner/Banner";
import CategoryMenu from "../../components/CategoryMenu/CategoryMenu";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductSlider from "../../components/ProductSlider/ProductSlider";
import { productos } from "../../data/productos";

function Home() {
  const productosDestacados = productos.filter((producto) => producto.destacado);

  const productosEnOferta = productos.filter(
    (producto) => producto.precioAnterior > producto.precio
  );

  return (
    <>
      <Banner />
      <CategoryMenu />

      <section class="home-featured">
        <div class="home-featured__header">
          <span>Productos destacados</span>
          <h2>Lo más buscado en NOVAMARKET</h2>
          <p>
            Productos tecnológicos seleccionados para mejorar tu estudio,
            trabajo, entretenimiento y experiencia gamer.
          </p>
        </div>

        <div class="home-featured__grid">
          {productosDestacados.map((producto) => (
            <ProductCard producto={producto} />
          ))}
        </div>
      </section>

      <ProductSlider
        titulo="Ofertas tecnológicas"
        subtitulo="Aprovecha descuentos"
        productos={productosEnOferta}
      />
    </>
  );
}

export default Home;