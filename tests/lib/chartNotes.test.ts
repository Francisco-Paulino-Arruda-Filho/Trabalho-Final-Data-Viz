import { describe, expect, it } from "vitest"
import { HOURLY_TIMEZONE_NOTE, MONTHLY_PARTIAL_NOTE } from "@/lib/chartNotes"

describe("CHRT-009: notas de proveniência dos gráficos temporais", () => {
  it("explica que círculos vazados indicam meses parciais", () => {
    expect(MONTHLY_PARTIAL_NOTE).toMatch(/círculos vazados/i)
    expect(MONTHLY_PARTIAL_NOTE).toContain("parciais")
  })

  it("explicita que o fuso dos campos horários é desconhecido", () => {
    expect(HOURLY_TIMEZONE_NOTE).toContain("fuso horário não está documentado")
    expect(HOURLY_TIMEZONE_NOTE).not.toContain("UTC")
  })
})
