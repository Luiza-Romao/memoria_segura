import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

/**
 * Tela de Cuidadores.
 * Pagina nova — antes era so uma rota sem implementacao.
 */
function Cuidador() {
  const [cuidadores, setCuidadores] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [form, setForm] = useState(novoForm());
  const [editandoId, setEditandoId] = useState(null);

  function novoForm() {
    return { nome: "", telefone: "", email: "", relacao: "" };
  }

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/cuidadores");
      setCuidadores(data);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  function atualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function salvar(e) {
    e.preventDefault();
    if (!form.nome || !form.telefone) return;

    if (editandoId) {
      await api.put(`/cuidadores/${editandoId}`, form);
    } else {
      await api.post("/cuidadores", form);
    }
    setForm(novoForm());
    setEditandoId(null);
    carregar();
  }

  function editar(c) {
    setForm({
      nome: c.nome,
      telefone: c.telefone,
      email: c.email || "",
      relacao: c.relacao || "",
    });
    setEditandoId(c.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente remover este cuidador?")) return;
    await api.delete(`/cuidadores/${id}`);
    carregar();
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>🤝 Cuidadores</h1>
          <p className="subtitle">
            Quem está na rede de apoio: familiares, amigos e profissionais.
          </p>
        </div>
      </div>

      <section className="card-section mb-2">
        <h2 style={{ marginBottom: 18 }}>
          {editandoId ? "Editar cuidador" : "Adicionar cuidador"}
        </h2>

        <form onSubmit={salvar}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input
                className="input"
                placeholder="Ex: Maria Silva"
                value={form.nome}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input
                className="input"
                placeholder="(11) 99999-0000"
                value={form.telefone}
                onChange={(e) => atualizarCampo("telefone", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email (opcional)</label>
              <input
                type="email"
                className="input"
                placeholder="maria@email.com"
                value={form.email}
                onChange={(e) => atualizarCampo("email", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Relação</label>
              <input
                className="input"
                placeholder="Filha, Cuidadora, Vizinho…"
                value={form.relacao}
                onChange={(e) => atualizarCampo("relacao", e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editandoId ? "Salvar alterações" : "Adicionar"}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-ghost"
                      onClick={() => { setForm(novoForm()); setEditandoId(null); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <h2 className="mb-2">Rede de cuidadores</h2>

      {carregando ? (
        <p className="text-muted">Carregando…</p>
      ) : cuidadores.length === 0 ? (
        <div className="empty-state">
          <span className="icon" aria-hidden="true">🤝</span>
          <p>Nenhum cuidador cadastrado.<br/>Adicione contatos de quem pode ajudar.</p>
        </div>
      ) : (
        <div className="list">
          {cuidadores.map((c) => (
            <div key={c.id} className="list-item">
              <div className="list-item-main">
                <div className="list-item-title">{c.nome}</div>
                <div className="list-item-meta">
                  <span className="pill is-time">📞 {c.telefone}</span>
                  {c.relacao && <span className="pill">{c.relacao}</span>}
                  {c.email && <span>✉️ {c.email}</span>}
                </div>
              </div>

              <div className="list-item-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => editar(c)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => excluir(c.id)}>
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Cuidador;
