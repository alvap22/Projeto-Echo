import "../styles/reviewCard.css";

import { useNavigate } from "react-router-dom";

function ReviewCard(props) {
  const navigate = useNavigate();

  function handleOpenReview() {
    navigate(`/review/${props.id}`);
  }

  return (
    <div className="review-card">
      {props.imagem && (
        <img
          src={props.imagem}
          alt={props.titulo}
          className="review-image"
        />
      )}

      <div className="review-info">
        <h2>{props.titulo}</h2>

        <p className="review-note">
          ⭐ {props.nota}/5
        </p>

        <p className="review-meta">
          Por {props.autor} •{" "}
          {props.genero}
        </p>

        <button
          onClick={handleOpenReview}
        >
          Ver Review Completa
        </button>
      </div>
    </div>
  );
}

export default ReviewCard;