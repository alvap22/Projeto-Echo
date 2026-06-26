import { useState, useEffect, useCallback, useRef } from "react";

import Header from "../components/Header";
import ReviewCard from "../components/ReviewCard";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import { fetchReviews } from "../services/reviewService";

import "../styles/home.css";

const LIMIT = 9;
const DEBOUNCE_MS = 400;

// ---------------------------------------------------------------------------
// Skeleton card exibido durante carregamento
// ---------------------------------------------------------------------------
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-meta" />
        <div className="skeleton-line skeleton-btn" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
function Home() {
  const token  = localStorage.getItem("token");
  const logado = !!token;

  // --- Estados de filtro ---
  const [search,         setSearch]         = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [sort,           setSort]           = useState("recentes");

  // --- Estados de dados ---
  const [reviews,     setReviews]     = useState([]);
  const [page,        setPage]        = useState(1);
  const [temMais,     setTemMais]     = useState(false);

  // --- Estados de UI ---
  const [loading,     setLoading]     = useState(false); // carregamento inicial/reset
  const [loadingMore, setLoadingMore] = useState(false); // "carregar mais"
  const [error,       setError]       = useState(null);

  // Ref para o debounce timer da busca
  const debounceRef = useRef(null);
  // Ref para a busca em andamento (evita race condition)
  const searchAbortRef = useRef(null);

  // -------------------------------------------------------------------------
  // Função principal de busca — recebe os parâmetros explicitamente
  // para poder ser chamada tanto no reset quanto no "carregar mais"
  // -------------------------------------------------------------------------
  const loadReviews = useCallback(async ({ currentPage, currentSearch, currentGenres, currentSort, append }) => {
    // Cancela requisição anterior se houver
    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const controller = new AbortController();
    searchAbortRef.current = controller;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const data = await fetchReviews({
        page:    currentPage,
        limit:   LIMIT,
        search:  currentSearch,
        generos: currentGenres,
        sort:    currentSort,
      });

      if (controller.signal.aborted) return;

      setReviews((prev) => append ? [...prev, ...data.reviews] : data.reviews);
      setPage(currentPage);
      setTemMais(data.temMais);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return;
      console.error("[Home] Erro ao buscar reviews:", err);
      setError("Não foi possível carregar as reviews. Tente novamente.");
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  // -------------------------------------------------------------------------
  // Efeito: reset + busca sempre que filtros mudam
  // (search usa debounce; genre e sort são imediatos)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!logado) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      loadReviews({
        currentPage:   1,
        currentSearch: search,
        currentGenres: selectedGenres,
        currentSort:   sort,
        append:        false,
      });
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedGenres, sort, logado]);

  // -------------------------------------------------------------------------
  // "Carregar mais"
  // -------------------------------------------------------------------------
  function handleLoadMore() {
    if (loadingMore || !temMais) return;
    loadReviews({
      currentPage:   page + 1,
      currentSearch: search,
      currentGenres: selectedGenres,
      currentSort:   sort,
      append:        true,
    });
  }

  // -------------------------------------------------------------------------
  // Retry após erro
  // -------------------------------------------------------------------------
  function handleRetry() {
    loadReviews({
      currentPage:   1,
      currentSearch: search,
      currentGenres: selectedGenres,
      currentSort:   sort,
      append:        false,
    });
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <>
      <Header />

      <div className="home">
        <div className="home-content">
          <h1>Reviews da Comunidade</h1>

          <p>Descubra análises e opiniões da comunidade</p>

          <SearchBar search={search} setSearch={setSearch} />

          {/* Filtros + Ordenação */}
          <div className="filter-row">
            <GenreFilter
              selectedGenres={selectedGenres}
              setSelectedGenres={setSelectedGenres}
            />

            <div className="sort-controls">
              <button
                className={`sort-btn ${sort === "recentes" ? "sort-btn--active" : ""}`}
                onClick={() => setSort("recentes")}
              >
                Mais recentes
              </button>
              <button
                className={`sort-btn ${sort === "antigas" ? "sort-btn--active" : ""}`}
                onClick={() => setSort("antigas")}
              >
                Mais antigas
              </button>
            </div>
          </div>

          {/* Bloco principal */}
          {!logado ? (
            <div className="login-required-banner">
              <h2>🔒 Faça login para visualizar as reviews</h2>
              <p>Entre na sua conta para acessar os conteúdos da comunidade.</p>
            </div>
          ) : (
            <>
              {/* Erro */}
              {error && (
                <div className="error-banner" role="alert">
                  <span>⚠️ {error}</span>
                  <button className="btn-retry" onClick={handleRetry}>
                    Tentar novamente
                  </button>
                </div>
              )}

              {/* Lista de reviews */}
              <div className="review-list">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    id={review.id}
                    titulo={review.titulo}
                    nota={review.nota}
                    autor={review.autor}
                    genero={review.genero}
                    imagem={review.imagem}
                  />
                ))}

                {/* Skeletons de carregamento inicial */}
                {loading &&
                  Array.from({ length: LIMIT }).map((_, i) => (
                    <SkeletonCard key={`sk-${i}`} />
                  ))
                }

                {/* Skeletons de "carregar mais" */}
                {loadingMore &&
                  Array.from({ length: LIMIT }).map((_, i) => (
                    <SkeletonCard key={`skm-${i}`} />
                  ))
                }
              </div>

              {/* Estado vazio */}
              {!loading && !error && reviews.length === 0 && (
                <div className="empty-state">
                  <span>🔍</span>
                  <p>Nenhuma review encontrada para os filtros selecionados.</p>
                </div>
              )}

              {/* Botão "Carregar mais" */}
              {!loading && !error && temMais && (
                <div className="load-more-wrapper">
                  <button
                    className="btn-load-more"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Carregando..." : "Carregar mais"}
                  </button>
                </div>
              )}

              {/* Fim das reviews */}
              {!loading && !error && reviews.length > 0 && !temMais && (
                <p className="end-of-reviews">Você chegou ao fim das reviews.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;