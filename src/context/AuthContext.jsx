import { createContext, useContext, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { usuarios } from "../data/usuarios";
import { getStorageItem, setStorageItem, removeStorageItem } from "../utils/storage";

const AuthContext = createContext();

export function AuthProvider(props) {
  const [auth, setAuth] = createStore({
    user: getStorageItem("novamarket_user", null),
    users: getStorageItem("novamarket_users", usuarios),
  });

  createEffect(() => {
    setStorageItem("novamarket_users", auth.users);
  });

  createEffect(() => {
    if (auth.user) {
      setStorageItem("novamarket_user", auth.user);
    } else {
      removeStorageItem("novamarket_user");
    }
  });

  const login = (email, password) => {
    const userFound = auth.users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!userFound) {
      return {
        success: false,
        message: "Correo o contraseña incorrectos.",
      };
    }

    const userSession = {
      id: userFound.id,
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      email: userFound.email,
      rol: userFound.rol,
    };

    setAuth("user", userSession);

    return {
      success: true,
      message: "Inicio de sesión exitoso.",
    };
  };

  const register = (newUser) => {
    const userExists = auth.users.some(
      (user) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (userExists) {
      return {
        success: false,
        message: "Este correo ya está registrado.",
      };
    }

    const createdUser = {
      id: Date.now(),
      nombre: newUser.nombre,
      apellido: newUser.apellido,
      email: newUser.email,
      password: newUser.password,
      rol: "cliente",
    };

    setAuth("users", [...auth.users, createdUser]);

    const userSession = {
      id: createdUser.id,
      nombre: createdUser.nombre,
      apellido: createdUser.apellido,
      email: createdUser.email,
      rol: createdUser.rol,
    };

    setAuth("user", userSession);

    return {
      success: true,
      message: "Registro exitoso.",
    };
  };

  const logout = () => {
    setAuth("user", null);
    removeStorageItem("novamarket_user");
    // Limpiar datos del guest al logout
    removeStorageItem("novamarket_cart_guest");
    removeStorageItem("novamarket_favorites_guest");
  };

  const isAuthenticated = () => {
    return auth.user !== null;
  };

  const updateUser = (updates) => {
    if (!auth.user) return;

    const updatedUser = { ...auth.user, ...updates };
    setAuth("user", updatedUser);

    setAuth(
      "users",
      auth.users.map((user) =>
        user.id === auth.user.id ? { ...user, ...updates } : user
      )
    );
  };

  const value = {
    auth,
    login,
    register,
    logout,
    isAuthenticated,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}