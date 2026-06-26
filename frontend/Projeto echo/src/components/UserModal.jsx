import React from "react";

function UserModal({ usuario, onClose }) {
  if (!usuario) return null;

  function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  const isDarkAdmin = usuario.tipo === "admin" || usuario.tipo === "ADMIN";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2, 6, 23, 0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-slate)",
          padding: "30px",
          borderRadius: "var(--radius-2xl)",
          width: "480px",
          maxWidth: "90%",
          boxShadow: "var(--shadow-xl)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "var(--text-secondary)",
            lineHeight: "1",
            transition: "color 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.color = "var(--text-primary)")}
          onMouseOut={(e) => (e.target.style.color = "var(--text-secondary)")}
        >
          &times;
        </button>

        <h2 style={{ marginTop: 0, marginBottom: "24px", color: "var(--text-primary)", fontSize: "22px", fontWeight: "700" }}>
          Detalhes do Usuário
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          <div style={{ borderBottom: "1px solid var(--border-slate)", paddingBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>ID do Usuário</span>
            <div style={{ fontSize: "15px", fontWeight: "500", marginTop: "4px", color: "var(--text-primary)", fontFamily: "monospace" }}>{usuario.id_usuario}</div>
          </div>

          <div style={{ borderBottom: "1px solid var(--border-slate)", paddingBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Nome</span>
            <div style={{ fontSize: "15px", fontWeight: "500", marginTop: "4px", color: "var(--text-primary)" }}>{usuario.nome}</div>
          </div>

          <div style={{ borderBottom: "1px solid var(--border-slate)", paddingBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>E-mail</span>
            <div style={{ fontSize: "15px", fontWeight: "500", marginTop: "4px", color: "var(--text-primary)" }}>{usuario.email}</div>
          </div>

          <div style={{ borderBottom: "1px solid var(--border-slate)", paddingBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Tipo de Usuário</span>
            <div style={{ marginTop: "6px" }}>
              <span className={`badge ${isDarkAdmin ? "badge-admin" : "badge-user"}`}>
                {usuario.tipo?.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ borderBottom: "1px solid var(--border-slate)", paddingBottom: "10px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Status da Conta</span>
            <div style={{ marginTop: "6px" }}>
              <span className={`badge ${usuario.ativo ? "badge-active" : "badge-inactive"}`}>
                {usuario.ativo ? "ATIVO" : "INATIVO"}
              </span>
            </div>
          </div>

          <div style={{ paddingBottom: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: "600", letterSpacing: "0.05em" }}>Data de Criação</span>
            <div style={{ fontSize: "15px", fontWeight: "500", marginTop: "4px", color: "var(--text-primary)" }}>
              {usuario.data_criacao ? formatarData(usuario.data_criacao) : "Não informada"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: "8px 16px", fontSize: "14px" }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
