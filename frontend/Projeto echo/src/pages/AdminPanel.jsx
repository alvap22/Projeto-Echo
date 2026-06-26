import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Header from "../components/Header";
import UserModal from "../components/UserModal";

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

  const [usuarios, setUsuarios] = useState([]);
  const [buscaUsuarios, setBuscaUsuarios] = useState("");
  const [filtroUsuarios, setFiltroUsuarios] = useState("todos");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [confirmacaoDialog, setConfirmacaoDialog] = useState(null);
  const [modalError, setModalError] = useState("");
  const [mensagemFeedback, setMensagemFeedback] = useState(null);

  useEffect(() => {

  fetchDenuncias();

  fetchDashboard();

  fetchUsuarios();

}, []);

  function formatarData(data) {
    if (!data) return "Não informada";
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  async function fetchUsuarios() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/admin/usuarios",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsuarios(response.data);
    } catch (error) {
      console.log(error);
      setMensagemFeedback({
        texto: error.response?.data?.message || "Erro ao carregar usuários.",
        tipo: "erro",
      });
    }
  }

  async function toggleStatusUsuario(id) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/admin/usuarios/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsuarios();
      fetchDashboard();

      setMensagemFeedback({
        texto: response.data.message || "Status do usuário atualizado com sucesso!",
        tipo: "sucesso",
      });

      setTimeout(() => {
        setMensagemFeedback((prev) =>
          prev?.texto === response.data.message ? null : prev
        );
      }, 4000);
    } catch (error) {
      console.log(error);
      setMensagemFeedback({
        texto: error.response?.data?.message || "Erro ao alterar status do usuário.",
        tipo: "erro",
      });
      setTimeout(() => {
        setMensagemFeedback(null);
      }, 4000);
    }
  }

  async function fetchDenuncias() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3000/admin/denuncias",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDenuncias(response.data);
    } catch (error) {
      console.log(error);
      navigate("/");
    } finally {
      setCarregando(false);
    }
  }

   async function criarAdmin() {
    setModalError("");

    if (!nome.trim()) {
      setModalError("Informe o nome.");
      return;
    }

    if (!email.trim()) {
      setModalError("Informe o e-mail.");
      return;
    }

    if (!senha.trim()) {
      setModalError("Informe a senha.");
      return;
    }

    if (senha.length < 6) {
      setModalError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/admin/criar-admin",
        {
          nome,
          email,
          senha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensagemFeedback({
        texto: "Administrador criado com sucesso!",
        tipo: "sucesso",
      });
      setTimeout(() => setMensagemFeedback(null), 4000);

      setNome("");
      setEmail("");
      setSenha("");
      setMostrarModalAdmin(false);
      fetchDashboard();

    } catch (error) {
      console.log(error);
      setModalError(error.response?.data?.message || "Erro ao criar administrador.");
    }
  }

  async function executarLimparDenuncias(id) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/admin/denuncias/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDenuncias();
      setMensagemFeedback({
        texto: "Denúncias limpas com sucesso!",
        tipo: "sucesso",
      });
      setTimeout(() => setMensagemFeedback(null), 4000);
    } catch (error) {
      console.log(error);
      setMensagemFeedback({
        texto: error.response?.data?.message || "Erro ao limpar denúncias.",
        tipo: "erro",
      });
      setTimeout(() => setMensagemFeedback(null), 4000);
    }
  }

  function limparDenuncias(id) {
    setConfirmacaoDialog({
      mensagem: "Tem certeza que deseja limpar todas as denúncias desta review? Esta ação removerá os registros de denúncia do sistema.",
      corBotao: "#27ae60",
      textoBotao: "Limpar Denúncias",
      acao: () => executarLimparDenuncias(id),
    });
  }

  async function executarExcluirReview(id) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:3000/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchDenuncias();
      setMensagemFeedback({
        texto: "Review excluída com sucesso!",
        tipo: "sucesso",
      });
      setTimeout(() => setMensagemFeedback(null), 4000);
    } catch (error) {
      console.log(error);
      setMensagemFeedback({
        texto: error.response?.data?.message || "Erro ao excluir review.",
        tipo: "erro",
      });
      setTimeout(() => setMensagemFeedback(null), 4000);
    }
  }

  function excluirReview(id) {
    setConfirmacaoDialog({
      mensagem: "Tem certeza que deseja desativar esta review? Ela deixará de ser visível publicamente.",
      corBotao: "#c0392b",
      textoBotao: "Excluir Review",
      acao: () => executarExcluirReview(id),
    });
  }

  if (carregando) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "5px solid #e5e7eb",
            borderTop: "5px solid #111827",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "20px",
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <span style={{ fontSize: "16px", fontWeight: "bold", color: "#4b5563" }}>
          Carregando Painel Administrativo...
        </span>
      </div>
    );
  }

  async function fetchDashboard() {
    try {
      const token = localStorage.getItem("token");
      
      // Busca dados dos usuários e denúncias de forma paralela para calcular as métricas no frontend
      const [usersRes, reviewsRes] = await Promise.all([
        axios.get("http://localhost:3000/admin/usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get("http://localhost:3000/admin/denuncias", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      ]);

      const users = usersRes.data;
      const reviews = reviewsRes.data;

      // Calcula as métricas com base nas regras de negócio existentes
      const totalUsuarios = users.filter(u => u.tipo === "USER" || u.tipo === "user").length;
      const totalAdmins = users.filter(u => u.tipo === "admin" || u.tipo === "ADMIN").length;
      const totalReviews = reviews.filter(r => r.ativo).length;
      const totalExcluidas = reviews.filter(r => !r.ativo).length;
      const totalDenuncias = reviews.reduce((sum, r) => sum + Number(r.denuncias || 0), 0);

      setDashboard({
        usuarios: totalUsuarios,
        reviews: totalReviews,
        reviewsExcluidas: totalExcluidas,
        denuncias: totalDenuncias,
        admins: totalAdmins,
      });

    } catch (error) {
      console.log("Erro ao carregar dados do dashboard:", error);
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

        {mensagemFeedback && (
          <div
            style={{
              padding: "15px 20px",
              background: mensagemFeedback.tipo === "erro" ? "#fee2e2" : "#d1fae5",
              color: mensagemFeedback.tipo === "erro" ? "#991b1b" : "#065f46",
              borderRadius: "10px",
              marginBottom: "20px",
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              border: "1px solid",
              borderColor: mensagemFeedback.tipo === "erro" ? "#fca5a5" : "#6ee7b7",
              boxSizing: "border-box",
            }}
          >
            <span>{mensagemFeedback.texto}</span>
            <button
              onClick={() => setMensagemFeedback(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
                color: "inherit",
                fontWeight: "bold",
                lineHeight: "1",
              }}
            >
              &times;
            </button>
          </div>
        )}

        <style>{`
          .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 35px;
            width: 100%;
          }
          .dashboard-card {
            background: #fff;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid #f3f4f6;
            cursor: default;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
          }
          .dashboard-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            transition: all 0.3s ease;
          }
          .dashboard-card-blue::before { background: #3b82f6; }
          .dashboard-card-purple::before { background: #8b5cf6; }
          .dashboard-card-orange::before { background: #f59e0b; }
          .dashboard-card-red::before { background: #ef4444; }
          .dashboard-card-green::before { background: #10b981; }
          
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 20px rgba(0, 0, 0, 0.08);
            border-color: #e5e7eb;
          }
          .dashboard-info {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .dashboard-label {
            font-size: 13px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .dashboard-value {
            font-size: 32px;
            font-weight: 800;
            color: #111827;
            line-height: 1;
          }
          .dashboard-icon-wrapper {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }
          .dashboard-icon-blue { background: #eff6ff; }
          .dashboard-icon-purple { background: #f5f3ff; }
          .dashboard-icon-orange { background: #fffbeb; }
          .dashboard-icon-red { background: #fef2f2; }
          .dashboard-icon-green { background: #ecfdf5; }

          /* ADMIN AND USER CARDS */
          .admin-card {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            display: flex;
            gap: 24px;
            align-items: flex-start;
            border: 1px solid #f3f4f6;
            transition: all 0.2s ease;
            box-sizing: border-box;
          }
          .admin-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
            border-color: #e5e7eb;
          }
          .admin-card img {
            width: 180px;
            height: 120px;
            object-fit: cover;
            border-radius: 10px;
            flex-shrink: 0;
          }
          .admin-card-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
            flex-wrap: wrap;
          }

          .user-card {
            background: #fff;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            display: flex;
            gap: 24px;
            align-items: center;
            border: 1px solid #f3f4f6;
            transition: all 0.2s ease;
            box-sizing: border-box;
          }
          .user-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
            border-color: #e5e7eb;
          }
          .user-card-buttons {
            display: flex;
            gap: 10px;
            flex-direction: column;
          }

          /* TABS AND INPUTS */
          .tab-button {
            background: #e5e7eb;
            color: #374151;
            border: none;
            padding: 10px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.2s ease;
          }
          .tab-button:hover {
            background: #d1d5db;
            color: #111827;
          }
          .tab-button-active {
            background: #111827 !important;
            color: #fff !important;
          }

          .form-input {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border-radius: 8px;
            border: 1px solid #dcdcdc;
            font-size: 14px;
            box-sizing: border-box;
            outline: none;
            transition: all 0.2s ease;
          }
          .form-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          @media (max-width: 600px) {
            .admin-card {
              flex-direction: column;
              align-items: center;
              text-align: center;
              padding: 20px;
            }
            .admin-card img {
              width: 100% !important;
              height: 180px;
              max-width: 320px;
            }
            .admin-card-buttons {
              justify-content: center;
              width: 100%;
            }

            .user-card {
              flex-direction: column;
              align-items: center;
              text-align: center;
              padding: 20px;
            }
            .user-card-buttons {
              flex-direction: row !important;
              justify-content: center;
              width: 100%;
              margin-top: 15px;
            }
          }
        `}</style>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setAba("dashboard")}
            className={`tab-button ${aba === "dashboard" ? "tab-button-active" : ""}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setAba("reviews")}
            className={`tab-button ${aba === "reviews" ? "tab-button-active" : ""}`}
          >
            Reviews
          </button>
          <button
            onClick={() => setAba("usuarios")}
            className={`tab-button ${aba === "usuarios" ? "tab-button-active" : ""}`}
          >
            Usuários
          </button>
          <button
            onClick={() => setAba("admins")}
            className={`tab-button ${aba === "admins" ? "tab-button-active" : ""}`}
          >
            Administradores
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card dashboard-card-blue">
            <div className="dashboard-info">
              <span className="dashboard-label">Usuários</span>
              <span className="dashboard-value">{dashboard.usuarios}</span>
            </div>
            <div className="dashboard-icon-wrapper dashboard-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
          </div>

          <div className="dashboard-card dashboard-card-purple">
            <div className="dashboard-info">
              <span className="dashboard-label">Reviews</span>
              <span className="dashboard-value">{dashboard.reviews}</span>
            </div>
            <div className="dashboard-icon-wrapper dashboard-icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
          </div>

          <div className="dashboard-card dashboard-card-orange">
            <div className="dashboard-info">
              <span className="dashboard-label">Excluídas</span>
              <span className="dashboard-value">{dashboard.reviewsExcluidas}</span>
            </div>
            <div className="dashboard-icon-wrapper dashboard-icon-orange">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </div>
          </div>

          <div className="dashboard-card dashboard-card-red">
            <div className="dashboard-info">
              <span className="dashboard-label">Denúncias</span>
              <span className="dashboard-value">{dashboard.denuncias}</span>
            </div>
            <div className="dashboard-icon-wrapper dashboard-icon-red">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
          </div>

          <div className="dashboard-card dashboard-card-green">
            <div className="dashboard-info">
              <span className="dashboard-label">Admins</span>
              <span className="dashboard-value">{dashboard.admins}</span>
            </div>
            <div className="dashboard-icon-wrapper dashboard-icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
          </div>
        </div>

{
  aba === "usuarios" && (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h2>Gerenciamento de Usuários</h2>
      </div>

      <input
        type="text"
        placeholder="🔍 Buscar por nome ou e-mail..."
        value={buscaUsuarios}
        onChange={(e) => setBuscaUsuarios(e.target.value)}
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
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setFiltroUsuarios("todos")}
          style={{
            background: filtroUsuarios === "todos" ? "#111827" : "#e5e7eb",
            color: filtroUsuarios === "todos" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Todos
        </button>

        <button
          onClick={() => setFiltroUsuarios("usuarios")}
          style={{
            background: filtroUsuarios === "usuarios" ? "#111827" : "#e5e7eb",
            color: filtroUsuarios === "usuarios" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Usuários
        </button>

        <button
          onClick={() => setFiltroUsuarios("admins")}
          style={{
            background: filtroUsuarios === "admins" ? "#111827" : "#e5e7eb",
            color: filtroUsuarios === "admins" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Administradores
        </button>

        <button
          onClick={() => setFiltroUsuarios("ativos")}
          style={{
            background: filtroUsuarios === "ativos" ? "#111827" : "#e5e7eb",
            color: filtroUsuarios === "ativos" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Ativos
        </button>

        <button
          onClick={() => setFiltroUsuarios("inativos")}
          style={{
            background: filtroUsuarios === "inativos" ? "#111827" : "#e5e7eb",
            color: filtroUsuarios === "inativos" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Inativos
        </button>
      </div>

      {usuarios.length === 0 ? (
        <p>Carregando usuários...</p>
      ) : (
        (() => {
          const filtered = usuarios.filter((user) => {
            const texto = buscaUsuarios.toLowerCase();
            const passouBusca =
              user.nome?.toLowerCase().includes(texto) ||
              user.email?.toLowerCase().includes(texto);

            if (!passouBusca) return false;

            if (filtroUsuarios === "usuarios") {
              return user.tipo === "USER" || user.tipo === "user";
            }
            if (filtroUsuarios === "admins") {
              return user.tipo === "admin" || user.tipo === "ADMIN";
            }
            if (filtroUsuarios === "ativos") {
              return user.ativo === true;
            }
            if (filtroUsuarios === "inativos") {
              return user.ativo === false;
            }

            return true;
          });

          if (filtered.length === 0) {
            return <p>Nenhum usuário encontrado para a busca ou filtro selecionado.</p>;
          }

          return filtered.map((user) => (
            <div
              key={user.id_usuario}
              className="user-card"
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: user.tipo === "admin" || user.tipo === "ADMIN" ? "#ebf5ff" : "#f3f4f6",
                  color: user.tipo === "admin" || user.tipo === "ADMIN" ? "#1e40af" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "bold",
                  flexShrink: 0,
                  border: "2px solid",
                  borderColor: user.tipo === "admin" || user.tipo === "ADMIN" ? "#3b82f6" : "#d1d5db",
                }}
              >
                {user.nome
                  ? user.nome
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                  : "U"}
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, marginBottom: "5px", color: "#111827", fontSize: "18px" }}>
                  {user.nome}
                </h3>
                <p style={{ margin: 0, color: "#4b5563", fontSize: "14px", marginBottom: "5px" }}>
                  <strong>E-mail:</strong> {user.email}
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" }}>
                  <span
                    style={{
                      background: user.tipo === "admin" || user.tipo === "ADMIN" ? "#ebf5ff" : "#f1f5f9",
                      color: user.tipo === "admin" || user.tipo === "ADMIN" ? "#1e40af" : "#475569",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.tipo?.toUpperCase()}
                  </span>
                  <span
                    style={{
                      background: user.ativo ? "#d1fae5" : "#fee2e2",
                      color: user.ativo ? "#065f46" : "#991b1b",
                      padding: "3px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    {user.ativo ? "ATIVO" : "INATIVO"}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    Criado em: {formatarData(user.data_criacao)}
                  </span>
                </div>
              </div>

              <div className="user-card-buttons">
                <button
                  onClick={() => setUsuarioSelecionado(user)}
                  style={{
                    background: "#111827",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px",
                    transition: "0.2s",
                  }}
                >
                  Visualizar
                </button>
                <button
                  onClick={() => {
                    setConfirmacaoDialog({
                      mensagem: `Tem certeza que deseja ${user.ativo ? "desativar" : "ativar"} o usuário ${user.nome}?`,
                      corBotao: user.ativo ? "#c0392b" : "#27ae60",
                      textoBotao: user.ativo ? "Desativar" : "Ativar",
                      acao: () => toggleStatusUsuario(user.id_usuario),
                    });
                  }}
                  style={{
                    background: user.ativo ? "#c0392b" : "#27ae60",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px",
                    transition: "0.2s",
                  }}
                >
                  {user.ativo ? "Desativar" : "Ativar"}
                </button>
              </div>
            </div>
          ));
        })()
      )}
    </>
  )
}

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
        <h2>Administradores</h2>

        <button
          onClick={() => {
            setModalError("");
            setMostrarModalAdmin(true);
          }}
          style={{
            background: "#111827",
            color: "white",
            border: "none",
            padding: "12px 18px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "0.2s",
          }}
        >
          + Novo Administrador
        </button>
      </div>

      {mostrarModalAdmin && (
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
              boxShadow: "0 10px 35px rgba(0,0,0,.25)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "20px" }}>
              Novo Administrador
            </h2>

            {modalError && (
              <div
                style={{
                  color: "#991b1b",
                  background: "#fee2e2",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  marginBottom: "15px",
                  border: "1px solid #fca5a5",
                }}
              >
                {modalError}
              </div>
            )}

            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="form-input"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />

            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="form-input"
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setMostrarModalAdmin(false)}
                style={{
                  background: "#e5e7eb",
                  color: "#374151",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Cancelar
              </button>

              <button
                onClick={criarAdmin}
                style={{
                  background: "#111827",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
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
        onChange={(e) => setBusca(e.target.value)}
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
          onClick={() => setFiltro("todas")}
          style={{
            background: filtro === "todas" ? "#111827" : "#e5e7eb",
            color: filtro === "todas" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Todas
        </button>

        <button
          onClick={() => setFiltro("ativas")}
          style={{
            background: filtro === "ativas" ? "#111827" : "#e5e7eb",
            color: filtro === "ativas" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Ativas
        </button>

        <button
          onClick={() => setFiltro("excluidas")}
          style={{
            background: filtro === "excluidas" ? "#111827" : "#e5e7eb",
            color: filtro === "excluidas" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Excluídas
        </button>

        <button
          onClick={() => setFiltro("denunciadas")}
          style={{
            background: filtro === "denunciadas" ? "#111827" : "#e5e7eb",
            color: filtro === "denunciadas" ? "white" : "#374151",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
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
            className="admin-card"
          >

            {item.imagem && (
              <img
                src={item.imagem}
                alt={item.titulo}
              />
            )}

            <div style={{ flex: 1 }}>
              <h2 style={{ marginTop: 0, marginBottom: "10px", color: "#111827" }}>
                {item.titulo}
              </h2>

              <p style={{ margin: "0 0 5px 0", color: "#4b5563" }}>
                <strong>Autor:</strong> {item.autor}
              </p>

              <p style={{ margin: "0 0 5px 0", color: "#4b5563" }}>
                <strong>Nota:</strong> ⭐ {item.nota}/5
              </p>

              <p
                style={{
                  margin: "0 0 5px 0",
                  fontWeight: "bold",
                  color: item.ativo ? "#27ae60" : "#e74c3c",
                }}
              >
                {item.ativo ? "ATIVA" : "EXCLUÍDA"}
              </p>

              <p style={{ margin: "0 0 5px 0", color: "#4b5563" }}>
                <strong>Denúncias:</strong> 🚨 {item.denuncias}
              </p>

              <div className="admin-card-buttons">
                <button
                  onClick={() => navigate(`/admin/review/${item.id_review}`)}
                  style={{
                    background: "#111827",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px",
                    transition: "0.2s",
                  }}
                >
                  Ver Review
                </button>

                <button
                  onClick={() => excluirReview(item.id_review)}
                  style={{
                    background: "#c0392b",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px",
                    transition: "0.2s",
                  }}
                >
                  Excluir Review
                </button>

                <button
                  onClick={() => limparDenuncias(item.id_review)}
                  style={{
                    background: "#27ae60",
                    color: "white",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "13px",
                    transition: "0.2s",
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
        {/* USER DETAIL MODAL */}
        {usuarioSelecionado && (
          <UserModal
            usuario={usuarioSelecionado}
            onClose={() => setUsuarioSelecionado(null)}
          />
        )}

        {/* USER DETAIL MODAL */}
        {usuarioSelecionado && (
          <UserModal
            usuario={usuarioSelecionado}
            onClose={() => setUsuarioSelecionado(null)}
          />
        )}

        {/* CONFIRMATION DIALOG (UNIFIED) */}
        {confirmacaoDialog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.55)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1100,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "30px",
                borderRadius: "16px",
                width: "420px",
                boxShadow: "0 10px 35px rgba(0, 0, 0, 0.25)",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "15px", color: "#1e1e1e", fontSize: "20px" }}>
                Confirmar Ação
              </h3>
              <p style={{ marginBottom: "25px", color: "#4b5563", lineHeight: "1.6", fontSize: "15px" }}>
                {confirmacaoDialog.mensagem}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <button
                  onClick={() => setConfirmacaoDialog(null)}
                  style={{
                    background: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    transition: "0.2s",
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const acao = confirmacaoDialog.acao;
                    setConfirmacaoDialog(null);
                    acao();
                  }}
                  style={{
                    background: confirmacaoDialog.corBotao,
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px",
                    transition: "0.2s",
                  }}
                >
                  {confirmacaoDialog.textoBotao}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminPanel;