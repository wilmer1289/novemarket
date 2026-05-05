import { A } from "@solidjs/router";
import "./Footer.css";
import logo from "../../assets/logo.png";

function Footer() {
  return (
    <footer class="footer">
      <div class="footer__container">
        <div class="footer__brand">
          <A href="/" class="footer__logo">
            <img src={logo} alt="Logo de NOVAMARKET" />
            <span>NOVAMARKET</span>
          </A>

          <p>
            Tu tienda tecnológica para comprar laptops, celulares, accesorios y
            productos gamer de forma rápida, moderna y segura.
          </p>
        </div>

        <div class="footer__links">
          <div class="footer__column">
            <h3>Tienda</h3>
            <A href="/">Inicio</A>
            <A href="/productos">Productos</A>
            <A href="/favoritos">Favoritos</A>
            <A href="/carrito">Carrito</A>
          </div>

          <div class="footer__column">
            <h3>Categorías</h3>
            <A href="/productos">Laptops</A>
            <A href="/productos">Celulares</A>
            <A href="/productos">Accesorios</A>
            <A href="/productos">Gaming</A>
          </div>

          <div class="footer__column">
            <h3>Soporte</h3>
            <A href="/productos">Contacto</A>
            <A href="/productos">Centro de ayuda</A>
            <A href="/productos">Envíos</A>
            <A href="/productos">Garantía</A>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p>© 2026 NOVAMARKET. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;