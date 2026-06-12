import { Link } from "react-router-dom";
import Layout from "../components/Layout";

/**
 * Painel principal.
 *
 * Mudancas em relacao ao original:
 * - Em vez de 4 botoes empilhados, cards visuais com icone, titulo e
 *   descricao curta — muito mais legivel para o publico-alvo.
 * - Saudacao personalizada com o nome guardado no localStorage.
 * - Layout em grid responsivo.
 */
function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const nome = usuario.nome || "Bem-vindo";

  const features = [
    {
      to: "/medicamentos",
      icon: "💊",
      title: "Medicamentos",
      description: "Cadastre remédios, doses e horários. Marque o que já foi tomado.",
      color: "color-rose",
    },
    {
      to: "/rotina",
      icon: "📅",
      title: "Rotina",
      description: "Organize as atividades do dia: refeições, exercícios, lazer.",
      color: "color-amber",
    },
    {
      to: "/cuidador",
      icon: "🤝",
      title: "Cuidadores",
      description: "Contatos de quem ajuda no cuidado diário: família e profissionais.",
      color: "color-green",
    },
    {
      to: "/idoso",
      icon: "❤️",
      title: "Ficha do Idoso",
      description: "Informações de saúde, alergias e contatos de emergência.",
      color: "",
    },
  ];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1>Olá, {nome} 👋</h1>
          <p className="subtitle">O que você gostaria de fazer hoje?</p>
        </div>
      </div>

      <div className="feature-grid">
        {features.map((f) => (
          <Link key={f.to} to={f.to} className={`feature-card ${f.color}`}>
            <div className="feature-icon" aria-hidden="true">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-description">{f.description}</div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export default Dashboard;
