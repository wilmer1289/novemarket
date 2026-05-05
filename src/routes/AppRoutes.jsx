import { Route } from "@solidjs/router";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import Cart from "../pages/Cart/Cart";
import Favorites from "../pages/Favorites/Favorites";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Checkout from "../pages/Checkout/Checkout";
import Profile from "../pages/Profile/Profile";

function AppRoutes() {
  return (
    <>
      <Route path="/" component={Home} />
      <Route path="/productos/categoria/:categoria" component={Products} />
      <Route path="/productos/:id" component={ProductDetail} />
      <Route path="/productos" component={Products} end />
      <Route path="/carrito" component={Cart} />
      <Route path="/favoritos" component={Favorites} />
      <Route path="/perfil/:section?" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/checkout" component={Checkout} />
    </>
  );
}

export default AppRoutes;