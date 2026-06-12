import { Link, useNavigate } from "react-router-dom";

/**
 * Layout comum a todas as telas internas (depois do login).
 * Header sticky com o nome do app e botao para sair.
 */
export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="brand">
          <span className="brand-mark" aria-hidden="true">🧠</span>
          <span>Memória Segura</span>
        </Link>

        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate("/")}
          aria-label="Sair do aplicativo"
        >
          Sair
        </button>
      </header>

      <main className="app-main">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
