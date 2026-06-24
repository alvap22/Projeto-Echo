import { useState } from "react";

import { useParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";

import axios from "axios";

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

  const [
    erro,
    setErro,
  ] = useState(false);

  async function handleSubmit(
    e
  ) {

    e.preventDefault();

    setMensagem("");

    if (
      novaSenha !==
      confirmarSenha
    ) {

      setErro(true);

      setMensagem(
        "As senhas não coincidem"
      );

      return;
    }

    try {

      const response =
        await axios.post(
          `http://localhost:3000/auth/reset-password/${token}`,
          {
            novaSenha,
          }
        );

      setErro(false);

      setMensagem(
        response.data.message
      );

      setTimeout(() => {

        navigate("/login");

      }, 2000);

    } catch (error) {

      setErro(true);

      setMensagem(
        error.response?.data
          ?.message ||
          "Erro ao redefinir senha"
      );
    }
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
      }}
    >

      <div
        style={{
          width: "400px",
          padding: "30px",
          border:
            "1px solid #ccc",
          borderRadius:
            "10px",
        }}
      >

        <h1>
          Redefinir Senha
        </h1>

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
            style={{
              width: "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
            }}
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
            style={{
              width: "100%",
              padding:
                "10px",
              marginBottom:
                "10px",
            }}
          />

          {mensagem && (

            <p
              style={{
                color: erro
                  ? "red"
                  : "green",
              }}
            >
              {mensagem}
            </p>

          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding:
                "10px",
            }}
          >
            Alterar Senha
          </button>

        </form>

      </div>

    </div>
  );
}

export default ResetPassword;