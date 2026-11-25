import { chromium, type Page } from "@playwright/test"
import { spawn } from "node:child_process"
import { mkdir } from "node:fs/promises"
import { dirname } from "node:path"
import { createServer } from "node:net"

const help = `Inspeção visual: bun run visual -- [opções]
  --preset mobile|tablet|desktop   viewport (padrão: desktop)
  --width N --height N             dimensões personalizadas
  --output ARQUIVO                 PNG de saída (padrão: visual-results/screenshot.png)
  --url URL                        servidor existente; sem URL inicia Vite localmente
  --compare-a NOME --compare-b NOME
  --hide-dominant                  ativa o filtro de repositórios dominantes
  --click SELETOR                  clica em um elemento; pode ser repetido
  --drag X1,Y1,X2,Y2              arrasta entre coordenadas do viewport; pode ser repetido
  --wait N                         milissegundos após interações (padrão: 1000)
  --viewport-only                  captura apenas a área visível
  --matrix                         captura presets nos estados inicial e filtrado
  --help                           mostra esta ajuda
Interações --click e --drag são executadas na ordem informada.`

const presets: Record<string, [number, number]> = {
  mobile: [390, 844],
  tablet: [768, 1024],
  desktop: [1440, 900],
}
const args = process.argv.slice(2)
let preset = "desktop",
  width: number | undefined,
  height: number | undefined
let output = "visual-results/screenshot.png",
  url = "",
  a = "",
  b = "",
  wait = 1000
let hide = false,
  fullPage = true,
  matrix = false
const actions: { type: string; value: string }[] = []
function value(i: number) {
  if (!args[i + 1] || args[i + 1].startsWith("--")) throw new Error(`Valor ausente para ${args[i]}`)
  return args[i + 1]
}
function positive(raw: string, name: string, allowZero = false) {
  const n = Number(raw)
  if (!Number.isInteger(n) || n < (allowZero ? 0 : 1)) throw new Error(`${name} inválido: ${raw}`)
  return n
}
try {
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--help") {
      console.log(help)
      process.exit(0)
    }
    if (arg === "--hide-dominant") {
      hide = true
      continue
    }
    if (arg === "--viewport-only") {
      fullPage = false
      continue
    }
    if (arg === "--matrix") {
      matrix = true
      continue
    }
    const v = value(i++)
    switch (arg) {
      case "--preset":
        preset = v
        break
      case "--width":
        width = positive(v, arg)
        break
      case "--height":
        height = positive(v, arg)
        break
      case "--output":
        output = v
        break
      case "--url":
        url = v
        break
      case "--compare-a":
        a = v
        break
      case "--compare-b":
        b = v
        break
      case "--wait":
        wait = positive(v, arg, true)
        break
      case "--click":
      case "--drag":
        actions.push({ type: arg, value: v })
        break
      default:
        throw new Error(`Opção desconhecida: ${arg}`)
    }
  }
  if (!presets[preset]) throw new Error(`Preset desconhecido: ${preset}`)
  if (
    matrix &&
    (width ||
      height ||
      a ||
      b ||
      hide ||
      actions.length ||
      output !== "visual-results/screenshot.png")
  )
    throw new Error("--matrix não aceita dimensões, filtros, interações ou saída personalizados")
  for (const action of actions)
    if (action.type === "--drag") {
      const parts = action.value.split(",")
      if (
        parts.length !== 4 ||
        parts.some((x) => x.trim() === "" || !Number.isFinite(Number(x)) || Number(x) < 0)
      )
        throw new Error(`Coordenadas inválidas: ${action.value}`)
    }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  console.error(help)
  process.exit(1)
}

const port = url
  ? 0
  : await new Promise<number>((resolve, reject) => {
      const probe = createServer()
      probe.on("error", reject)
      probe.listen(0, "127.0.0.1", () => {
        const address = probe.address()
        if (!address || typeof address === "string") return reject(new Error("Porta indisponível"))
        probe.close(() => resolve(address.port))
      })
    })
const server = url
  ? null
  : spawn(
      "bun",
      [
        "node_modules/vite/bin/vite.js",
        "--host",
        "127.0.0.1",
        "--port",
        String(port),
        "--strictPort",
      ],
      { stdio: "inherit" },
    )
url ||= `http://127.0.0.1:${port}/Trabalho-Final-Data-Viz/`
let serverExited = false
server?.on("exit", () => {
  serverExited = true
})

async function readyServer() {
  if (!server) return
  for (let i = 0; i < 100; i++) {
    if (serverExited) throw new Error("Servidor Vite encerrou antes de iniciar")
    try {
      if ((await fetch(url)).ok) return
    } catch {
      /* ainda iniciando */
    }
    await Bun.sleep(200)
  }
  throw new Error("Tempo esgotado aguardando o servidor Vite")
}
async function readyCharts(page: Page) {
  await page.locator("main.page").waitFor({ state: "visible", timeout: 30000 })
  await page.waitForFunction(
    () => {
      const cards = document.querySelectorAll(".card")
      return cards.length > 0 && [...cards].every((card) => card.querySelector("svg, canvas"))
    },
    { timeout: 30000 },
  )
  if (await page.locator(".chart-error").count())
    throw new Error("Erro de renderização em um gráfico")
}
async function capture(name: string, w: number, h: number, filtered: boolean) {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("response", (response) => {
      if (response.status() >= 400 && response.url().includes("/data/"))
        errors.push(`${response.status()} ${response.url()}`)
    })
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 })
    await readyCharts(page)
    if (filtered || a) await page.getByLabel("Agente A").selectOption(filtered ? "Claude Code" : a)
    if (filtered || b) await page.getByLabel("Agente B").selectOption(filtered ? "Codex" : b)
    if (filtered || hide)
      await page.getByRole("checkbox", { name: /Ocultar repositórios dominantes/ }).check()
    for (const action of actions) {
      if (action.type === "--click") await page.locator(action.value).click({ timeout: 10000 })
      else {
        const [x1, y1, x2, y2] = action.value.split(",").map(Number)
        if ([x1, x2].some((x) => x >= w) || [y1, y2].some((y) => y >= h))
          throw new Error(`Coordenadas fora do viewport: ${action.value}`)
        await page.mouse.move(x1, y1)
        await page.mouse.down()
        await page.mouse.move(x2, y2, { steps: 20 })
        await page.mouse.up()
      }
    }
    await page.waitForTimeout(wait)
    await readyCharts(page)
    if (errors.length) throw new Error(errors.join("\n"))
    await mkdir(dirname(name), { recursive: true })
    await page.screenshot({ path: name, fullPage, animations: "disabled" })
    console.log(`Captura salva: ${name} (${w}x${h})`)
  } finally {
    await browser.close()
  }
}
try {
  await readyServer()
  if (matrix) {
    for (const [name, [w, h]] of Object.entries(presets)) {
      await capture(`visual-results/${name}-inicial.png`, w, h, false)
      await capture(`visual-results/${name}-filtrado.png`, w, h, true)
    }
  } else await capture(output, width ?? presets[preset][0], height ?? presets[preset][1], false)
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  server?.kill()
}
