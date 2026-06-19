import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [senha, setSenha]       = useState("");
  const [erro, setErro]         = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e?.preventDefault();
    setErro("");
    if (!email || !senha) { setErro("Preencha e-mail e senha."); return; }
    setCarregando(true);
    try {
      const { data } = await api.post("/usuarios/login", { email, senha });
      localStorage.setItem("usuario", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setErro("E-mail ou senha incorretos.");
      } else {
        setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="brand-mark" aria-hidden="true">🧠</div>
          <h1>Memória Segura</h1>
          <p className="tagline">Cuidado, rotina e tranquilidade em um só lugar.</p>
        </div>

        {erro && <div className="alert alert-error" role="alert">⚠️ {erro}</div>}

        <form onSubmit={entrar}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input id="email" className="input" type="email"
              placeholder="seu@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email" />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="senha">Senha</label>
            <input id="senha" className="input" type="password"
              placeholder="Digite sua senha"
              value={senha} onChange={e => setSenha(e.target.value)}
              autoComplete="current-password" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={carregando}>
            {carregando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="auth-toggle">
          Ainda não tem conta?{" "}
          <Link to="/cadastro" style={{ color: "var(--primary)", fontWeight: 700 }}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}