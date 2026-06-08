import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] =
    useState(true);

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [isError, setIsError] =
    useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    setIsError(false);

    try {
      if (isLogin) {
        const response =
          await axios.post(
            "http://localhost:3000/auth/login",
            {
              email,
              senha: password,
            }
          );

        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "usuario",
          JSON.stringify(
            response.data.usuario
          )
        );

        // =========================
        // REDIRECIONAMENTO ADM
        // =========================

        if (
          response.data.usuario
            .tipo === "admin"
        ) {
          navigate("/admin");
        } else {
          navigate("/home");
        }

      } else {
        await axios.post(
          "http://localhost:3000/auth/register",
          {
            nome,
            email,
            senha: password,
          }
        );

        setMessage(
          "Conta criada com sucesso!"
        );

        setIsError(false);

        setIsLogin(true);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Erro ao autenticar"
      );

      setIsError(true);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Echo</h1>

        <h2>
          {isLogin
            ? "Entrar na sua conta"
            : "Criar nova conta"}
        </h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
            />
          )}

          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          {message && (
            <p
              className={
                isError
                  ? "error-message"
                  : "success-message"
              }
            >
              {message}
            </p>
          )}

          <button type="submit">
            {isLogin
              ? "Entrar"
              : "Cadastrar"}
          </button>
        </form>

        <p
          className="switch-mode"
          onClick={() =>
            setIsLogin(!isLogin)
          }
        >
          {isLogin
            ? "Não possui conta? Cadastre-se"
            : "Já possui conta? Faça login"}
        </p>
      </div>
    </div>
  );
}

export default Login;