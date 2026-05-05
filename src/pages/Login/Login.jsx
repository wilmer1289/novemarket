import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import "./Login.css";

import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [messageType, setMessageType] = createSignal("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email() || !password()) {
      setMessage("Completa todos los campos.");
      setMessageType("error");
      return;
    }

    const result = login(email(), password());

    setMessage(result.message);
    setMessageType(result.success ? "success" : "error");

    if (result.success) {
      setTimeout(() => {
        navigate("/");
      }, 700);
    }
  };

  return (
    <section class="login-page">
      <div class="login-card">
        <div class="login-card__header">
          <span>Bienvenido nuevamente</span>
          <h1>Iniciar sesión</h1>
          <p>
            Accede a tu cuenta de NOVAMARKET para gestionar tus compras,
            favoritos y carrito.
          </p>
        </div>

        <form class="login-form" onSubmit={handleSubmit}>
          <div class="login-form__group">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="Ejemplo: cliente@novamarket.com"
              value={email()}
              onInput={(event) => setEmail(event.currentTarget.value)}
            />
          </div>

          <div class="login-form__group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password()}
              onInput={(event) => setPassword(event.currentTarget.value)}
            />
          </div>

          {message() && (
            <div class={`login-message ${messageType()}`}>{message()}</div>
          )}

          <button type="submit" class="login-form__button">
            Ingresar
          </button>
        </form>

        <div class="login-card__footer">
          <p>
            ¿No tienes cuenta? <A href="/register">Crear cuenta</A>
          </p>

          <div class="login-demo">
            <strong>Usuario de prueba:</strong>
            <span>cliente@novamarket.com</span>
            <span>cliente123</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;