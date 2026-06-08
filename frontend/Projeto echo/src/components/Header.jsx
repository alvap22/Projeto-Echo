import { Link } from "react-router-dom";

import "../styles/header.css";

function Header() {
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

        <Link to="/login">
          Sair
        </Link>
      </nav>
    </header>
  );
}

export default Header;