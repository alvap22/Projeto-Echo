import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Header from "../components/Header";

import {
  useNavigate,
} from "react-router-dom";

function AdminPanel() {

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const navigate =
    useNavigate();

  const [
    denuncias,
    setDenuncias,
  ] = useState([]);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  useEffect(() => {
    fetchDenuncias();
  }, []);

  async function fetchDenuncias() {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await axios.get(
          "http://localhost:3000/admin/denuncias",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setDenuncias(
        response.data
      );

    } catch (error) {

      console.log(error);

      alert(
        "Você não possui acesso ao painel ADM."
      );

      navigate("/");
    } finally {

      setCarregando(false);
    }
  }

  async function criarAdmin() {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.post(
        "http://localhost:3000/admin/criar-admin",
        {
          nome,
          email,
          senha,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Administrador criado!"
      );

      setNome("");
      setEmail("");
      setSenha("");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message
      );
    }
  }

  async function limparDenuncias(
    id
  ) {

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.delete(
        `http://localhost:3000/admin/denuncias/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchDenuncias();

    } catch (error) {

      console.log(error);
    }
  }

  async function excluirReview(
    id
  ) {

    try {

      const confirmar =
        window.confirm(
          "Deseja excluir esta review?"
        );

      if (!confirmar) {
        return;
      }

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

      fetchDenuncias();

    } catch (error) {

      console.log(error);
    }
  }

  if (carregando) {

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
        <h1>
          Painel ADM
        </h1>

        {/* CRIAR ADM */}

        <div
          style={{
            border:
              "1px solid #ccc",
            padding: "20px",
            borderRadius:
              "10px",
            marginBottom:
              "30px",
          }}
        >
          <h2>
            Criar Novo ADM
          </h2>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) =>
              setNome(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom:
                "10px",
            }}
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom:
                "10px",
            }}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom:
                "10px",
            }}
          />

          <button
            onClick={criarAdmin}
          >
            Criar ADM
          </button>
        </div>

        {/* DENÚNCIAS */}

        {denuncias.length ===
        0 ? (

          <p>
            Nenhuma review denunciada.
          </p>

        ) : (

          denuncias.map(
            (item) => (
              <div
                key={
                  item.id_review
                }
                style={{
                  border:
                    "1px solid #ccc",
                  padding:
                    "20px",
                  borderRadius:
                    "10px",
                  marginBottom:
                    "20px",
                }}
              >
                {item.imagem && (
                  <img
                    src={
                      item.imagem
                    }
                    alt={
                      item.titulo
                    }
                    style={{
                      width:
                        "100%",
                      maxHeight:
                        "350px",
                      objectFit:
                        "cover",
                      borderRadius:
                        "10px",
                      marginBottom:
                        "15px",
                    }}
                  />
                )}

                <h2>
                  {item.titulo}
                </h2>

                <p>
                  Autor:{" "}
                  {item.autor}
                </p>

                <p>
                  ⭐{" "}
                  {item.nota}
                  /5
                </p>

                <p>
                  🚨{" "}
                  {
                    item.denuncias
                  }{" "}
                  denúncias
                </p>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "10px",
                    marginTop:
                      "15px",
                    flexWrap:
                      "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      navigate(
                        `/review/${item.id_review}`
                      )
                    }
                  >
                    Ver Review
                  </button>

                  <button
                    onClick={() =>
                      excluirReview(
                        item.id_review
                      )
                    }
                    style={{
                      background:
                        "#c0392b",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer",
                    }}
                  >
                    Excluir Review
                  </button>

                  <button
                    onClick={() =>
                      limparDenuncias(
                        item.id_review
                      )
                    }
                    style={{
                      background:
                        "#27ae60",
                      color:
                        "white",
                      border:
                        "none",
                      padding:
                        "10px 14px",
                      borderRadius:
                        "8px",
                      cursor:
                        "pointer",
                    }}
                  >
                    Limpar Denúncias
                  </button>
                </div>
              </div>
            )
          )
        )}
      </div>
    </>
  );
}

export default AdminPanel;