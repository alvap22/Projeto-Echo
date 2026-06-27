import {
  useEffect,
  useState,
} from "react";

import api from "../services/api";

import Header from "../components/Header";
import UserModal from "../components/UserModal";
import SafeImage from "../components/SafeImage";
import "../styles/adminPanel.css";

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
      const response = await api.get("/admin/usuarios");
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
      const response = await api.put(
        `/admin/usuarios/${id}/toggle`,
        {}
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
      const response = await api.get("/admin/denuncias");
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
      await api.post(
        "/admin/criar-admin",
        {
          nome,
          email,
          senha,
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
      await api.delete(`/admin/denuncias/${id}`);
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
      await api.delete(`/reviews/${id}`);
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

  async function executarRestaurarReview(id) {
    try {
      const response = await api.put(
        `/admin/reviews/${id}/restaurar`,
        {}
      );
      fetchDenuncias();
      fetchDashboard();
      setMensagemFeedback({
        texto: response.data.message || "Review restaurada com sucesso.",
        tipo: "sucesso",
      });
      setTimeout(() => setMensagemFeedback(null), 4000);
    } catch (error) {
      console.log(error);
      setMensagemFeedback({
        texto: error.response?.data?.message || "Erro ao restaurar review.",
        tipo: "erro",
      });
      setTimeout(() => setMensagemFeedback(null), 4000);
    }
  }

  function restaurarReview(id) {
    setConfirmacaoDialog({
      mensagem: "Deseja restaurar esta review? Ela voltará a ser visível publicamente.",
      corBotao: "#10b981",
      textoBotao: "Restaurar Review",
      acao: () => executarRestaurarReview(id),
    });
  }

  if (carregando) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <span style={{ fontSize: "16px", fontWeight: "bold", color: "var(--text-secondary)" }}>
          Carregando Painel Administrativo...
        </span>
      </div>
    );
  }

  async function fetchDashboard() {
    try {
      const [usersRes, reviewsRes] = await Promise.all([
        api.get("/admin/usuarios"),
        api.get("/admin/denuncias"),
      ]);

      const users = usersRes.data;
      const reviews = reviewsRes.data;

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

      <div className="admin-panel-container">
        <h1>
          Painel ADM
        </h1>

        {mensagemFeedback && (
          <div className={`alert-feedback ${mensagemFeedback.tipo === "erro" ? "alert-error" : "alert-success"}`}>
            <span>{mensagemFeedback.texto}</span>
            <button
              onClick={() => setMensagemFeedback(null)}
              className="btn-ghost"
              style={{ padding: "0 5px", fontSize: "18px", color: "inherit" }}
            >
              &times;
            </button>
          </div>
        )}

        <div className="tabs-container">
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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
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

        {aba === "usuarios" && (
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
              className="form-input"
              style={{ marginBottom: "20px", fontSize: "16px" }}
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
                className={`tab-button ${filtroUsuarios === "todos" ? "tab-button-active" : ""}`}
              >
                Todos
              </button>

              <button
                onClick={() => setFiltroUsuarios("usuarios")}
                className={`tab-button ${filtroUsuarios === "usuarios" ? "tab-button-active" : ""}`}
              >
                Usuários
              </button>

              <button
                onClick={() => setFiltroUsuarios("admins")}
                className={`tab-button ${filtroUsuarios === "admins" ? "tab-button-active" : ""}`}
              >
                Administradores
              </button>

              <button
                onClick={() => setFiltroUsuarios("ativos")}
                className={`tab-button ${filtroUsuarios === "ativos" ? "tab-button-active" : ""}`}
              >
                Ativos
              </button>

              <button
                onClick={() => setFiltroUsuarios("inativos")}
                className={`tab-button ${filtroUsuarios === "inativos" ? "tab-button-active" : ""}`}
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

                return filtered.map((user) => {
                  const isUserAdmin = user.tipo === "admin" || user.tipo === "ADMIN";
                  return (
                    <div
                      key={user.id_usuario}
                      className="user-card"
                    >
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: "50%",
                          background: isUserAdmin ? "rgba(59, 130, 246, 0.15)" : "rgba(100, 116, 139, 0.15)",
                          color: isUserAdmin ? "#60a5fa" : "#94a3b8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "20px",
                          fontWeight: "bold",
                          flexShrink: 0,
                          border: "2px solid",
                          borderColor: isUserAdmin ? "rgba(59, 130, 246, 0.3)" : "rgba(100, 116, 139, 0.3)",
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
                        <h3 style={{ margin: 0, marginBottom: "5px", color: "var(--text-primary)", fontSize: "18px" }}>
                          {user.nome}
                        </h3>
                        <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px", marginBottom: "5px" }}>
                          <strong>E-mail:</strong> {user.email}
                        </p>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", marginTop: "8px" }}>
                          <span className={`badge ${isUserAdmin ? "badge-admin" : "badge-user"}`}>
                            {user.tipo?.toUpperCase()}
                          </span>
                          <span className={`badge ${user.ativo ? "badge-active" : "badge-inactive"}`}>
                            {user.ativo ? "ATIVO" : "INATIVO"}
                          </span>
                          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                            Criado em: {formatarData(user.data_criacao)}
                          </span>
                        </div>
                      </div>

                      <div className="user-card-buttons">
                        <button
                          onClick={() => setUsuarioSelecionado(user)}
                          className="btn-primary"
                          style={{ padding: "8px 14px", fontSize: "13px" }}
                        >
                          Visualizar
                        </button>
                        <button
                          onClick={() => {
                            const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
                            if (usuarioLogado && Number(user.id_usuario) === Number(usuarioLogado.id)) {
                              setMensagemFeedback({
                                texto: "Você não pode suspender a conta que está utilizando no momento.",
                                tipo: "erro",
                              });
                              setTimeout(() => setMensagemFeedback(null), 4000);
                              return;
                            }
                            setConfirmacaoDialog({
                              mensagem: `Tem certeza que deseja ${user.ativo ? "desativar" : "ativar"} o usuário ${user.nome}?`,
                              corBotao: user.ativo ? "#b91c1c" : "#10b981",
                              textoBotao: user.ativo ? "Desativar" : "Ativar",
                              acao: () => toggleStatusUsuario(user.id_usuario),
                            });
                          }}
                          className={user.ativo ? "btn-danger" : "btn-primary"}
                          style={{ padding: "8px 14px", fontSize: "13px", marginTop: "4px" }}
                        >
                          {user.ativo ? "Desativar" : "Ativar"}
                        </button>
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </>
        )}

        {aba === "admins" && (
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
                className="btn-primary"
              >
                + Novo Administrador
              </button>
            </div>

            {mostrarModalAdmin && (
              <div className="admin-modal-overlay">
                <div className="admin-modal-content">
                  <h2>
                    Novo Administrador
                  </h2>

                  {modalError && (
                    <div
                      style={{
                        color: "#f87171",
                        background: "rgba(239, 68, 68, 0.1)",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginBottom: "15px",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
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
                      className="btn-secondary"
                      style={{ padding: "8px 16px", fontSize: "14px" }}
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={criarAdmin}
                      className="btn-primary"
                      style={{ padding: "8px 16px", fontSize: "14px", borderRadius: "12px" }}
                    >
                      Criar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {aba === "reviews" && (
          <>
            <input
              type="text"
              placeholder="🔍 Buscar por título ou autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="form-input"
              style={{ marginBottom: "20px", fontSize: "16px" }}
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
                className={`tab-button ${filtro === "todas" ? "tab-button-active" : ""}`}
              >
                Todas
              </button>

              <button
                onClick={() => setFiltro("ativas")}
                className={`tab-button ${filtro === "ativas" ? "tab-button-active" : ""}`}
              >
                Ativas
              </button>

              <button
                onClick={() => setFiltro("excluidas")}
                className={`tab-button ${filtro === "excluidas" ? "tab-button-active" : ""}`}
              >
                Excluídas
              </button>

              <button
                onClick={() => setFiltro("denunciadas")}
                className={`tab-button ${filtro === "denunciadas" ? "tab-button-active" : ""}`}
              >
                Denunciadas
              </button>
            </div>
          </>
        )}

        {aba === "reviews" && (
          denunciasFiltradas.length === 0 ? (
            <p>
              Nenhuma review encontrada.
            </p>
          ) : (
            denunciasFiltradas.map((item) => (
              <div
                key={item.id_review}
                className={`admin-card${!item.ativo ? " admin-card-inactive" : ""}`}
              >
                {item.imagem && (
                  <SafeImage
                    src={item.imagem}
                    alt={item.titulo}
                  />
                )}

                <div style={{ flex: 1 }}>
                  <h2 style={{ marginTop: 0, marginBottom: "10px", color: "var(--text-primary)" }}>
                    {item.titulo}
                  </h2>

                  <p style={{ margin: "0 0 5px 0", color: "var(--text-secondary)" }}>
                    <strong>Autor:</strong> {item.autor}
                  </p>

                  <p style={{ margin: "0 0 5px 0", color: "var(--text-secondary)" }}>
                    <strong>Nota:</strong> ⭐ {item.nota}/5
                  </p>

                  <div style={{ margin: "0 0 8px 0" }}>
                    <span className={`badge ${item.ativo ? "badge-active" : "badge-inactive"}`}>
                      {item.ativo ? "ATIVA" : "INATIVA"}
                    </span>
                  </div>

                  <p style={{ margin: "0 0 15px 0", color: "var(--text-secondary)" }}>
                    <strong>Denúncias:</strong> 🚨 {item.denuncias}
                  </p>

                  <div className="admin-card-buttons">
                    <button
                      onClick={() => navigate(`/admin/review/${item.id_review}`)}
                      className="btn-secondary"
                      style={{ padding: "8px 14px", fontSize: "13px" }}
                    >
                      Ver Review
                    </button>

                    {item.ativo && (
                      <button
                        onClick={() => excluirReview(item.id_review)}
                        className="btn-danger"
                        style={{ padding: "8px 14px", fontSize: "13px" }}
                      >
                        Excluir Review
                      </button>
                    )}

                    {!item.ativo && (
                      <button
                        onClick={() => restaurarReview(item.id_review)}
                        className="btn-restore"
                        style={{ padding: "8px 14px", fontSize: "13px" }}
                      >
                        {/* Ícone de restaurar */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                          <path d="M3 3v5h5"/>
                        </svg>
                        Restaurar
                      </button>
                    )}

                    <button
                      onClick={() => limparDenuncias(item.id_review)}
                      className="btn-primary"
                      style={{ padding: "8px 14px", fontSize: "13px" }}
                    >
                      Limpar Denúncias
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
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
          <div className="admin-modal-overlay">
            <div className="admin-modal-content" style={{ textAlign: "center" }}>
              <h3 style={{ marginTop: 0, marginBottom: "15px", color: "var(--text-primary)", fontSize: "20px" }}>
                Confirmar Ação
              </h3>
              <p style={{ marginBottom: "25px", color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "15px" }}>
                {confirmacaoDialog.mensagem}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                <button
                  onClick={() => setConfirmacaoDialog(null)}
                  className="btn-secondary"
                  style={{ padding: "8px 16px", fontSize: "14px" }}
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
                    padding: "8px 16px",
                    borderRadius: "var(--radius-lg)",
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