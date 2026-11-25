# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x"
import reactDom from "eslint-plugin-react-dom"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Inspeção visual com Playwright

Instale as dependências com `bun install` e o Chromium com `bun run visual:install` (em Linux, o Playwright pode exigir dependências de sistema). Execute `bun run visual -- --help` para listar as opções. Sem `--url`, o comando inicia e encerra o Vite automaticamente em uma porta local livre.

```sh
# Página inteira em três tamanhos, com e sem comparação e filtro de dominantes
bun run visual:matrix

# Capturas individuais
bun run visual -- --preset mobile --output visual-results/celular.png
bun run visual -- --width 1280 --height 800 --viewport-only --output visual-results/viewport.png
bun run visual -- --compare-a 'Claude Code' --compare-b Codex --hide-dominant

# Reutilizar servidor existente (inclua o caminho base da aplicação)
bun run visual -- --url http://127.0.0.1:5173/Trabalho-Final-Data-Viz/

# Interagir com elementos e gráficos antes de capturar
bun run visual -- --click 'summary' --wait 2000
bun run visual -- --drag '100,300,300,300' --viewport-only
```

Os presets são `mobile` (390×844), `tablet` (768×1024) e `desktop` (1440×900). `--width` e `--height` sobrescrevem as dimensões do preset. A matriz salva seis PNGs em `visual-results/`, pasta ignorada pelo Git. `--click` aceita seletores Playwright e pode ser repetido; `--drag` recebe coordenadas do viewport em pixels (`x1,y1,x2,y2`). As ações ocorrem na ordem informada, após os filtros nomeados; seletores devem identificar um único elemento. Para gráficos abaixo da dobra, use um seletor que os alcance antes de usar coordenadas, ou um viewport adequado. Capturas aguardam os dados e os gráficos, e retornam erro se interações, carregamento ou renderização falharem. A espera adicional é ajustável com `--wait` em milissegundos.
