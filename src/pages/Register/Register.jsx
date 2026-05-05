import { createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import "./Register.css";

import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [nombre, setNombre] = createSignal("");
  const [apellido, setApellido] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [messageType, setMessageType] = createSignal("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !nombre() ||
      !apellido() ||
      !email() ||
      !password() ||
      !confirmPassword()
    ) {
      setMessage("Completa todos los campos.");
      setMessageType("error");
      return;
    }

    if (password().length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      setMessageType("error");
      return;
    }

    if (password() !== confirmPassword()) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      return;
    }

    const result = register({
      nombre: nombre(),
      apellido: apellido(),
      email: email(),
      password: password(),
    });

    setMessage(result.message);
    setMessageType(result.success ? "success" : "error");

    if (result.success) {
      setTimeout(() => {
        navigate("/");
      }, 700);
    }
  };

  return (
    <section class="register-page">
      <div class="register-card">
        <div class="register-card__header">
          <span>Únete a NOVAMARKET</span>
          <h1>Crear cuenta</h1>
          <p>
            Regístrate para guardar favoritos, gestionar tu carrito y comprar
            productos tecnológicos de forma rápida.
          </p>
        </div>

        <form class="register-form" onSubmit={handleSubmit}>
          <div class="register-form__row">
            <div class="register-form__group">
              <label for="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre()}
                onInput={(event) => setNombre(event.currentTarget.value)}
              />
            </div>

            <div class="register-form__group">
              <label for="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                placeholder="Tu apellido"
                value={apellido()}
                onInput={(event) => setApellido(event.currentTarget.value)}
              />
            </div>
          </div>

          <div class="register-form__group">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="Ejemplo: usuario@correo.com"
              value={email()}
              onInput={(event) => setEmail(event.currentTarget.value)}
            />
          </div>

          <div class="register-form__group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password()}
              onInput={(event) => setPassword(event.currentTarget.value)}
            />
          </div>

          <div class="register-form__group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword()}
              onInput={(event) =>
                setConfirmPassword(event.currentTarget.value)
              }
            />
          </div>

          {message() && (
            <div class={`register-message ${messageType()}`}>{message()}</div>
          )}

          <button type="submit" class="register-form__button">
            Crear cuenta
          </button>
        </form>

        <div class="register-card__footer">
          <p>
            ¿Ya tienes cuenta? <A href="/login">Iniciar sesión</A>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;