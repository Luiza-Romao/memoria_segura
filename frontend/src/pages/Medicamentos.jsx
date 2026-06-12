import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

/**
 * Tela de Medicamentos.
 *
 * Mudancas em relacao ao original:
 * - O original tinha a logica mas renderizava apenas <h1> — UI completa
 *   construida do zero.
 * - Formulario lado a lado com a lista, marcar/desmarcar tomado,
 *   editar e excluir.
 * - Estados de carregando / lista vazia tratados.
 * - axios centralizado em vez de fetch espalhado.
 * - Pillule visual destacando se a dose ja foi tomada.
 */
function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // controle do formulario
  const [form, setForm] = useState(novoForm());
  const [editandoId, setEditandoId] = useState(null);

  function novoForm() {
    return { nome: "", dose: "", horario: "", observacao: "" };
  }

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/medicamentos");
      setMedicamentos(data);
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
    if (!form.nome || !form.dose || !form.horario) return;

    if (editandoId) {
      await api.put(`/medicamentos/${editandoId}`, form);
    } else {
      await api.post("/medicamentos", { ...form, tomado: false });
    }

    setForm(novoForm());
    setEditandoId(null);
    carregar();
  }

  function editar(m) {
    setForm({
      nome: m.nome,
      dose: m.dose,
      horario: m.horario,
      observacao: m.observacao || "",
    });
    setEditandoId(m.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelarEdicao() {
    setForm(novoForm());
    setEditandoId(null);
  }

  async function alternarTomado(id) {
    await api.patch(`/medicamentos/${id}/tomado`);
    carregar();
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir este medicamento?")) return;
    await api.delete(`/medicamentos/${id}`);
    carregar();
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>💊 Medicamentos</h1>
          <p className="subtitle">
            Cadastre os remédios, doses e horários. Marque o que já foi tomado.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <section className="card-section mb-2">
        <h2 style={{ marginBottom: 18 }}>
          {editandoId ? "Editar medicamento" : "Adicionar medicamento"}
        </h2>

        <form onSubmit={salvar}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome do remédio</label>
              <input
                className="input"
                placeholder="Ex: Losartana"
                value={form.nome}
                onChange={(e) => atualizarCampo("nome", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dose</label>
              <input
                className="input"
                placeholder="Ex: 50mg, 1 comprimido"
                value={form.dose}
                onChange={(e) => atualizarCampo("dose", e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Horário</label>
              <input
                type="time"
                className="input"
                value={form.horario}
                onChange={(e) => atualizarCampo("horario", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Observação (opcional)</label>
              <input
                className="input"
                placeholder="Ex: tomar com água, em jejum"
                value={form.observacao}
                onChange={(e) => atualizarCampo("observacao", e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editandoId ? "Salvar alterações" : "Adicionar"}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-ghost" onClick={cancelarEdicao}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Lista */}
      <h2 className="mb-2">Seus medicamentos</h2>

      {carregando ? (
        <p className="text-muted">Carregando…</p>
      ) : medicamentos.length === 0 ? (
        <div className="empty-state">
          <span className="icon" aria-hidden="true">💊</span>
          <p>Nenhum medicamento cadastrado ainda.<br/>Use o formulário acima para começar.</p>
        </div>
      ) : (
        <div className="list">
          {medicamentos.map((m) => (
            <div key={m.id} className={`list-item ${m.tomado ? "is-done" : ""}`}>
              <div className="list-item-main">
                <div className="list-item-title">
                  {m.nome} — <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>{m.dose}</span>
                </div>
                <div className="list-item-meta">
                  <span className="pill is-time">🕐 {m.horario}</span>
                  {m.tomado && <span className="pill is-done">✔ Tomado hoje</span>}
                  {m.observacao && <span>📝 {m.observacao}</span>}
                </div>
              </div>

              <div className="list-item-actions">
                <button
                  className={m.tomado ? "btn btn-ghost btn-sm" : "btn btn-accent btn-sm"}
                  onClick={() => alternarTomado(m.id)}
                >
                  {m.tomado ? "Desmarcar" : "Marcar tomado"}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => editar(m)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => excluir(m.id)}>
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

export default Medicamentos;
