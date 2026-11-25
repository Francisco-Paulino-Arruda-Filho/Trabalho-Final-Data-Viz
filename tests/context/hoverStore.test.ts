import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getHoveredAgent, setHoveredAgent, subscribeHoveredAgent } from "@/context/hoverStore"

describe("hoverStore", () => {
  beforeEach(() => setHoveredAgent(null))
  afterEach(() => setHoveredAgent(null))

  it("inicia (ou volta) em null", () => {
    expect(getHoveredAgent()).toBeNull()
  })

  it("setHoveredAgent atualiza o valor atual", () => {
    setHoveredAgent("Codex")
    expect(getHoveredAgent()).toBe("Codex")
  })

  it("notifica o listener com o novo valor", () => {
    const fn = vi.fn()
    const unsub = subscribeHoveredAgent(fn)
    setHoveredAgent("Devin")
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith("Devin")
    unsub()
  })

  it("não notifica quando o valor é igual ao atual", () => {
    setHoveredAgent("Jules")
    const fn = vi.fn()
    const unsub = subscribeHoveredAgent(fn)
    setHoveredAgent("Jules")
    setHoveredAgent(null)
    setHoveredAgent(null)
    expect(fn).toHaveBeenCalledTimes(1)
    unsub()
  })

  it("não notifica ao assinar", () => {
    const fn = vi.fn()
    const unsub = subscribeHoveredAgent(fn)
    expect(fn).not.toHaveBeenCalled()
    unsub()
  })

  it("notifica múltiplos listeners", () => {
    const a = vi.fn()
    const b = vi.fn()
    const ua = subscribeHoveredAgent(a)
    const ub = subscribeHoveredAgent(b)
    setHoveredAgent("Cursor")
    expect(a).toHaveBeenCalledWith("Cursor")
    expect(b).toHaveBeenCalledWith("Cursor")
    ua()
    ub()
  })

  it("unsubscribe para de notificar só aquele listener", () => {
    const a = vi.fn()
    const b = vi.fn()
    const ua = subscribeHoveredAgent(a)
    const ub = subscribeHoveredAgent(b)
    ua()
    setHoveredAgent("Copilot")
    expect(a).not.toHaveBeenCalled()
    expect(b).toHaveBeenCalledTimes(1)
    ub()
  })

  it("unsubscribe duplo é inócuo", () => {
    const a = vi.fn()
    const b = vi.fn()
    const ua = subscribeHoveredAgent(a)
    const ub = subscribeHoveredAgent(b)
    ua()
    expect(() => ua()).not.toThrow()
    setHoveredAgent("Codex")
    expect(b).toHaveBeenCalledTimes(1)
    ub()
  })

  it("voltar para null notifica", () => {
    setHoveredAgent("Codex")
    const fn = vi.fn()
    const unsub = subscribeHoveredAgent(fn)
    setHoveredAgent(null)
    expect(fn).toHaveBeenCalledWith(null)
    expect(getHoveredAgent()).toBeNull()
    unsub()
  })
})
