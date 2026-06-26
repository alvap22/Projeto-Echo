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

    const [busca, setBusca] =
  useState("");

  const [
  filtro,
  setFiltro,
] = useState("todas");

const [dashboard, setDashboard] =
  useState({
    usuarios: 0,
    reviews: 0,
    reviewsExcluidas: 0,
    denuncias: 0,
    admins: 0,
  });

  const [
    denuncias,
    setDenuncias,
  ] = useState([]);

const [aba, setAba] =
  useState("reviews");

  const [mostrarModalAdmin, setMostrarModalAdmin] =
  useState(false);

  const [
    carregando,
    setCarregando,
  ] = useState(true);

  useEffect(() => {

  fetchDenuncias();

  fetchDashboard();

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

  if (!nome.trim()) {
    alert("Informe o nome.");
    return;
  }

  if (!email.trim()) {
    alert("Informe o e-mail.");
    return;
  }

  if (!senha.trim()) {
    alert("Informe a senha.");
    return;
  }

  if (senha.length < 6) {
    alert("A senha deve ter pelo menos 6 caracteres.");
    return;
  }

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

  async function fetchDashboard() {

  try {

    const token =
      localStorage.getItem(
        "token"
      );

    const response =
      await axios.get(
        "http://localhost:3000/admin/dashboard",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    setDashboard(
      response.data
    );

  } catch (error) {

    console.log(error);

  }
}

  const denunciasFiltradas =
  denuncias
    .filter((item) => {

      const texto =
        busca.toLowerCase();

      const passouBusca =
        item.titulo
          ?.toLowerCase()
          .includes(texto) ||
        item.autor
          ?.toLowerCase()
          .includes(texto);

      if (!passouBusca)
        return false;

      if (
        filtro === "ativas"
      ) {
        return item.ativo;
      }

      if (
        filtro ===
        "excluidas"
      ) {
        return !item.ativo;
      }

      if (
        filtro ===
        "denunciadas"
      ) {
        return (
          Number(
            item.denuncias
          ) > 0
        );
      }

      return true;
    });

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

        <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
  }}
>

  <button onClick={() => setAba("dashboard")}>
  Dashboard
</button>

<button onClick={() => setAba("reviews")}>
  Reviews
</button>

<button onClick={() => setAba("usuarios")}>
  Usuários
</button>

<button onClick={() => setAba("admins")}>
  Administradores
</button>

</div>

        <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  }}
>

  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <h3>Usuários</h3>

    <h1>
      {dashboard.usuarios}
    </h1>
  </div>

  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <h3>Reviews</h3>

    <h1>
      {dashboard.reviews}
    </h1>
  </div>

  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <h3>Excluídas</h3>

    <h1>
      {dashboard.reviewsExcluidas}
    </h1>
  </div>

  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <h3>Denúncias</h3>

    <h1>
      {dashboard.denuncias}
    </h1>
  </div>

  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow:
        "0 2px 8px rgba(0,0,0,0.08)",
    }}
  >
    <h3>Admins</h3>

    <h1>
      {dashboard.admins}
    </h1>
  </div>

</div>

{
  aba === "usuarios" && (
    <h2>
      Gerenciamento de Usuários
    </h2>
  )
}

{
  aba === "admins" && (
    <h2>
      Gerenciamento de Administradores
    </h2>
  )
}

        {/* CRIAR ADM */}

{
  aba === "admins" && (

    <>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >

        <h2>
          Administradores
        </h2>

        <button
          onClick={() =>
            setMostrarModalAdmin(true)
          }
          style={{
            background: "#4da6ff",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Novo Administrador
        </button>

      </div>


{
  mostrarModalAdmin && (

    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >

      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          width: "450px",
          boxShadow:
            "0 10px 35px rgba(0,0,0,.25)",
        }}
      >

        <h2
          style={{
            marginTop: 0,
          }}
        >
          Novo Administrador
        </h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
          }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >

          <button
            onClick={() =>
              setMostrarModalAdmin(false)
            }
          >
            Cancelar
          </button>

          <button
            onClick={async () => {

              await criarAdmin();

              setMostrarModalAdmin(false);

            }}
            style={{
              background: "#4da6ff",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "8px",
            }}
          >
            Criar
          </button>

        </div>

      </div>

    </div>

  )
}
    </>

  )
}

{
  aba === "reviews" && (
    <>
      <input
        type="text"
        placeholder="🔍 Buscar por título ou autor..."
        value={busca}
        onChange={(e) =>
          setBusca(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          border: "1px solid #dcdcdc",
          marginBottom: "20px",
          fontSize: "16px",
          boxSizing: "border-box",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() =>
            setFiltro(
              "todas"
            )
          }
        >
          Todas
        </button>

        <button
          onClick={() =>
            setFiltro(
              "ativas"
            )
          }
        >
          Ativas
        </button>

        <button
          onClick={() =>
            setFiltro(
              "excluidas"
            )
          }
        >
          Excluídas
        </button>

        <button
          onClick={() =>
            setFiltro(
              "denunciadas"
            )
          }
        >
          Denunciadas
        </button>
      </div>
    </>
  )
}



{/* REVIEWS */}
{
  aba === "reviews" && (

    denunciasFiltradas.length === 0 ? (

      <p>
        Nenhuma review encontrada.
      </p>

    ) : (

      denunciasFiltradas.map(
        (item) => (
          <div
            key={item.id_review}
            style={{
              background: "#fff",
              borderRadius: "14px",
              padding: "20px",
              marginBottom: "20px",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
            }}
          >

            {item.imagem && (
              <img
                src={item.imagem}
                alt={item.titulo}
                style={{
                  width: "180px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  flexShrink: 0,
                }}
              />
            )}

            <div
              style={{
                flex: 1,
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                }}
              >
                {item.titulo}
              </h2>

              <p>
                <strong>Autor:</strong>{" "}
                {item.autor}
              </p>

              <p>
                <strong>Nota:</strong>{" "}
                ⭐ {item.nota}/5
              </p>

              <p
                style={{
                  fontWeight: "bold",
                  color:
                    item.ativo
                      ? "#27ae60"
                      : "#e74c3c",
                }}
              >
                {
                  item.ativo
                    ? "ATIVA"
                    : "EXCLUÍDA"
                }
              </p>

              <p>
                <strong>Denúncias:</strong>{" "}
                🚨 {item.denuncias}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "15px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() =>
                    navigate(
                      `/admin/review/${item.id_review}`
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
                    background: "#c0392b",
                    color: "white",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
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
                    background: "#27ae60",
                    color: "white",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Limpar Denúncias
                </button>

              </div>

            </div>

          </div>
        )
      )

    )

  )
}
      </div>
    </>
  );
}

export default AdminPanel;