import api from "./api";

/**
 * Busca reviews paginadas do backend.
 *
 * @param {Object}  params
 * @param {number}  params.page          - Página atual (default: 1)
 * @param {number}  params.limit         - Reviews por página (default: 9)
 * @param {string}  params.search        - Texto de busca por título
 * @param {string[]} params.generos      - Array de gêneros selecionados
 * @param {string}  params.sort          - "recentes" | "antigas"
 *
 * @returns {Promise<{
 *   reviews: object[],
 *   pagina: number,
 *   limite: number,
 *   totalReviews: number,
 *   totalPaginas: number,
 *   temMais: boolean
 * }>}
 */
export async function fetchReviews({
  page = 1,
  limit = 9,
  search = "",
  generos = [],
  sort = "recentes",
} = {}) {
  const params = { page, limit, sort };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (generos.length > 0) {
    params.generos = generos.join(",");
  }

  const response = await api.get("/reviews", { params });
  return response.data;
}
