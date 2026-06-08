import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

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

  useEffect(() => {
    async function fetchReview() {
      try {
        const response =
          await axios.get(
            `http://localhost:3000/reviews/${id}`
          );

        const review =
          response.data;

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
      }
    }

    fetchReview();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem(
          "token"
        );

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

      await axios.put(
        `http://localhost:3000/reviews/${id}`,
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

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
                  Selecione um
                  gênero
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
            </div>

            <button type="submit">
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default EditReview;