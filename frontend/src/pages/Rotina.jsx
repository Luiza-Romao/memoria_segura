import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

/**
 * Tela de Rotina diaria.
 * Pagina nova — antes era so uma rota sem implementacao.
 */
function Rotina() {
  const [rotinas, setRotinas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [form, setForm] = useState(novoForm());
  const [editandoId, setEditandoId] = useState(null);

  function novoForm() {
    return { atividade: "", horario: "", descricao: "" };
  }

  async function carregar() {
    setCarregando(true);
    try {
      const { data } = await api.get("/rotinas");
      // ordena por horario para a visualizacao ficar logica
      data.sort((a, b) => (a.horario || "").localeCompare(b.horario || ""));
      setRotinas(data);
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
    if (!form.atividade || !form.horario) return;

    if (editandoId) {
      await api.put(`/rotinas/${editandoId}`, form);
    } else {
      await api.post("/rotinas", { ...form, concluida: false });
    }
    setForm(novoForm());
    setEditandoId(null);
    carregar();
  }

  function editar(r) {
    setForm({
      atividade: r.atividade,
      horario: r.horario,
      descricao: r.descricao || "",
    });
    setEditandoId(r.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function alternarConcluida(id) {
    await api.patch(`/rotinas/${id}/concluida`);
    carregar();
  }

  async function excluir(id) {
    if (!confirm("Deseja realmente excluir esta atividade?")) return;
    await api.delete(`/rotinas/${id}`);
    carregar();
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>📅 Rotina diária</h1>
          <p className="subtitle">
            Organize refeições, exercícios, lazer e outros compromissos do dia.
          </p>
        </div>
      </div>

      <section className="card-section mb-2">
        <h2 style={{ marginBottom: 18 }}>
          {editandoId ? "Editar atividade" : "Adicionar atividade"}
        </h2>

        <form onSubmit={salvar}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Atividade</label>
              <input
                className="input"
                placeholder="Ex: Caminhada, Almoço, Ligar para a família"
                value={form.atividade}
                onChange={(e) => atualizarCampo("atividade", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horário</label>
              <input
                type="time"
                className="input"
                value={form.horario}
                onChange={(e) => atualizarCampo("horario", e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição (opcional)</label>
            <textarea
              className="textarea"
              placeholder="Detalhes da atividade, lembretes…"
              value={form.descricao}
              onChange={(e) => atualizarCampo("descricao", e.target.value)}
            />
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

      <h2 className="mb-2">Sua rotina</h2>

      {carregando ? (
        <p className="text-muted">Carregando…</p>
      ) : rotinas.length === 0 ? (
        <div className="empty-state">
          <span className="icon" aria-hidden="true">📅</span>
          <p>Nenhuma atividade cadastrada.<br/>Comece adicionando os horários do seu dia.</p>
        </div>
      ) : (
        <div className="list">
          {rotinas.map((r) => (
            <div key={r.id} className={`list-item ${r.concluida ? "is-done" : ""}`}>
              <div className="list-item-main">
                <div className="list-item-title">{r.atividade}</div>
                <div className="list-item-meta">
                  <span className="pill is-time">🕐 {r.horario}</span>
                  {r.concluida && <span className="pill is-done">✔ Concluída</span>}
                  {r.descricao && <span>📝 {r.descricao}</span>}
                </div>
              </div>

              <div className="list-item-actions">
                <button
                  className={r.concluida ? "btn btn-ghost btn-sm" : "btn btn-accent btn-sm"}
                  onClick={() => alternarConcluida(r.id)}
                >
                  {r.concluida ? "Desmarcar" : "Concluir"}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => editar(r)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => excluir(r.id)}>
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

export default Rotina;
