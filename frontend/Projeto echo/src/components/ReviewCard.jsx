import "../styles/reviewCard.css";
import ReviewImagePlaceholder from "./ReviewImagePlaceholder";
import SafeImage from "./SafeImage";

import { useNavigate } from "react-router-dom";

function ReviewCard(props) {
  const navigate = useNavigate();

  function handleOpenReview() {
    navigate(`/review/${props.id}`);
  }

  return (
    <div className="review-card">
      {props.imagem ? (
        <SafeImage
          src={props.imagem}
          alt={props.titulo}
          className="review-image"
        />
      ) : (
        <ReviewImagePlaceholder genero={props.genero} />
      )}

      <div className="review-info">
        <h2>{props.titulo}</h2>

        <div className="review-note">
          ⭐ {props.nota}/5
        </div>

        <div className="review-meta">
          Por <span className="review-author">{props.autor}</span> • <span className="badge badge-genre">{props.genero}</span>
        </div>

        <button
          className="btn-primary"
          onClick={handleOpenReview}
        >
          Ver Review Completa
        </button>
      </div>
    </div>
  );
}

export default ReviewCard;