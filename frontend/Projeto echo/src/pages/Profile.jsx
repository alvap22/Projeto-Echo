import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import axios from "axios";

import Header from "../components/Header";

import "../styles/profile.css";

function Profile() {

  const navigate =
    useNavigate();

  const [usuario, setUsuario] =
    useState(null);

  const [reviews, setReviews] =
    useState([]);

  useEffect(() => {

    async function fetchProfile() {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            "http://localhost:3000/profile",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setUsuario(
          response.data.usuario
        );

        setReviews(
          response.data.reviews
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

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.delete(
        `http://localhost:3000/reviews/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

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

              <span>
                {reviews.length} reviews
                publicadas
              </span>

            </div>
          </div>

          {/* BOTÃO ADM */}

          {
            usuario.tipo ===
              "admin" && (
              <button
                onClick={() =>
                  navigate(
                    "/admin"
                  )
                }
                style={{
                  marginTop:
                    "20px",
                  padding:
                    "10px 20px",
                  border: "none",
                  borderRadius:
                    "8px",
                  backgroundColor:
                    "#ff4d4d",
                  color: "white",
                  cursor:
                    "pointer",
                  fontWeight:
                    "bold",
                }}
              >
                Painel ADM
              </button>
            )
          }

          <button
            className="logout-btn"
            onClick={
              handleLogout
            }
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
                          <img
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
                            onClick={() =>
                              navigate(
                                `/review/${review.id}`
                              )
                            }
                          >
                            Ver detalhes
                          </button>

                          <button
                            className="edit-btn"
                            onClick={() =>
                              navigate(
                                `/edit-review/${review.id}`
                              )
                            }
                          >
                            Editar
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                review.id
                              )
                            }
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