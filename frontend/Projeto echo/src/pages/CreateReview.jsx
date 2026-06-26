import { useState, useEffect } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import "../styles/createReview.css";

function CreateReview() {
  const navigate = useNavigate();

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
    useState(null);

    const [erros, setErros] =
  useState({});

  const [listaGeneros, setListaGeneros] = useState([]);

  useEffect(() => {
    async function fetchGeneros() {
      try {
        const response = await axios.get("http://localhost:3000/generos");
        setListaGeneros(response.data);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    }
    fetchGeneros();
  }, []);

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

    const formData = new FormData();

    formData.append("titulo", titulo);

    formData.append(
      "descricao",
      descricao
    );

    formData.append("nota", nota);

    formData.append("genero", genero);

    if (imagem) {
      formData.append(
        "imagem",
        imagem
      );
    }

    try {
    const token =
  localStorage.getItem("token");

await axios.post(
  "http://localhost:3000/reviews",
  formData,
  {
    headers: {
      "Content-Type":
        "multipart/form-data",

      Authorization:
        `Bearer ${token}`,
    },
  }
);

      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Header />

      <div className="create-review">
        <div className="create-review-content">
          <h1>Criar Review</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Título da Review *
              </label>

              <input
                type="text"
                placeholder="Ex: Cyberpunk 2077 - Uma jornada pela Night City"
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
                placeholder="Escreva sua análise detalhada do jogo..."
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
                Imagem (opcional)
              </label>

              <div className="image-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file =
                      e.target
                        .files[0];

                    if (file) {
                      setImagem(
                        file
                      );

                      setPreview(
                        URL.createObjectURL(
                          file
                        )
                      );
                    }
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
                Nota (1 a 5 estrelas)
                *
              </label>

              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <span
                      key={star}
                      onClick={() =>
                        setNota(star)
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
              Publicar Review
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateReview;