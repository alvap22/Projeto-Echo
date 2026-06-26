import React from "react";

function UserModal({ usuario, onClose }) {
  if (!usuario) return null;

  function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          width: "480px",
          boxShadow: "0 10px 35px rgba(0, 0, 0, 0.25)",
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
            color: "#666",
            lineHeight: "1",
          }}
        >
          &times;
        </button>

        <h2 style={{ marginTop: 0, marginBottom: "24px", color: "#1e1e1e" }}>
          Detalhes do Usuário
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
          <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "#777", textTransform: "uppercase", fontWeight: "bold" }}>ID do Usuário</span>
            <div style={{ fontSize: "16px", fontWeight: "500", marginTop: "4px", color: "#333" }}>{usuario.id_usuario}</div>
          </div>

          <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "#777", textTransform: "uppercase", fontWeight: "bold" }}>Nome</span>
            <div style={{ fontSize: "16px", fontWeight: "500", marginTop: "4px", color: "#333" }}>{usuario.nome}</div>
          </div>

          <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "#777", textTransform: "uppercase", fontWeight: "bold" }}>E-mail</span>
            <div style={{ fontSize: "16px", fontWeight: "500", marginTop: "4px", color: "#333" }}>{usuario.email}</div>
          </div>

          <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "#777", textTransform: "uppercase", fontWeight: "bold" }}>Tipo de Usuário</span>
            <div style={{ marginTop: "4px" }}>
              <span
                style={{
                  background: usuario.tipo === "admin" || usuario.tipo === "ADMIN" ? "#ebf5ff" : "#f3f4f6",
                  color: usuario.tipo === "admin" || usuario.tipo === "ADMIN" ? "#1e40af" : "#374151",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                {usuario.tipo?.toUpperCase()}
              </span>
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "#777", textTransform: "uppercase", fontWeight: "bold" }}>Status da Conta</span>
            <div style={{ marginTop: "4px" }}>
              <span
                style={{
                  background: usuario.ativo ? "#d1fae5" : "#fee2e2",
                  color: usuario.ativo ? "#065f46" : "#991b1b",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "inline-block",
                }}
              >
                {usuario.ativo ? "ATIVO" : "INATIVO"}
              </span>
            </div>
          </div>

          <div style={{ paddingBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "#777", textTransform: "uppercase", fontWeight: "bold" }}>Data de Criação</span>
            <div style={{ fontSize: "16px", fontWeight: "500", marginTop: "4px", color: "#333" }}>
              {usuario.data_criacao ? formatarData(usuario.data_criacao) : "Não informada"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              background: "#111827",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserModal;
