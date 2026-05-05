import "./SearchBar.css";

function SearchBar(props) {
  return (
    <div class="search-bar">
      <span class="search-bar__icon">🔎</span>

      <input
        type="text"
        placeholder={props.placeholder || "Buscar producto..."}
        value={props.value || ""}
        onInput={(event) => props.onSearch(event.currentTarget.value)}
      />

      {props.value && (
        <button
          type="button"
          class="search-bar__clear"
          onClick={() => props.onSearch("")}
          aria-label="Limpiar búsqueda"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;