import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import axios from "axios";

import Header from "../components/Header";

function ReviewDetail() {
  const { id } =
    useParams();

  const [review, setReview] =
    useState(null);

  const [
    comentarios,
    setComentarios,
  ] = useState([]);

  const [
    textoComentario,
    setTextoComentario,
  ] = useState("");

  const [curtidas, setCurtidas] =
    useState(0);

  const [curtido, setCurtido] =
    useState(false);

  useEffect(() => {
    async function fetchReview() {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            `http://localhost:3000/reviews/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setReview(
          response.data.review
        );

        setComentarios(
          response.data
            .comentarios
        );

        setCurtidas(
          response.data
            .curtidas
        );

        setCurtido(
          response.data
            .curtido
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetchReview();
  }, [id]);

  async function handleComentario() {
    try {
      if (
        !textoComentario.trim()
      ) {
        alert(
          "Digite um comentário."
        );

        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(
        `http://localhost:3000/reviews/${id}/comentarios`,
        {
          texto:
            textoComentario,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const response =
        await axios.get(
          `http://localhost:3000/reviews/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setComentarios(
        response.data
          .comentarios
      );

      setTextoComentario("");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCurtir() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.post(
          `http://localhost:3000/reviews/${id}/curtir`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (
        response.data
          .curtido
      ) {
        setCurtido(true);

        setCurtidas(
          (prev) => prev + 1
        );
      } else {
        setCurtido(false);

        setCurtidas(
          (prev) => prev - 1
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDenuncia() {
    try {
      const confirmar =
        window.confirm(
          "Deseja realmente denunciar esta review?"
        );

      if (!confirmar) {
        return;
      }

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.post(
          `http://localhost:3000/reviews/${id}/denunciar`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      alert(
        response.data.message
      );
    } catch (error) {
      console.log(error);

      if (
        error.response?.data
          ?.message
      ) {
        alert(
          error.response.data
            .message
        );
      }
    }
  }

  function formatarData(
    data
  ) {
    return new Date(
      data
    ).toLocaleString(
      "pt-BR",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  }

  if (!review) {
    return (
      <p>
        Carregando...
      </p>
    );
  }

  return (
    <>
      <Header />

      <div
        style={{
          maxWidth: "900px",
          margin:
            "40px auto",
          padding: "20px",
        }}
      >
        {review.imagem && (
          <img
            src={review.imagem}
            alt={
              review.titulo
            }
            style={{
              width: "100%",
              borderRadius:
                "12px",
              marginBottom:
                "20px",
            }}
          />
        )}

        <h1>
          {review.titulo}
        </h1>

        <p>
          {review.descricao}
        </p>

        <span>
          ⭐ {review.nota}/5
        </span>

        <p>
          Gênero:{" "}
          {review.genero}
        </p>

        <p>
          Autor:{" "}
          {review.autor}
        </p>

        {/* CURTIDAS E DENÚNCIA */}

        <div
          style={{
            display: "flex",
            alignItems:
              "center",
            gap: "12px",
            marginTop:
              "20px",
            flexWrap:
              "wrap",
          }}
        >
          <button
            onClick={
              handleCurtir
            }
            style={{
              padding:
                "10px 18px",
              border: "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >
            {curtido
              ? "💔 Descurtir"
              : "❤️ Curtir"}
          </button>

          <span>
            {curtidas}{" "}
            curtidas
          </span>

          <button
            onClick={
              handleDenuncia
            }
            style={{
              padding:
                "10px 18px",
              border: "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
              backgroundColor:
                "#ff4d4d",
              color: "white",
            }}
          >
            🚨 Denunciar
          </button>
        </div>

        <hr
          style={{
            margin:
              "30px 0",
          }}
        />

        <h2>
          Comentários
        </h2>

        <textarea
          placeholder="Escreva um comentário..."
          value={
            textoComentario
          }
          onChange={(e) =>
            setTextoComentario(
              e.target.value
            )
          }
          style={{
            width: "100%",
            minHeight:
              "100px",
            padding:
              "10px",
            marginTop:
              "10px",
          }}
        />

        <button
          onClick={
            handleComentario
          }
          style={{
            marginTop:
              "10px",
            padding:
              "10px 20px",
          }}
        >
          Comentar
        </button>

        <div
          style={{
            marginTop:
              "30px",
          }}
        >
          {comentarios.map(
            (
              comentario
            ) => (
              <div
                key={
                  comentario.id_comentario
                }
                style={{
                  border:
                    "1px solid #ccc",
                  padding:
                    "12px",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "12px",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "8px",
                  }}
                >
                  <strong>
                    {
                      comentario.autor
                    }
                  </strong>

                  <span
                    style={{
                      fontSize:
                        "12px",
                      color:
                        "#777",
                    }}
                  >
                    {formatarData(
                      comentario.data_comentario
                    )}
                  </span>
                </div>

                <p>
                  {
                    comentario.texto
                  }
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default ReviewDetail;