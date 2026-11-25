import { useEffect, useState } from "react"

import { FilterProvider } from "@/context/FilterContext"

import ChartCard from "@/components/ChartCard"
import FilterBar from "@/components/FilterBar"

import CalendarChart from "@/components/charts/CalendarChart"
import MonthlyChart from "@/components/charts/MonthlyChart"
import OutcomesChart from "@/components/charts/OutcomesChart"
import MergeTimesChart from "@/components/charts/MergeTimesChart"
import LanguagesChart from "@/components/charts/LanguagesChart"
import RepositoriesChart from "@/components/charts/RepositoriesChart"
import ScatterChart from "@/components/charts/ScatterChart"
import NetworkChart from "@/components/charts/NetworkChart"

// Novas visualizações
import ReviewTypesChart from "@/components/charts/ReviewTypesChart"
import HourlyActivityChart from "@/components/charts/HourlyActivityChart"
import ParetoChart from "@/components/charts/ParetoChart"
import MergeBoxplotChart from "@/components/charts/MergeBoxplotChart"

import type {
  DayData,
  LanguageRow,
  MergeTimesData,
  Meta,
  MonthlyRow,
  NetworkData,
  OutcomeRow,
  Repo,
  ReviewTypeRow,
  HourlyActivityRow,
} from "@/lib/types"

import { fmtInt } from "@/lib/vegaHelpers"

import "@/styles/App.css"
import ComparisonBar from "@/components/ComparisonBar"

// Os arquivos JSON ficam em public/data/
const BASE = `${import.meta.env.BASE_URL}data/`

