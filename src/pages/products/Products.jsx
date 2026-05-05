import { createSignal, createMemo } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import "./Products.css";

import ProductCard from "../../components/ProductCard/ProductCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import { productos } from "../../data/productos";
import { categorias } from "../../data/categorias";

function Products() {
  const [busqueda, setBusqueda] = createSignal("");
  const location = useLocation();
  const navigate = useNavigate();

  const categoriaActiva = createMemo(() => {
    const pathname = location.pathname.toLowerCase();
    const partes = pathname.split("/").filter(Boolean);

    const urlCategoria =
      partes.length === 3 && partes[0] === "productos" && partes[1] === "categoria"
        ? partes[2]
        : "";

    if (!urlCategoria) return "Todos";

    const categoriaEncontrada = categorias.find(
      (categoria) => categoria.nombre.toLowerCase() === urlCategoria
    );

    return categoriaEncontrada ? categoriaEncontrada.nombre : "Todos";
  });

  const productosFiltrados = createMemo(() => {
    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva() === "Todos" ||
        producto.categoria === categoriaActiva();

      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(busqueda().toLowerCase()) ||
        producto.categoria.toLowerCase().includes(busqueda().toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(busqueda().toLowerCase());

      return coincideCategoria && coincideBusqueda;
    });
  });

  const handleCategoriaClick = (nombre) => {
    if (nombre === "Todos") {
      navigate("/productos");
      return;
    }

    navigate(`/productos/categoria/${nombre.toLowerCase()}`);
  };

  return (
    <section class="products-page">
      <div class="products-page__header">
        <span>Catálogo NOVAMARKET</span>
        <h1>Productos tecnológicos</h1>
        <p>
          Explora laptops, celulares, accesorios, productos gamer y más artículos
          tecnológicos para tu día a día.
        </p>
      </div>

      <div class="products-page__tools">
        <SearchBar
          value={busqueda()}
          onSearch={setBusqueda}
          placeholder="Buscar laptop, celular, teclado..."
        />

        <div class="products-page__filters">
          <button
            type="button"
            class={categoriaActiva() === "Todos" ? "active" : ""}
            onClick={() => handleCategoriaClick("Todos")}
          >
            Todos
          </button>

          {categorias.map((categoria) => (
            <button
              type="button"
              class={categoriaActiva() === categoria.nombre ? "active" : ""}
              onClick={() => handleCategoriaClick(categoria.nombre)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>
      </div>

      <div class="products-page__results">
        <span>{productosFiltrados().length} productos encontrados</span>
      </div>

      {productosFiltrados().length === 0 ? (
        <div class="products-page__empty">
          <h2>No encontramos productos</h2>
          <p>Prueba con otra búsqueda o selecciona otra categoría.</p>
        </div>
      ) : (
        <div class="products-page__grid">
          {productosFiltrados().map((producto) => (
            <ProductCard producto={producto} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;