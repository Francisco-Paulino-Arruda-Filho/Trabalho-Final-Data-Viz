import { useEffect, useState } from "react"

export interface DashboardData {
  meta: any
  monthlyAgents: any[]
  outcomes: any[]
  mergeTimes: {
    summary: any[]
    ecdf: any[]
  }
  calendar: any[]
  languages: any[]
  repositories: any[]
  network: {
    nodes: any[]
    edges: any[]
    config: any
  }
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const files = [
          "meta.json",
          "monthly_agents.json",
          "outcomes.json",
          "merge_times.json",
          "calendar.json",
          "languages.json",
          "repositories.json",
          "agent_repository_network.json",
        ]

        const base = import.meta.env.BASE_URL // "/Trabalho-Final-Data-Viz/" em produção, "/" no dev
        const responses = await Promise.all(files.map((file) => fetch(`${base}data/${file}`)))

        if (responses.some((response) => !response.ok)) {
          throw new Error("Não foi possível carregar os arquivos JSON.")
        }

        const [
          meta,
          monthlyAgents,
          outcomes,
          mergeTimes,
          calendar,
          languages,
          repositories,
          network,
        ] = await Promise.all(responses.map((response) => response.json()))

        setData({
          meta,
          monthlyAgents,
          outcomes,
          mergeTimes,
          calendar,
          languages,
          repositories,
          network,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, loading, error }
}
