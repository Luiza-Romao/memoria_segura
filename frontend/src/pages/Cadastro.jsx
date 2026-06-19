import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

/* ─── Definição dos tipos de usuário ─────────────────────────── */
const TIPOS = [
  {
    valor: "IDOSO",
    icone: "🧓",
    label: "Idoso",
    desc: "Quero acompanhar minha própria rotina e medicamentos",
  },
  {
    valor: "CUIDADOR",
    icone: "🤝",
    label: "Cuidador",
    desc: "Sou cuidador profissional ou voluntário de um idoso",
  },
  {
    valor: "FAMILIAR",
    icone: "👨‍👩‍👧",
    label: "Familiar",
    desc: "Sou familiar e quero acompanhar um ente querido",
  },
];

/* ─── Indicador de passos ─────────────────────────────────────── */
function Passos({ atual }) {
  const labels = ["Perfil", "Seus dados", "Pronto!"];
  return (
    <div className="step-indicator">
      {labels.map((lbl, i) => {
        const n = i + 1;
        const estado = n < atual ? "done" : n === atual ? "active" : "";
        return (
          <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div className={`step ${estado}`} style={{ flex: 1 }}>
              <div className="step-circle">{n < atual ? "✓" : n}</div>
              <span className="step-label">{lbl}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`step-line ${n < atual ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Componente principal ───────────────────────────────────── */
export default function Cadastro() {
  const navigate = useNavigate();

  const [passo, setPasso]   = useState(1);
  const [tipo, setTipo]     = useState("");
  const [form, setForm]     = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [erros, setErros]   = useState({});
  const [emailStatus, setEmailStatus] = useState(null); // null | "verificando" | "ok" | "ocupado"
  const [submitErro, setSubmitErro]   = useState("");
  const [carregando, setCarregando]   = useState(false);

  const timerEmail = useRef(null);

  /* Verifica disponibilidade do e-mail com debounce de 600 ms */
  useEffect(() => {
    if (!form.email || erros.email) { setEmailStatus(null); return; }
    setEmailStatus("verificando");
    clearTimeout(timerEmail.current);
    timerEmail.current = setTimeout(async () => {
      try {
        const { data } = await api.get(`/usuarios/checar-email?email=${encodeURIComponent(form.email)}`);
        setEmailStatus(data.disponivel ? "ok" : "ocupado");
      } catch {
        setEmailStatus(null);
      }
    }, 600);
    return () => clearTimeout(timerEmail.current);
  }, [form.email, erros.email]);

  function campo(f, v) {
    setForm(prev => ({ ...prev, [f]: v }));
    setErros(prev => ({ ...prev, [f]: "" }));
  }

  /* ── Passo 1 → 2: escolher tipo ─────────────────────────────── */
  function avancarTipo() {
    if (!tipo) { setErros({ tipo: "Escolha um perfil para continuar." }); return; }
    setErros({});
    setPasso(2);
  }

  /* ── Passo 2: validações locais ─────────────────────────────── */
  function validarForm() {
    const e = {};
    if (!form.nome.trim())    e.nome = "Nome obrigatório.";
    if (!form.email.trim())   e.email = "E-mail obrigatório.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail inválido.";
    if (emailStatus === "ocupado") e.email = "Este e-mail já está cadastrado.";
    if (!form.senha)          e.senha = "Senha obrigatória.";
    else if (form.senha.length < 6) e.senha = "Mínimo de 6 caracteres.";
    if (form.confirmar !== form.senha) e.confirmar = "As senhas não coincidem.";
    return e;
  }

  async function cadastrar(e) {
    e.preventDefault();
    setSubmitErro("");
    const e2 = validarForm();
    if (Object.keys(e2).length) { setErros(e2); return; }
    if (emailStatus === "verificando") { setSubmitErro("Aguarde a verificação do e-mail."); return; }

    setCarregando(true);
    try {
      await api.post("/usuarios", {
        nome:  form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        senha: form.senha,
        tipo,
      });
      setPasso(3);
    } catch (err) {
      if (err.response?.status === 409) {
        setErros({ email: "Este e-mail já está cadastrado." });
      } else {
        setSubmitErro("Erro ao cadastrar. Verifique se o backend está rodando.");
      }
    } finally {
      setCarregando(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="auth-screen">
      <div className="auth-card" style={{ maxWidth: 520 }}>

        {/* Marca */}
        <div className="auth-brand" style={{ marginBottom: 20 }}>
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">🧠</span>
            <span>Memória Segura</span>
          </Link>
        </div>

        <Passos atual={passo} />

        {/* ── PASSO 1: tipo de usuário ─────────────────────────── */}
        {passo === 1 && (
          <div>
            <h2 style={{ marginBottom: 8 }}>Qual é o seu perfil?</h2>
            <p className="text-muted" style={{ marginBottom: 24, fontSize: "1rem" }}>
              Escolha como você vai usar o aplicativo.
            </p>

            <div className="tipo-grid">
              {TIPOS.map(t => (
                <div
                  key={t.valor}
                  className={`tipo-card ${tipo === t.valor ? "selected" : ""}`}
                  onClick={() => { setTipo(t.valor); setErros({}); }}
                  role="radio"
                  aria-checked={tipo === t.valor}
                  tabIndex={0}
                  onKeyDown={ev => ev.key === "Enter" && setTipo(t.valor)}
                >
                  <span className="tipo-icon" aria-hidden="true">{t.icone}</span>
                  <div className="tipo-label">{t.label}</div>
                  <div className="tipo-desc">{t.desc}</div>
                </div>
              ))}
            </div>

            {erros.tipo && (
              <p className="field-error" style={{ marginTop: 12 }}>⚠️ {erros.tipo}</p>
            )}

            <button className="btn btn-primary btn-block" style={{ marginTop: 24 }}
                    onClick={avancarTipo}>
              Continuar →
            </button>

            <p className="auth-toggle">
              Já tem conta?{" "}
              <Link to="/" style={{ color: "var(--primary)", fontWeight: 700 }}>
                Entrar
              </Link>
            </p>
          </div>
        )}

        {/* ── PASSO 2: dados pessoais ──────────────────────────── */}
        {passo === 2 && (
          <form onSubmit={cadastrar}>
            <h2 style={{ marginBottom: 20 }}>Seus dados</h2>

            {submitErro && (
              <div className="alert alert-error" role="alert">⚠️ {submitErro}</div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="nome">Nome completo</label>
              <input id="nome" className={`input ${erros.nome ? "is-error" : ""}`}
                placeholder="Como gostaria de ser chamado(a)"
                value={form.nome} onChange={e => campo("nome", e.target.value)} />
              {erros.nome && <span className="field-error">⚠️ {erros.nome}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">E-mail</label>
              <input id="email" type="email"
                className={`input ${erros.email ? "is-error" : emailStatus === "ok" ? "is-ok" : ""}`}
                placeholder="seu@email.com"
                value={form.email} onChange={e => campo("email", e.target.value)}
                autoComplete="email" />
              {emailStatus === "verificando" && (
                <span className="form-hint">🔍 Verificando disponibilidade…</span>
              )}
              {emailStatus === "ok" && !erros.email && (
                <span className="field-ok">✔ E-mail disponível</span>
              )}
              {(emailStatus === "ocupado" || erros.email) && (
                <span className="field-error">⚠️ {erros.email || "E-mail já cadastrado."}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="senha">Senha</label>
              <input id="senha" type="password"
                className={`input ${erros.senha ? "is-error" : ""}`}
                placeholder="Mínimo 6 caracteres"
                value={form.senha} onChange={e => campo("senha", e.target.value)}
                autoComplete="new-password" />
              {erros.senha && <span className="field-error">⚠️ {erros.senha}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmar">Confirmar senha</label>
              <input id="confirmar" type="password"
                className={`input ${erros.confirmar ? "is-error" : ""}`}
                placeholder="Repita a senha"
                value={form.confirmar} onChange={e => campo("confirmar", e.target.value)}
                autoComplete="new-password" />
              {erros.confirmar && <span className="field-error">⚠️ {erros.confirmar}</span>}
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost"
                      onClick={() => { setPasso(1); setErros({}); }}>
                ← Voltar
              </button>
              <button type="submit" className="btn btn-primary" disabled={carregando}
                      style={{ flex: 1 }}>
                {carregando ? "Cadastrando…" : "Criar conta"}
              </button>
            </div>
          </form>
        )}

        {/* ── PASSO 3: sucesso ─────────────────────────────────── */}
        {passo === 3 && (
          <div className="text-center">
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: "var(--accent)", marginBottom: 12 }}>
              Cadastro realizado!
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>
              Bem-vindo(a), <strong>{form.nome.split(" ")[0]}</strong>!<br />
              Sua conta foi criada com sucesso.
            </p>
            <button className="btn btn-primary btn-block"
                    onClick={() => navigate("/")}>
              Ir para o login
            </button>
          </div>
        )}

      </div>
    </div>
  );
}