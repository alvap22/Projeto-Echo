import { Link, useNavigate } from "react-router-dom";

import "../styles/header.css";

function Header() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem(
      "token"
    );

  const logado = !!token;

  function handleLogout() {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );

    navigate("/login");
  }

  return (
    <header className="header">

      <Link
        to="/home"
        className="logo"
      >
        Echo
      </Link>

      <nav>

        {!logado ? (

          <Link to="/login">
            Logar
          </Link>

        ) : (

          <>

            <Link to="/create-review">
              Nova Review
            </Link>

            <Link to="/profile">
              Perfil
            </Link>

            <button
              onClick={handleLogout}
              className="nav-btn-logout"
            >
              Sair
            </button>

          </>

        )}

      </nav>

    </header>
  );
}

export default Header;