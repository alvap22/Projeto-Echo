import { Link, useNavigate } from "react-router-dom";
import "../styles/header.css";

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const logado = !!token;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    navigate("/login");
  }

  return (
    <header className="header">
      <Link to="/home" className="logo">
        Echo
      </Link>

      <nav>
        <Link to="/create-review">
          Nova Review
        </Link>

        <Link to="/profile">
          Perfil
        </Link>

        {/* LOGIN / LOGOUT DINÂMICO */}
        {!logado ? (
          <Link to="/login">
            Logar
          </Link>
        ) : (
          <button onClick={handleLogout}>
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}

export default Header;