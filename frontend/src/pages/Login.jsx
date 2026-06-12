import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Tela de Login.
 *
 * Mudancas em relacao a versao original:
 * - Visual repensado (card centralizado, marca do app, tagline).
 * - Estado controlado nos inputs (estavam livres).
 * - Integracao real com o endpoint POST /usuarios/login do backend.
 * - Tratamento de erro com mensagem visivel.
 * - Suporte a Enter para enviar e modo "convidado" para entrar sem cadastro.
 */
function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e?.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha email e senha para continuar.");
      return;
    }

    setCarregando(true);
    try {
      const { data } = await api.post("/usuarios/login", { email, senha });
      localStorage.setItem("usuario", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 401) {
        setErro("Email ou senha incorretos.");
      } else {
        setErro("Não foi possível conectar ao servidor. Verifique se o backend está rodando.");
      }
    } finally {
      setCarregando(false);
    }
  }

  function entrarComoConvidado() {
    localStorage.setItem("usuario", JSON.stringify({ nome: "Convidado" }));
    navigate("/dashboard");
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark" aria-hidden="true">🧠</div>
          <h1>Memória Segura</h1>
          <p className="tagline">
            Cuidado, rotina e tranquilidade em um só lugar.
          </p>
        </div>

        {erro && <div className="alert alert-error" role="alert">⚠️ {erro}</div>}

        <form onSubmit={entrar}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="senha">Senha</label>
            <input
              id="senha"
              className="input"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={entrarComoConvidado}
          >
            Continuar como convidado
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
