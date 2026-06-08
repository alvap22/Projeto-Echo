import { useState } from "react";

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

  async function handleSubmit(e) {
    e.preventDefault();

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
                onChange={(e) =>
                  setTitulo(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label>
                Descrição *
              </label>

              <textarea
                placeholder="Escreva sua análise detalhada do jogo..."
                value={descricao}
                onChange={(e) =>
                  setDescricao(
                    e.target.value
                  )
                }
              ></textarea>
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

                <option value="RPG">
                  RPG
                </option>

                <option value="Ação">
                  Ação
                </option>

                <option value="Terror">
                  Terror
                </option>

                <option value="FPS">
                  FPS
                </option>

                <option value="Aventura">
                  Aventura
                </option>

                <option value="Indie">
                  Indie
                </option>

                <option value="Estratégia">
                  Estratégia
                </option>
              </select>
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
            </div>

            <button type="submit">
              Publicar Review
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateReview;