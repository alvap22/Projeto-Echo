import { useNavigate } from "react-router-dom";

import {
useEffect,
useState
} from "react";

import {
useParams
} from "react-router-dom";

import api from "../services/api";

import Header from "../components/Header";
import SafeImage from "../components/SafeImage";

import "../styles/profile.css";

function PublicProfile() {

const navigate =
useNavigate();

const { id } =
useParams();

const [usuario, setUsuario] =
useState(null);

const [reviews, setReviews] =
useState([]);

const [seguidores,
setSeguidores] =
useState(0);

const [seguindo,
setSeguindo] =
useState(0);

const [segueUsuario,
setSegueUsuario] =
useState(false);

const [usuarioLogado,
setUsuarioLogado] =
useState(null);

useEffect(() => {


async function fetchProfile() {

  try {

    const response =
      await api.get(`/profile/${id}`);

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

    setSegueUsuario(
      response.data.segueUsuario
    );

    setUsuarioLogado(
      response.data.usuarioLogado
    );

  } catch (error) {

    console.log(error);
  }
}

fetchProfile();


}, [id]);

async function handleSeguir() {


try {

  await api.post(`/usuarios/${id}/seguir`, {});

  setSegueUsuario(true);

  setSeguidores(
    prev => prev + 1
  );

} catch (error) {

  console.log(error);
}


}

async function handleDeixarSeguir() {


try {

  await api.delete(`/usuarios/${id}/seguir`);

  setSegueUsuario(false);

  setSeguidores(
    prev => prev - 1
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

const ehMeuPerfil =
Number(
usuario.id_usuario
) === Number(
usuarioLogado
);

return (
<> <Header />


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

          {
            !ehMeuPerfil && (
              <div
                style={{
                  marginTop:
                    "15px"
                }}
              >
                {
                  segueUsuario ? (
                    <button
                      className="btn-danger"
                      onClick={
                        handleDeixarSeguir
                      }
                    >
                      Deixar de seguir
                    </button>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={
                        handleSeguir
                      }
                    >
                      Seguir
                    </button>
                  )
                }
              </div>
            )
          }

        </div>
      </div>

      <div className="profile-reviews">

        <h2>
          Reviews Publicadas
        </h2>

        {
          reviews.length === 0 ? (
            <p>
              Nenhuma review publicada.
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

export default PublicProfile;
