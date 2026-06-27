import { useState } from "react";

import api from "../services/api";

import { useNavigate } from "react-router-dom";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  // Field-level validation errors
  const [erros, setErros] = useState({});
  // Track which fields have been touched
  const [touched, setTouched] = useState({});

  // ===========================
  // REAL-TIME VALIDATION
  // ===========================

  function validarCampo(campo, valor) {
    const novosErros = { ...erros };

    if (campo === "nome") {
      if (!isLogin && valor.trim().length === 0) {
        novosErros.nome = "O nome é obrigatório.";
      } else {
        delete novosErros.nome;
      }
    }

    if (campo === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (valor.trim().length === 0) {
        novosErros.email = "O e-mail é obrigatório.";
      } else if (!emailRegex.test(valor)) {
        novosErros.email = "Digite um e-mail válido.";
      } else {
        delete novosErros.email;
      }
    }

    if (campo === "password") {
      if (valor.length === 0) {
        novosErros.password = "A senha é obrigatória.";
      } else if (!isLogin && valor.length < 6) {
        novosErros.password = "A senha deve conter no mínimo 6 caracteres.";
      } else {
        delete novosErros.password;
      }
    }

    setErros(novosErros);
  }

  function handleNomeChange(e) {
    const val = e.target.value;
    setNome(val);
    if (touched.nome) validarCampo("nome", val);
  }

  function handleEmailChange(e) {
    const val = e.target.value;
    setEmail(val);
    if (touched.email) validarCampo("email", val);
  }

  function handlePasswordChange(e) {
    const val = e.target.value;
    setPassword(val);
    if (touched.password) validarCampo("password", val);
  }

  function handleBlur(campo, valor) {
    setTouched((prev) => ({ ...prev, [campo]: true }));
    validarCampo(campo, valor);
  }

  // ===========================
  // SUBMIT
  // ===========================

  async function handleSubmit(e) {
    e.preventDefault();

    // Mark all relevant fields as touched on submit
    const newTouched = { email: true, password: true };
    if (!isLogin) newTouched.nome = true;
    setTouched(newTouched);

    // Run validation on all fields
    const novosErros = {};

    if (!isLogin && nome.trim().length === 0) {
      novosErros.nome = "O nome é obrigatório.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim().length === 0) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!emailRegex.test(email)) {
      novosErros.email = "Digite um e-mail válido.";
    }

    if (password.length === 0) {
      novosErros.password = "A senha é obrigatória.";
    } else if (!isLogin && password.length < 6) {
      novosErros.password = "A senha deve conter no mínimo 6 caracteres.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setMessage("");
    setIsError(false);

    try {
      if (isLogin) {
        const response = await api.post(
          "/auth/login",
          { email, senha: password }
        );

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

        if (response.data.usuario.tipo === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        await api.post("/auth/register", {
          nome,
          email,
          senha: password,
        });

        setMessage("Conta criada com sucesso! Faça login para continuar.");
        setIsError(false);
        setIsLogin(true);
        setNome("");
        setEmail("");
        setPassword("");
        setErros({});
        setTouched({});
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Ocorreu um erro. Tente novamente."
      );
      setIsError(true);
    }
  }

  // ===========================
  // RECUPERAÇÃO DE SENHA
  // ===========================

  async function handleForgotPassword() {
    try {
      const response = await api.post(
        "/auth/forgot-password",
        { email: emailRecuperacao }
      );

      setMessage(response.data.message);
      setIsError(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Erro ao recuperar senha"
      );
      setIsError(true);
    }
  }

  function handleSwitchMode() {
    setIsLogin(!isLogin);
    setErros({});
    setTouched({});
    setMessage("");
    setIsError(false);
  }

  const [showPassword, setShowPassword] = useState(false);

  const isRegisterPasswordInvalid = !isLogin && touched.password && password.length > 0 && password.length < 6;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Echo</h1>
          <h2>
            {isLogin ? "Entrar na sua conta" : "Criar nova conta"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* NOME (cadastro) */}
          {!isLogin && (
            <div className="form-field">
              <label htmlFor="nome" className="field-label">Nome</label>
              <input
                id="nome"
                type="text"
                placeholder="Como você quer ser chamado?"
                value={nome}
                onChange={handleNomeChange}
                onBlur={() => handleBlur("nome", nome)}
                className={erros.nome ? "input-error" : ""}
                autoComplete="name"
              />
              {erros.nome && (
                <span className="field-error">{erros.nome}</span>
              )}
            </div>
          )}

          {/* E-MAIL */}
          <div className="form-field">
            <label htmlFor="email" className="field-label">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={() => handleBlur("email", email)}
              className={erros.email ? "input-error" : ""}
              autoComplete="email"
            />
            {erros.email && (
              <span className="field-error">{erros.email}</span>
            )}
          </div>

          {/* SENHA */}
          <div className="form-field">
            <label htmlFor="password" className="field-label">Senha</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isLogin ? "Digite sua senha" : "Mínimo 6 caracteres"}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur("password", password)}
                className={erros.password ? "input-error" : ""}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  // Eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  // Eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Hint discreto no cadastro */}
            {!isLogin && !erros.password && (
              <span className="field-hint">A senha deve conter no mínimo 6 caracteres.</span>
            )}

            {/* Indicador de força */}
            {!isLogin && password.length > 0 && (
              <div className="password-strength">
                <div
                  className={`password-strength-bar ${
                    password.length < 6
                      ? "strength-weak"
                      : password.length < 10
                      ? "strength-medium"
                      : "strength-strong"
                  }`}
                  style={{
                    width: `${Math.min((password.length / 12) * 100, 100)}%`,
                  }}
                />
                <span className={`strength-label ${
                  password.length < 6
                    ? "strength-weak"
                    : password.length < 10
                    ? "strength-medium"
                    : "strength-strong"
                }`}>
                  {password.length < 6
                    ? "Muito curta"
                    : password.length < 10
                    ? "Razoável"
                    : "Boa"}
                </span>
              </div>
            )}

            {erros.password && (
              <span className="field-error">{erros.password}</span>
            )}
          </div>

          {/* ESQUECI A SENHA */}
          {isLogin && (
            <p
              className="forgot-password-link"
              onClick={() => setMostrarRecuperacao(!mostrarRecuperacao)}
            >
              Esqueci minha senha
            </p>
          )}

          {mostrarRecuperacao && (
            <div className="recovery-section">
              <p className="recovery-label">Insira seu e-mail para receber um link de recuperação:</p>
              <input
                type="email"
                placeholder="seu@email.com"
                value={emailRecuperacao}
                onChange={(e) => setEmailRecuperacao(e.target.value)}
                autoComplete="email"
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={handleForgotPassword}
                style={{ width: "100%" }}
              >
                Enviar link de recuperação
              </button>
            </div>
          )}

          {/* FEEDBACK GLOBAL */}
          {message && (
            <p className={isError ? "error-message" : "success-message"}>
              {isError ? "⚠ " : "✓ "}{message}
            </p>
          )}

          {/* BOTÃO SUBMIT */}
          <button
            type="submit"
            className="btn-primary btn-submit"
            disabled={isRegisterPasswordInvalid}
          >
            {isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="switch-mode" onClick={handleSwitchMode}>
          {isLogin
            ? "Não possui conta? Cadastre-se"
            : "Já possui conta? Faça login"}
        </p>
      </div>
    </div>
  );
}

export default Login;