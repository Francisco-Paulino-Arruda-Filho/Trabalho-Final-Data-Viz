import { useEffect, useState } from "react";
import { FilterProvider } from "./context/FilterContext";
import ChartCard from "./components/ChartCard";
import FilterBar from "./components/FilterBar";
import CalendarChart from "./components/CalendarChart";
import MonthlyChart from "./components/MonthlyChart";
import OutcomesChart from "./components/OutcomesChart";
import MergeTimesChart from "./components/MergeTimesChart";
import LanguagesChart from "./components/LanguagesChart";
import RepositoriesChart from "./components/RepositoriesChart";
import ScatterChart from "./components/ScatterChart";
import NetworkChart from "./components/NetworkChart";
import type {
  DayData,
  LanguageRow,
  MergeTimesData,
  Meta,
  MonthlyRow,
  NetworkData,
  OutcomeRow,
  Repo,
} from "./lib/types";
import { fmtInt } from "./lib/vegaHelpers";
import "./App.css";

// Ajuste se os JSONs estiverem em outro lugar (ex.: public/data/*.json).
const BASE = `${import.meta.env.BASE_URL}data/`;

function useJson<T>(file: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch(`${BASE}${file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`${file}: HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, [file]);
  return { data, error };
}

export default function App() {
  const meta = useJson<Meta>("meta.json");
  const calendar = useJson<DayData[]>("calendar.json");
  const monthly = useJson<MonthlyRow[]>("monthly_agents.json");
  const outcomes = useJson<OutcomeRow[]>("outcomes.json");
  const mergeTimes = useJson<MergeTimesData>("merge_times.json");
  const languages = useJson<LanguageRow[]>("languages.json");
  const repos = useJson<Repo[]>("repositories.json");
  const network = useJson<NetworkData>("agent_repository_network.json");

  const all = [meta, calendar, monthly, outcomes, mergeTimes, languages, repos, network];
  const error = all.find((a) => a.error)?.error;
  if (error) return <p className="status">Erro ao carregar dados: {error}</p>;
  if (all.some((a) => !a.data)) return <p className="status">Carregando dados…</p>;

  return (
    <FilterProvider>
      <main className="page">
        <header className="hero">
          <h1>Agentes de IA no código aberto</h1>
          <p>
            {fmtInt(meta.data!.total_prs)} pull requests abertos por seis agentes em{" "}
            {fmtInt(meta.data!.total_repositories)} repositórios do GitHub com mais de 100 estrelas.
            Todas as visões abaixo respondem aos mesmos filtros.
          </p>
        </header>

        <FilterBar />

        <h2>Quando cada agente entrou em cena</h2>
        <div className="grid">
          <ChartCard
            wide
            title="Atividade diária"
            question="Em que dias cada agente esteve mais ativo?"
            encoding="Posição em grade (semana × dia da semana) identifica o dia; cor sequencial em escala raiz/log codifica a contagem."
            why="O calendário expõe ritmo semanal e lacunas, que uma linha esconderia; a escala não linear impede que os picos do Codex apaguem o resto."
            reactsTo={["agente", "(define) período"]}
          >
            <CalendarChart data={calendar.data!} />
          </ChartCard>
          <ChartCard
            wide
            title="Volume mensal por agente"
            question="Como a adoção de cada agente evolui e quando passa a ter volume relevante?"
            encoding="Posição horizontal = mês; posição vertical = PRs ou participação; cor = agente (a mesma paleta em todas as visões)."
            why="Linhas comparam tendências de vários agentes melhor que barras empilhadas, cuja base móvel dificulta ler os agentes menores. A alternância volume/log/participação resolve a dominância do Codex."
            reactsTo={["agente", "período"]}
          >
            <MonthlyChart data={monthly.data!} />
          </ChartCard>
        </div>

        <h2>O que acontece com os PRs</h2>
        <div className="grid">
          <ChartCard
            title="Desfecho dos PRs"
            question="Quais agentes têm mais PRs aceitos e quais têm mais fechados sem merge?"
            encoding="Comprimento da barra (posição sobre escala comum) = proporção; cor = desfecho."
            why="Barras empilhadas normalizadas comparam proporções entre agentes de tamanhos muito diferentes; pizzas exigiriam comparar ângulos e seis gráficos."
            reactsTo={["agente"]}
          >
            <OutcomesChart data={outcomes.data!} />
          </ChartCard>
          <ChartCard
            title="Tempo até o merge"
            question="Quanto tempo leva para um PR ser aceito e isso varia entre agentes?"
            encoding="Posição = tempo (escala log) × fração acumulada; cor = agente; ponto = mediana."
            why="A distribuição acumulada mostra a cauda inteira sem escolher faixas de histograma; uma média esconderia que metade dos PRs do Codex é aceita em segundos."
            reactsTo={["agente"]}
          >
            <MergeTimesChart data={mergeTimes.data!} />
          </ChartCard>
          <ChartCard
            wide
            title="Aceitação por linguagem"
            question="A taxa de aceitação muda conforme a linguagem?"
            encoding="Posição em grade (linguagem × agente); intensidade de cor = taxa de merge; número na célula = valor exato."
            why="Com 14 linguagens × 6 agentes, o heatmap permite varrer 80 comparações de uma vez e achar exceções; barras agrupadas teriam 80 barras."
            reactsTo={["agente", "(define) linguagem"]}
          >
            <LanguagesChart data={languages.data!} />
          </ChartCard>
        </div>

        <h2>Onde a atividade se concentra</h2>
        <div className="grid">
          <ChartCard
            title="Repositórios com mais PRs"
            question="A atividade está distribuída entre muitos repositórios ou concentrada em poucos?"
            encoding="Comprimento da barra = PRs; cor = agente principal; rótulo = valor exato."
            why="Ranking de poucos itens com rótulos longos pede barras horizontais. Escala linear (sem log) para não esconder o tamanho do líder; o filtro 'ocultar dominantes' revela os demais."
            reactsTo={["agente", "linguagem", "estrelas", "ocultar dominantes", "(define) repositório"]}
          >
            <RepositoriesChart data={repos.data!} />
          </ChartCard>
          <ChartCard
            title="Popularidade × aceitação"
            question="A taxa de aceitação muda conforme a popularidade (estrelas) do repositório?"
            encoding="Posição x = estrelas (log); posição y = taxa de merge; tamanho = PRs; cor = agente principal."
            why="Duas variáveis quantitativas e um terceiro atributo: o scatterplot mostra correlação, agrupamentos e outliers. Escala log em x porque estrelas variam de 100 a mais de 200 mil."
            reactsTo={["agente", "linguagem", "ocultar dominantes", "repositório", "(define) estrelas"]}
          >
            <ScatterChart data={repos.data!} />
          </ChartCard>
          <ChartCard
            wide
            title="Rede agente–repositório"
            question="Quais repositórios os agentes compartilham e quais são exclusivos de um agente?"
            encoding="Nós grandes = agentes; nós pequenos = repositórios; aresta = PRs do agente no repositório; cor = agente."
            why="Os dados são relações (quem contribui onde); uma rede mostra repositórios compartilhados e agrupamentos que uma tabela cruzada não revela."
            reactsTo={["agente", "linguagem", "estrelas", "ocultar dominantes", "(define) agente e repositório"]}
          >
            <NetworkChart data={network.data!} repos={repos.data!} />
          </ChartCard>
        </div>

        <footer className="page-foot">
          Fonte: AIDev (Li, Zhang e Hassan, 2026), subconjunto AIDev-pop. Dados de 24/12/2024 a
          24/10/2025; os meses de borda estão incompletos.
        </footer>
      </main>
    </FilterProvider>
  );
}
