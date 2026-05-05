import { A } from "@solidjs/router";
import "./CategoryMenu.css";
import { categorias } from "../../data/categorias";

function CategoryMenu() {
  return (
    <section class="category-menu">
      <div class="category-menu__header">
        <span>Categorías principales</span>
        <h2>Todo lo que necesitas en tecnología</h2>
      </div>

      <div class="category-menu__grid">
        {categorias.map((categoria) => (
          <A href={categoria.ruta} class="category-card">
            <div class="category-card__icon">{categoria.icono}</div>

            <div>
              <h3>{categoria.nombre}</h3>
              <p>{categoria.descripcion}</p>
            </div>

            <span class="category-card__arrow">→</span>
          </A>
        ))}
      </div>
    </section>
  );
}

export default CategoryMenu;