function useJson<T>(file: string) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${BASE}${file}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${file}: HTTP ${response.status}`)
        }

        return response.json()
      })
      .then(setData)
      .catch((error) => setError(String(error)))
  }, [file])

  return { data, error }
}

export default function App() {
  // Dados originais
  const meta = useJson<Meta>("meta.json")
  const calendar = useJson<DayData[]>("calendar.json")
  const monthly = useJson<MonthlyRow[]>("monthly_agents.json")
  const outcomes = useJson<OutcomeRow[]>("outcomes.json")
  const mergeTimes = useJson<MergeTimesData>("merge_times.json")
  const languages = useJson<LanguageRow[]>("languages.json")
  const repos = useJson<Repo[]>("repositories.json")
  const network = useJson<NetworkData>("agent_repository_network.json")

  // Novos dados
  const reviewTypes = useJson<ReviewTypeRow[]>("review_types.json")
  const hourlyActivity = useJson<HourlyActivityRow[]>("hourly_activity.json")

  // Todos os carregamentos são acompanhados
  const all = [
    meta,
    calendar,
    monthly,
    outcomes,
    mergeTimes,
    languages,
    repos,
    network,
    reviewTypes,
    hourlyActivity,
  ]

  const error = all.find((item) => item.error)?.error

  if (error) {
    return <p className="status">Erro ao carregar dados: {error}</p>
  }

  if (all.some((item) => !item.data)) {
    return <p className="status">Carregando dados...</p>
  }

  return (
    <FilterProvider>
      <main className="page">
        {/* Cabeçalho */}
        <header className="hero">
          <h1>Agentes de IA no código aberto</h1>

          <p>
            {fmtInt(meta.data!.total_prs)} pull requests abertos por seis agentes em{" "}
            {fmtInt(meta.data!.total_repositories)} repositórios do GitHub com mais de 100 estrelas.
            Explore atividade, resultados, colaboração e concentração usando os filtros
            compartilhados.
          </p>
        </header>

        {/* Filtros globais */}
        <FilterBar />
        <ComparisonBar />

        {/* ================================================== */}
        {/* 1. ATIVIDADE E ADOÇÃO                               */}
        {/* ================================================== */}

        <h2>Quando cada agente entrou em cena</h2>

        <div className="grid">
          <ChartCard
            wide
            title="Atividade diária"
            question="Em que dias cada agente esteve mais ativo?"
            encoding="Posição em grade (semana x dia da semana) identifica o dia; cor sequencial em escala raiz/log codifica a contagem."
            why="O calendário expõe ritmo semanal e lacunas, que uma linha esconderia. A escala não linear impede que os picos do Codex apaguem o restante."
            reactsTo={["agente", "(define) período"]}
          >
            <CalendarChart data={calendar.data!} />
          </ChartCard>

          <ChartCard
            wide
            title="Volume mensal por agente"
            question="Como a adoção de cada agente evolui e quando passa a ter volume relevante?"
            encoding="Posição horizontal = mês; posição vertical = PRs ou participação; cor = agente."
            why="Linhas permitem comparar tendências temporais entre os agentes. A alternância entre volume, escala logarítmica e participação ajuda a observar agentes com volumes menores."
            reactsTo={["agente", "período"]}
          >
            <MonthlyChart data={monthly.data!} />
          </ChartCard>

          {/* NOVA VISUALIZAÇÃO: DIA DA SEMANA X HORA */}

          <ChartCard
            wide
            title="Atividade por dia e horário"
            question="Em quais dias da semana e horários os PRs são mais frequentes?"
            encoding="Posição horizontal = hora; posição vertical = dia da semana; intensidade da cor = quantidade de PRs."
            why="O heatmap facilita comparar padrões horários e semanais de uma só vez. A seleção de agente e período permite observar mudanças no padrão."
            reactsTo={["agente", "período"]}
          >
            <HourlyActivityChart data={hourlyActivity.data!} />
          </ChartCard>
        </div>

        {/* ================================================== */}
        {/* 2. RESULTADOS E EFETIVIDADE                         */}
        {/* ================================================== */}

        <h2>O que acontece com os PRs</h2>

        <div className="grid">
          <ChartCard
            title="Desfecho dos PRs"
            question="Quais agentes têm mais PRs aceitos e quais têm mais fechados sem merge?"
            encoding="Comprimento da barra = proporção; cor = desfecho."
            why="Barras empilhadas normalizadas comparam proporções entre agentes de tamanhos muito diferentes. Isso facilita comparar as taxas de aceitação."
            reactsTo={["agente"]}
          >
            <OutcomesChart data={outcomes.data!} />
          </ChartCard>

          <ChartCard
            title="Tempo até o merge"
            question="Quanto tempo leva para um PR ser aceito e isso varia entre agentes?"
            encoding="Posição = tempo (escala log) x fração acumulada; cor = agente; ponto = mediana."
            why="A distribuição acumulada mostra a cauda inteira sem escolher faixas de histograma. Uma média esconderia diferenças na distribuição dos tempos."
            reactsTo={["agente"]}
          >
            <MergeTimesChart data={mergeTimes.data!} />
          </ChartCard>

          {/* NOVA VISUALIZAÇÃO: TIPOS DE REVISÃO */}

          <ChartCard
            wide
            title="Tipos de revisão por agente"
            question="Como a participação humana e de bots varia entre os agentes?"
            encoding="Comprimento = proporção ou contagem; cor = categoria de revisão."
            why="Barras empilhadas normalizadas comparam a composição das revisões mesmo quando os agentes têm volumes muito diferentes. Permite investigar a participação humana no processo."
            reactsTo={["agente"]}
          >
            <ReviewTypesChart data={reviewTypes.data!} />
          </ChartCard>

          {/* NOVA VISUALIZAÇÃO: BOXPLOT */}

          <ChartCard
            wide
            title="Distribuição do tempo até merge"
            question="Além da mediana, quão dispersos são os tempos de integração?"
            encoding="Caixa = Q1 a Q3; traço = mediana; linha = mínimo a máximo; eixo horizontal logarítmico."
            why="O resumo tipo boxplot permite comparar dispersão e assimetria entre agentes. A escala logarítmica preserva a leitura de valores muito diferentes."
            reactsTo={["agente"]}
          >
            <MergeBoxplotChart data={mergeTimes.data!} />
          </ChartCard>

          <ChartCard
            wide
            title="Aceitação por linguagem"
            question="A taxa de aceitação muda conforme a linguagem?"
            encoding="Posição em grade (linguagem x agente); intensidade de cor = taxa de merge; número na célula = valor exato."
            why="Com 14 linguagens e seis agentes, o heatmap permite comparar diversas combinações de uma só vez e identificar diferenças entre os agentes."
            reactsTo={["agente", "(define) linguagem"]}
          >
            <LanguagesChart data={languages.data!} />
          </ChartCard>
        </div>

        {/* ================================================== */}
        {/* 3. REPOSITÓRIOS E ECOSSISTEMA                       */}
        {/* ================================================== */}

        <h2>Onde a atividade se concentra</h2>

        <div className="grid">
          <ChartCard
            title="Repositórios com mais PRs"
            question="A atividade está distribuída entre muitos repositórios ou concentrada em poucos?"
            encoding="Comprimento da barra = PRs; cor = agente principal; rótulo = valor exato."
            why="O ranking permite identificar os repositórios mais ativos. O filtro de dominantes ajuda a observar repositórios menores."
            reactsTo={[
              "agente",
              "linguagem",
              "estrelas",
              "ocultar dominantes",
              "(define) repositório",
            ]}
          >
            <RepositoriesChart data={repos.data!} />
          </ChartCard>

          <ChartCard
            title="Popularidade x aceitação"
            question="A taxa de aceitação muda conforme a popularidade (estrelas) do repositório?"
            encoding="Posição x = estrelas (log); posição y = taxa de merge; tamanho = PRs; cor = agente principal."
            why="O scatterplot relaciona popularidade e taxa de aceitação, permitindo identificar agrupamentos, correlações e possíveis exceções."
            reactsTo={[
              "agente",
              "linguagem",
              "ocultar dominantes",
              "repositório",
              "(define) estrelas",
            ]}
          >
            <ScatterChart data={repos.data!} />
          </ChartCard>

          {/* NOVA VISUALIZAÇÃO: PARETO */}

          <ChartCard
            wide
            title="Concentração de PRs por repositório (Pareto)"
            question="Qual parcela dos PRs está concentrada nos repositórios mais ativos?"
            encoding="Barras = PRs por repositório; linha = participação acumulada no total filtrado."
            why="O Pareto combina volume e concentração acumulada, mostrando quanto os principais repositórios representam do conjunto."
            reactsTo={["agente", "linguagem", "estrelas", "ocultar dominantes", "repositório"]}
          >
            <ParetoChart data={repos.data!} />
          </ChartCard>

          <ChartCard
            wide
            title="Rede agente–repositório"
            question="Quais repositórios os agentes compartilham e quais são exclusivos de um agente?"
            encoding="Nós grandes = agentes; nós pequenos = repositórios; aresta = PRs do agente no repositório; cor = agente."
            why="Os dados representam relações entre agentes e repositórios. A rede mostra compartilhamentos e agrupamentos que uma tabela tradicional não revela."
            reactsTo={[
              "agente",
              "linguagem",
              "estrelas",
              "ocultar dominantes",
              "(define) agente e repositório",
            ]}
          >
            <NetworkChart data={network.data!} repos={repos.data!} />
          </ChartCard>
        </div>

        {/* Rodapé */}
        <footer className="page-foot">
          Fonte: AIDev (Li, Zhang e Hassan, 2026), subconjunto AIDev-pop. Dados de 24/12/2024 a
          24/10/2025; os meses de borda estão incompletos.
          <br />
          As visualizações de atividade temporal utilizam os filtros de período. Os agregados por
          repositório representam o intervalo completo dos dados e não são recalculados por período.
        </footer>
      </main>
    </FilterProvider>
  )
}
