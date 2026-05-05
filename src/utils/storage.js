export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);

    if (!item) {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error al leer localStorage con la clave: ${key}`, error);
    return defaultValue;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error al guardar localStorage con la clave: ${key}`, error);
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error al eliminar localStorage con la clave: ${key}`, error);
  }
}

export function clearStorage() {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error al limpiar localStorage", error);
  }
}