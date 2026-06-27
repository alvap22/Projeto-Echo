import { useState } from "react";

import api from "../services/api";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

function ResetPassword() {

  const { token } =
    useParams();

  const navigate =
    useNavigate();

  const [
    novaSenha,
    setNovaSenha,
  ] = useState("");

  const [
    confirmarSenha,
    setConfirmarSenha,
  ] = useState("");

  const [
    mensagem,
    setMensagem,
  ] = useState("");

  async function handleSubmit(
    e
  ) {
    e.preventDefault();

    if (
      novaSenha !==
      confirmarSenha
    ) {
      setMensagem(
        "As senhas não coincidem"
      );
      return;
    }

    try {

      const response =
        await api.post(
          `/auth/reset-password/${token}`,
          {
            novaSenha,
          }
        );

      setMensagem(
        response.data.message
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {

      setMensagem(
        error.response?.data
          ?.message ||
        "Erro ao redefinir senha"
      );
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>
          Redefinir Senha
        </h2>

        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            type="password"
            placeholder="Nova senha"
            value={
              novaSenha
            }
            onChange={(e) =>
              setNovaSenha(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            value={
              confirmarSenha
            }
            onChange={(e) =>
              setConfirmarSenha(
                e.target.value
              )
            }
          />

          {mensagem && (
            <p className={mensagem.includes("coincidem") || mensagem.includes("Erro") ? "error-message" : "success-message"}>
              {mensagem}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "14px" }}
          >
            Alterar Senha
          </button>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;