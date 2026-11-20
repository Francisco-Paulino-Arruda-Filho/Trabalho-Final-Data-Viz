
import { useDashboardData } from "./hooks/useDashboardData";

import OutcomesChart from "./components/OutcomesChart";
import MergeTimesChart from "./components/MergeTimesChart";
import LanguagesChart from "./components/LanguagesChart";
import RepositoriesChart from "./components/RepositoriesChart";
import CalendarChart from "./components/CalendarChart";
import NetworkChart from "./components/NetworkChart";

import "./App.css";
import MonthlyAgentsChart from "./MonthlyAgentsChart";

function App() {
  const { data, loading, error } = useDashboardData();

  if (loading) return <p>Carregando dados...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!data) return null;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>AI Agents on GitHub</h1>
        <p>
          Análise da atividade de agentes de inteligência
          artificial em repositórios GitHub.
        </p>
      </header>

      <section className="indicators">
        <article className="indicator">
          <h2>{data.meta.total_prs.toLocaleString("pt-BR")}</h2>
          <p>Pull Requests</p>
        </article>

        <article className="indicator">
          <h2>
            {data.meta.total_repositories.toLocaleString("pt-BR")}
          </h2>
          <p>Repositórios</p>
        </article>

        <article className="indicator">
          <h2>{data.meta.agents.length}</h2>
          <p>Agentes</p>
        </article>
      </section>

      <section className="chart-grid">
        <article className="chart-card">
          <h2>Evolução mensal dos agentes</h2>
          <MonthlyAgentsChart data={data.monthlyAgents} />
        </article>

        <article className="chart-card">
          <h2>Resultados dos Pull Requests</h2>
          <OutcomesChart data={data.outcomes} />
        </article>

        <article className="chart-card">
          <h2>Tempo até o merge</h2>
          <MergeTimesChart data={data.mergeTimes} />
        </article>

        <article className="chart-card">
          <h2>Atividade por linguagem</h2>
          <LanguagesChart data={data.languages} />
        </article>

        <article className="chart-card">
          <h2>Repositórios mais ativos</h2>
          <RepositoriesChart data={data.repositories} />
        </article>

        <article className="chart-card">
          <h2>Calendário de atividade</h2>
          <CalendarChart data={data.calendar} />
        </article>

        <article className="chart-card full-width">
          <h2>Rede de agentes e repositórios</h2>
          <NetworkChart data={data.network} />
        </article>
      </section>
    </main>
  );
}

export default App;
