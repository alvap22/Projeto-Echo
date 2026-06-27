import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

import Header from "../components/Header";
import "../styles/reviewDetail.css";

function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [review, setReview] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [textoComentario, setTextoComentario] = useState("");
  const [respostaTexto, setRespostaTexto] = useState("");
  const [comentarioRespondendo, setComentarioRespondendo] = useState(null);
  const [curtidas, setCurtidas] = useState(0);
  const [curtido, setCurtido] = useState(false);
  const [confirmandoDenuncia, setConfirmandoDenuncia] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", isError: false });

  async function handleComentario() {
    try {
      if (!textoComentario.trim()) {
        setFeedback({ message: "Digite um comentário.", isError: true });
        return;
      }
      setFeedback({ message: "", isError: false });
      await api.post(
        `/reviews/${id}/comentarios`,
        {
          texto: textoComentario,
          id_comentario_pai: null,
        }
      );

      const response = await api.get(`/admin/review/${id}`);

      setComentarios(response.data.comentarios || []);
      setTextoComentario("");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchReview() {
      try {
        const response = await api.get(`/admin/review/${id}`);
        setReview(response.data.review);
        setComentarios(response.data.comentarios || []);
        setCurtidas(response.data.curtidas || 0);
        setCurtido(response.data.curtido || false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchReview();
  }, [id]);

  async function handleResposta(idComentario) {
    try {
      if (!respostaTexto.trim()) {
        return;
      }
      await api.post(
        `/reviews/${id}/comentarios`,
        {
          texto: respostaTexto,
          id_comentario_pai: idComentario,
        }
      );

      const response = await api.get(`/admin/review/${id}`);

      setComentarios(response.data.comentarios || []);
      setRespostaTexto("");
      setComentarioRespondendo(null);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCurtir() {
    try {
      const response = await api.post(`/reviews/${id}/curtir`, {});

      if (response.data.curtido) {
        setCurtido(true);
        setCurtidas((prev) => prev + 1);
      } else {
        setCurtido(false);
        setCurtidas((prev) => prev - 1);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDenunciaConfirmada() {
    try {
      setConfirmandoDenuncia(false);
      const response = await api.post(`/reviews/${id}/denunciar`, {});
      setFeedback({ message: response.data.message, isError: false });
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        setFeedback({ message: error.response.data.message, isError: true });
      }
    }
  }

  function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  const comentariosPrincipais = (comentarios || []).filter(
    (comentario) => !comentario.id_comentario_pai
  );

  if (!review) {
    return (
      <div className="review-detail-loading">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="review-detail">
        <div className="review-detail-content">
          {review.imagem && (
            <img
              src={review.imagem}
              alt={review.titulo}
              className="review-image"
            />
          )}

          <div className="review-main-info">
            <h1>{review.titulo}</h1>

            <div className="review-meta">
              <span className="review-rating">⭐ {review.nota}/5</span>
              <span className="badge badge-genre">{review.genero}</span>
              <span className="review-author">
                Autor:{" "}
                <strong
                  onClick={() => navigate(`/profile/${review.id_autor}`)}
                  className="author-link"
                >
                  {review.autor}
                </strong>
              </span>
            </div>

            <p className="review-description">{review.descricao}</p>

            {feedback.message && (
              <div className={`alert-feedback ${feedback.isError ? "alert-error" : "alert-success"}`}>
                <span>{feedback.message}</span>
                <button onClick={() => setFeedback({ message: "", isError: false })} className="btn-ghost" style={{ padding: "0 5px", fontSize: "16px" }}>&times;</button>
              </div>
            )}

            {confirmandoDenuncia && (
              <div className="alert-feedback alert-warning" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-start', margin: '20px 0' }}>
                <span style={{ fontWeight: "600" }}>🔒 Deseja realmente denunciar esta review?</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-danger" onClick={handleDenunciaConfirmada} style={{ padding: '6px 12px', fontSize: '13px' }}>Sim, denunciar</button>
                  <button className="btn-secondary" onClick={() => setConfirmandoDenuncia(false)} style={{ padding: '6px 12px', fontSize: '13px' }}>Cancelar</button>
                </div>
              </div>
            )}

            <div className="review-actions-bar">
              <button
                onClick={handleCurtir}
                className={`btn-secondary ${curtido ? "curtido" : ""}`}
              >
                {curtido ? "💔 Descurtir" : "❤️ Curtir"}
              </button>

              <span className="likes-counter">
                <strong>{curtidas}</strong> curtidas
              </span>

              <button
                onClick={() => setConfirmandoDenuncia(true)}
                className="btn-danger"
                style={{ marginLeft: "auto" }}
              >
                🚨 Denunciar
              </button>
            </div>

            <hr className="review-divider" />

            <div className="comments-section">
              <h2>Comentários</h2>

              <div className="new-comment-box">
                <textarea
                  placeholder="Escreva um comentário..."
                  value={textoComentario}
                  onChange={(e) => setTextoComentario(e.target.value)}
                />
                <button onClick={handleComentario} className="btn-primary">
                  Comentar
                </button>
              </div>

              <div className="comments-list">
                {comentariosPrincipais.map((comentario) => (
                  <div
                    key={comentario.id_comentario}
                    className="comment-card"
                  >
                    <div className="comment-header">
                      <strong>{comentario.autor}</strong>
                      <span className="comment-date">
                        {formatarData(comentario.data_comentario)}
                      </span>
                    </div>

                    <p className="comment-text">{comentario.texto}</p>
                    
                    <button
                      onClick={() => setComentarioRespondendo(comentario.id_comentario)}
                      className="btn-ghost btn-reply"
                      style={{ padding: "4px 8px", fontSize: "12px", marginTop: "8px" }}
                    >
                      Responder
                    </button>

                    {comentarioRespondendo === comentario.id_comentario && (
                      <div className="reply-form">
                        <textarea
                          placeholder="Digite sua resposta..."
                          value={respostaTexto}
                          onChange={(e) => setRespostaTexto(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                          <button
                            onClick={() => handleResposta(comentario.id_comentario)}
                            className="btn-primary"
                            style={{ padding: "6px 12px", fontSize: "13px" }}
                          >
                            Enviar resposta
                          </button>
                          <button
                            onClick={() => setComentarioRespondendo(null)}
                            className="btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "13px" }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}

                    {comentarios
                      .filter(
                        (resposta) =>
                          resposta.id_comentario_pai === comentario.id_comentario
                      )
                      .map((resposta) => (
                        <div
                          key={resposta.id_comentario}
                          className="comment-card reply-card"
                        >
                          <div className="comment-header">
                            <strong>{resposta.autor}</strong>
                            <span className="comment-date">
                              {formatarData(resposta.data_comentario)}
                            </span>
                          </div>
                          <p className="comment-text">{resposta.texto}</p>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewDetail;