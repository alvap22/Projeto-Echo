import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";
import { validateImageFile } from "../services/uploadValidation";

import "../styles/createReview.css";

function CreateReview() {
  const navigate = useNavigate();

  // ── Campos do formulário ───────────────────────────────────────────────────
  const [titulo,    setTitulo]    = useState("");
  const [descricao, setDescricao] = useState("");
  const [nota,      setNota]      = useState(0);
  const [genero,    setGenero]    = useState("");
  const [imagem,    setImagem]    = useState(null);
  const [preview,   setPreview]   = useState(null);

  // ── Validação e estado geral ───────────────────────────────────────────────
  const [erros,       setErros]       = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting,  setSubmitting]  = useState(false);

  // ── Lista de gêneros ───────────────────────────────────────────────────────
  const [listaGeneros, setListaGeneros] = useState([]);

  // Ref para resetar o input de arquivo programaticamente
  const fileInputRef = useRef(null);

  // ── Fetch de gêneros ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchGeneros() {
      try {
        const response = await api.get("/generos");
        setListaGeneros(response.data);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    }
    fetchGeneros();
  }, []);

  // ── Handler de seleção de arquivo ─────────────────────────────────────────
  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    const { valid, error } = validateImageFile(file);

    if (!valid) {
      // Limpa o campo e o preview
      setImagem(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setErros((prev) => ({ ...prev, imagem: error }));
      return;
    }

    setImagem(file);
    setPreview(URL.createObjectURL(file));
    setErros((prev) => ({ ...prev, imagem: null }));
  }

  // ── Handler remover imagem ────────────────────────────────────────────────
  function handleRemoveImage(e) {
    e.stopPropagation(); // evita abrir o seletor de arquivo ao clicar no botão
    setImagem(null);
    setPreview(null);
    setErros((prev) => ({ ...prev, imagem: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = {};

    if (!titulo.trim())   novosErros.titulo    = "O título é obrigatório";
    if (!descricao.trim()) novosErros.descricao = "A descrição é obrigatória";
    if (!genero)          novosErros.genero    = "Selecione um gênero";
    if (nota === 0)       novosErros.nota      = "Selecione uma nota";

    // Mantém erro de imagem existente (validado no onChange)
    if (erros.imagem) novosErros.imagem = erros.imagem;

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setSubmitError(null);
    setSubmitting(true);

    const formData = new FormData();
    formData.append("titulo",    titulo);
    formData.append("descricao", descricao);
    formData.append("nota",      nota);
    formData.append("genero",    genero);
    if (imagem) formData.append("imagem", imagem);

    try {
      await api.post("/reviews", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/home");
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Ocorreu um erro ao publicar a review. Tente novamente.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Header />

      <div className="create-review">
        <div className="create-review-content">
          <h1>Criar Review</h1>

          {/* Erro geral de envio */}
          {submitError && (
            <div className="submit-error-banner" role="alert">
              ⚠️ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ── Título ── */}
            <div className="form-group">
              <label>Título da Review *</label>
              <input
                type="text"
                placeholder="Ex: Cyberpunk 2077 - Uma jornada pela Night City"
                value={titulo}
                onChange={(e) => {
                  if (e.target.value.length <= 90) setTitulo(e.target.value);
                }}
              />
              <p className="char-counter">{titulo.length}/90</p>
              {erros.titulo && (
                <p className="error-message">{erros.titulo}</p>
              )}
            </div>

            {/* ── Descrição ── */}
            <div className="form-group">
              <label>Descrição *</label>
              <textarea
                placeholder="Escreva sua análise detalhada do jogo..."
                value={descricao}
                onChange={(e) => {
                  if (e.target.value.length <= 500) setDescricao(e.target.value);
                }}
              />
              <p className="char-counter">{descricao.length}/500</p>
              {erros.descricao && (
                <p className="error-message">{erros.descricao}</p>
              )}
            </div>

            {/* ── Upload de imagem ── */}
            <div className="form-group">
              <label>Imagem (opcional)</label>

              <div className={`image-upload ${preview ? "image-upload--has-preview" : ""} ${erros.imagem ? "image-upload--error" : ""}`}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleFileChange}
                />

                {preview ? (
                  <img
                    src={preview}
                    alt="Preview da imagem"
                    className="preview-image"
                  />
                ) : (
                  /* ── Estado: aguardando seleção ── */
                  <>
                    <p>Clique ou arraste uma imagem</p>
                    <span>JPG, JPEG, PNG ou WEBP — até 5 MB</span>
                  </>
                )}
              </div>

              {/* Botão FORA da área de upload para não ser bloqueado pelo input invisível */}
              {preview && (
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={handleRemoveImage}
                  title="Remover imagem"
                >
                  ✕ Remover imagem
                </button>
              )}

              {erros.imagem && (
                <p className="error-message">{erros.imagem}</p>
              )}
            </div>

            {/* ── Gênero ── */}
            <div className="form-group">
              <label>Gênero *</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                <option value="">Selecione um gênero</option>
                {listaGeneros.map((g) => (
                  <option key={g.id_genero} value={g.nome}>
                    {g.nome}
                  </option>
                ))}
              </select>
              {erros.genero && (
                <p className="error-message">{erros.genero}</p>
              )}
            </div>

            {/* ── Nota ── */}
            <div className="form-group">
              <label>Nota (1 a 5 estrelas) *</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setNota(star)}
                    className={star <= nota ? "star active" : "star"}
                  >
                    ★
                  </span>
                ))}
              </div>
              {erros.nota && (
                <p className="error-message">{erros.nota}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", padding: "14px" }}
              disabled={submitting}
            >
              {submitting ? "Publicando..." : "Publicar Review"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateReview;