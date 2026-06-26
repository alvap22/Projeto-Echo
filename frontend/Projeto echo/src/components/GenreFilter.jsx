import { useState, useEffect, useRef } from "react";
import axios from "axios";

function GenreFilter({ selectedGenres, setSelectedGenres }) {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchGenres() {
      try {
        const response = await axios.get("http://localhost:3000/generos");
        setGenres(response.data);
      } catch (error) {
        console.error("Erro ao buscar gêneros no filtro:", error);
      }
    }
    fetchGenres();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (genreName) => {
    if (selectedGenres.includes(genreName)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreName));
    } else {
      setSelectedGenres([...selectedGenres, genreName]);
    }
  };

  const handleClearFilters = (e) => {
    e.stopPropagation();
    setSelectedGenres([]);
  };

  const activeCount = selectedGenres.length;

  return (
    <div className="genre-filter-container" ref={dropdownRef}>
      <div className="genre-filter-controls">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className={`filter-toggle-btn ${isOpen ? "active" : ""}`}
        >
          Filtros / Gêneros {activeCount > 0 ? `(${activeCount})` : "▼"}
        </button>

        {activeCount > 0 && (
          <button onClick={handleClearFilters} className="clear-filters-btn">
            Limpar filtros
          </button>
        )}
      </div>

      {isOpen && (
        <div className="genre-dropdown-menu">
          <div className="genre-grid">
            {genres.map((genre) => (
              <label key={genre.id_genero} className="genre-checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre.nome)}
                  onChange={() => handleCheckboxChange(genre.nome)}
                />
                <span>{genre.nome}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default GenreFilter;