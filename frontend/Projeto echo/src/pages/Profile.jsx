import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import api from "../services/api";

import Header from "../components/Header";
import SafeImage from "../components/SafeImage";

import "../styles/profile.css";

function Profile() {

  const navigate =
    useNavigate();

  const [usuario, setUsuario] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  const [seguidores, setSeguidores] =
    useState(0);

  const [seguindo, setSeguindo] =
    useState(0);

  useEffect(() => {

    async function fetchProfile() {

      try {

        const response =
          await api.get("/profile");

        setUsuario(
          response.data.usuario
        );

        setReviews(
          response.data.reviews
        );

        setSeguidores(
          response.data.seguidores
        );

        setSeguindo(
          response.data.seguindo
        );

      } catch (error) {

        console.log(error);
      }
    }

    fetchProfile();

  }, []);

  function handleLogout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );

    window.location.href =
      "/login";
  }

  async function handleDelete(
    id
  ) {

    const confirmar =
      window.confirm(
        "Deseja excluir essa review?"
      );

    if (!confirmar) return;

    try {

      await api.delete(`/reviews/${id}`);

      setReviews(
        reviews.filter(
          (review) =>
            review.id !== id
        )
      );

    } catch (error) {

      console.log(error);
    }
  }

  if (!usuario) {
    return (
      <p>
        Carregando...
      </p>
    );
  }

  return (
    <>
      <Header />

      <div className="profile">

        <div className="profile-content">

          <div className="profile-header">

            <div className="profile-avatar">
              {usuario.nome[0]}
            </div>

            <div>

              <h1>
                {usuario.nome}
              </h1>

              <p>
                {usuario.email}
              </p>

              <div className="profile-stats">
                <span>
                  <strong>{reviews.length}</strong> reviews
                </span>

                <span>
                  <strong>{seguidores}</strong> seguidores
                </span>

                <span>
                  <strong>{seguindo}</strong> seguindo
                </span>
              </div>

            </div>
          </div>

          {/* BOTÃO ADM */}

          {
            usuario.tipo ===
              "admin" && (
              <button
                className="btn-primary"
                onClick={() =>
                  navigate(
                    "/admin"
                  )
                }
                style={{
                  marginTop: "10px",
                  marginRight: "10px",
                }}
              >
                Painel ADM
              </button>
            )
          }

          <button
            className="btn-danger"
            onClick={
              handleLogout
            }
            style={{
              marginTop: "10px",
              marginBottom: "30px",
            }}
          >
            Sair da conta
          </button>

          <div className="profile-reviews">

            <h2>
              Minhas Reviews
            </h2>

            {
              reviews.length === 0 ? (
                <p>
                  Nenhuma review
                  publicada ainda.
                </p>
              ) : (
                reviews.map(
                  (review) => (
                    <div
                      key={
                        review.id
                      }
                      className="profile-review-card"
                    >
                      {
                        review.imagem && (
                          <SafeImage
                            src={
                              review.imagem
                            }
                            alt={
                              review.titulo
                            }
                          />
                        )
                      }

                      <div className="review-info">

                        <h3>
                          {
                            review.titulo
                          }
                        </h3>

                        <p>
                          {
                            review.genero
                          }
                        </p>

                        <span>
                          ⭐ {
                            review.nota
                          }
                          /5
                        </span>

                        <div className="review-actions">

                          <button
                            className="btn-secondary"
                            onClick={() =>
                              navigate(
                                `/review/${review.id}`
                              )
                            }
                            style={{ padding: "8px 14px", fontSize: "13px" }}
                          >
                            Ver detalhes
                          </button>

                          <button
                            className="btn-primary"
                            onClick={() =>
                              navigate(
                                `/edit-review/${review.id}`
                              )
                            }
                            style={{ padding: "8px 14px", fontSize: "13px" }}
                          >
                            Editar
                          </button>

                          <button
                            className="btn-danger"
                            onClick={() =>
                              handleDelete(
                                review.id
                              )
                            }
                            style={{ padding: "8px 14px", fontSize: "13px" }}
                          >
                            Excluir
                          </button>

                        </div>
                      </div>
                    </div>
                  )
                )
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;