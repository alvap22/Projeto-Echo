function GenreFilter({
  selectedGenre,
  setSelectedGenre,
}) {
  return (
    <div className="filters">
      <button
        onClick={() => setSelectedGenre("Todos")}
      >
        Todos
      </button>

      <button
        onClick={() => setSelectedGenre("RPG")}
      >
        RPG
      </button>

      <button
        onClick={() => setSelectedGenre("Ação")}
      >
        Ação
      </button>

      <button
        onClick={() => setSelectedGenre("Terror")}
      >
        Terror
      </button>
    </div>
  );
}

export default GenreFilter;