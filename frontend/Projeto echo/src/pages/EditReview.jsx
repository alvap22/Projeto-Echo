import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

import Header from "../components/Header";

import "../styles/createReview.css";

function EditReview() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [titulo, setTitulo] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [nota, setNota] =
    useState(0);

  const [genero, setGenero] =
    useState("");

  const [imagem, setImagem] =
    useState(null);

  const [preview, setPreview] =
    useState("");
    const [erros, setErros] =
  useState({});

  const [listaGeneros, setListaGeneros] = useState([]);

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

  useEffect(() => {
  async function fetchReview() {
    try {
      const response =
        await api.get(
          `/reviews/${id}`
        );

      console.log(response.data);

      const review =
        response.data.review;

      setTitulo(review.titulo);

      setDescricao(
        review.descricao
      );

      setNota(review.nota);

      setGenero(
        review.genero
      );

      setPreview(
        review.imagem
      );
    } catch (error) {

  console.log(error);

  console.log(
    error.response?.data
  );

  console.error(
    error.response?.data?.message
  );

    }
  }

  fetchReview();
}, [id]);

  async function handleSubmit(e) {
  e.preventDefault();

  const novosErros = {};

  if (!titulo.trim()) {
    novosErros.titulo =
      "O título é obrigatório";
  }

  if (!descricao.trim()) {
    novosErros.descricao =
      "A descrição é obrigatória";
  }

  if (!genero) {
    novosErros.genero =
      "Selecione um gênero";
  }

  if (nota === 0) {
    novosErros.nota =
      "Selecione uma nota";
  }

  if (
    Object.keys(novosErros)
      .length > 0
  ) {
    setErros(novosErros);
    return;
  }

  setErros({});

  try {
      const formData =
        new FormData();

      formData.append(
        "titulo",
        titulo
      );

      formData.append(
        "descricao",
        descricao
      );

      formData.append(
        "nota",
        nota
      );

      formData.append(
        "genero",
        genero
      );

      if (imagem) {
        formData.append(
          "imagem",
          imagem
        );
      }

      await api.put(
        `/reviews/${id}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header />

      <div className="create-review">
        <div className="create-review-content">
          <h1>
            Editar Review
          </h1>

          <form
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>
                Título da Review *
              </label>

              <input
  type="text"
  value={titulo}
  onChange={(e) => {
    if (
      e.target.value.length <= 90
    ) {
      setTitulo(
        e.target.value
      );
    }
  }}
/>

<p className="char-counter">
  {titulo.length}/90
</p>

{erros.titulo && (
  <p className="error-message">
    {erros.titulo}
  </p>
)}
            </div>

            <div className="form-group">
              <label>
                Descrição *
              </label>

              <textarea
  value={descricao}
  onChange={(e) => {
    if (
      e.target.value.length <= 500
    ) {
      setDescricao(
        e.target.value
      );
    }
  }}
></textarea>

<p className="char-counter">
  {descricao.length}/500
</p>

{erros.descricao && (
  <p className="error-message">
    {erros.descricao}
  </p>
)}
            </div>

            <div className="form-group">
              <label>
                Imagem
              </label>

              <div className="image-upload">
                <input
                  type="file"
                  onChange={(e) => {
                    setImagem(
                      e.target.files[0]
                    );

                    setPreview(
                      URL.createObjectURL(
                        e.target
                          .files[0]
                      )
                    );
                  }}
                />

                <p>
                  Clique ou arraste
                  uma imagem
                </p>

                <span>
                  PNG, JPG até 5MB
                </span>

                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="preview-image"
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>
                Gênero *
              </label>

              <select
                value={genero}
                onChange={(e) =>
                  setGenero(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Selecione um gênero
                </option>

                {listaGeneros.map((g) => (
                  <option key={g.id_genero} value={g.nome}>
                    {g.nome}
                  </option>
                ))}
              </select>
              {erros.genero && (
  <p className="error-message">
    {erros.genero}
  </p>
)}
            </div>

            <div className="form-group">
              <label>
                Nota *
              </label>

              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <span
                      key={star}
                      onClick={() =>
                        setNota(
                          star
                        )
                      }
                      className={
                        star <= nota
                          ? "star active"
                          : "star"
                      }
                    >
                      ★
                    </span>
                  )
                )}
              </div>
              {erros.nota && (
  <p className="error-message">
    {erros.nota}
  </p>
)}
            </div>

            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px" }}>
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditReview;