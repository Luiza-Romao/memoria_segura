import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

/**
 * Tela de Idoso.
 *
 * Pagina nova — antes era apenas uma rota sem tela.
 * Modelo: lista de idosos sob cuidado, com ficha de saude resumida
 * (idade, tipo sanguineo, alergias, condicoes, contato de emergencia).
 */
function Idoso() {
  const [idosos, setIdosos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [form, setForm] = useState(novoForm());
  const [editandoId, setEditandoId] = useState(null);

  function novoForm() {
    return {
      nome: "",
      idade: "",
      tipoSanguineo: "",
      condicoes: "",
      alergias: "",
      contatoEmergencia: "",
    };
  }

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/idosos");
      setIdosos(data);
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
    if (!form.nome) return;

    const payload = {
      ...form,
      idade: form.idade ? parseInt(form.idade, 10) : null,
    };

    if (editandoId) {
      await api.put(`/idosos/${editandoId}`, payload);
    } else {
      await api.post("/idosos", payload);
    }
    setForm(novoForm());
    setEditandoId(null);
    carregar();
  }

  function editar(i) {
    setForm({
      nome: i.nome,
      idade: i.idade?.toString() || "",
      tipoSanguineo: i.tipoSanguineo || "",
      condicoes: i.condicoes || "",
      alergias: i.alergias || "",
      contatoEmergencia: i.contatoEmergencia || "",
    });
    setEditandoId(i.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir esta ficha?")) return;
    await api.delete(`/idosos/${id}`);
    carregar();
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>❤️ Ficha do Idoso</h1>
          <p className="subtitle">
            Informações de saúde, alergias e contato de emergência.
          </p>
        </div>
      </div>

      <section className="card-section mb-2">
        <h2 style={{ marginBottom: 18 }}>
          {editandoId ? "Editar ficha" : "Cadastrar idoso"}
        </h2>

        <form onSubmit={salvar}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome completo</label>
              <input
                className="input"
                placeholder="Ex: João da Silva"
                value={form.nome}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Idade</label>
              <input
                type="number"
                className="input"
                placeholder="Ex: 78"
                min="0"
                value={form.idade}
                onChange={(e) => atualizarCampo("idade", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo sanguíneo</label>
              <select
                className="select"
                value={form.tipoSanguineo}
                onChange={(e) => atualizarCampo("tipoSanguineo", e.target.value)}
              >
                <option value="">— Selecione —</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Contato de emergência</label>
              <input
                className="input"
                placeholder="(11) 99999-0000"
                value={form.contatoEmergencia}
                onChange={(e) => atualizarCampo("contatoEmergencia", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Condições de saúde</label>
            <textarea
              className="textarea"
              placeholder="Ex: hipertensão, diabetes, Alzheimer leve…"
              value={form.condicoes}
              onChange={(e) => atualizarCampo("condicoes", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Alergias</label>
            <textarea
              className="textarea"
              placeholder="Ex: penicilina, dipirona, amendoim…"
              value={form.alergias}
              onChange={(e) => atualizarCampo("alergias", e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editandoId ? "Salvar alterações" : "Cadastrar"}
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

      <h2 className="mb-2">Fichas cadastradas</h2>

      {carregando ? (
        <p className="text-muted">Carregando…</p>
      ) : idosos.length === 0 ? (
        <div className="empty-state">
          <span className="icon" aria-hidden="true">❤️</span>
          <p>Nenhuma ficha cadastrada.<br/>Use o formulário acima para começar.</p>
        </div>
      ) : (
        <div className="list">
          {idosos.map((i) => (
            <div key={i.id} className="list-item">
              <div className="list-item-main">
                <div className="list-item-title">
                  {i.nome}
                  {i.idade && <span style={{ color: "var(--text-muted)", fontWeight: 500 }}> — {i.idade} anos</span>}
                </div>
                <div className="list-item-meta">
                  {i.tipoSanguineo && <span className="pill">🩸 {i.tipoSanguineo}</span>}
                  {i.contatoEmergencia && <span className="pill is-time">🚨 {i.contatoEmergencia}</span>}
                  {i.condicoes && <span>🏥 {i.condicoes}</span>}
                  {i.alergias && <span>⚠️ Alergia: {i.alergias}</span>}
                </div>
              </div>

              <div className="list-item-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => editar(i)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => excluir(i.id)}>
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

export default Idoso;
