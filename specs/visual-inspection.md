# Inspeção visual com Playwright

Status: aprovada.

## Objetivo

Permitir que agentes capturem e inspecionem o dashboard em diferentes tamanhos de tela e estados de filtros, com comandos reproduzíveis e sem alterar o comportamento da aplicação.

## Requisitos propostos

- VIS-001: Playwright e Chromium são instalados com Bun; a configuração inicia o servidor Vite quando necessário e considera o caminho base da aplicação.
- VIS-002: Um comando de captura aceita viewport por largura e altura ou por presets de celular, tablet e desktop, além de caminho de saída, URL e opção de página inteira ou viewport.
- VIS-003: O comando permite selecionar os agentes de comparação e ocultar repositórios dominantes. Também aceita uma sequência parametrizável de interações com elementos da página para alcançar outros estados, inclusive filtros definidos nos gráficos.
- VIS-004: A captura aguarda o carregamento dos dados e a renderização dos gráficos; falhas de carregamento, seletores ou interações causam erro explícito e código de saída diferente de zero.
- VIS-005: Um comando executa uma matriz reproduzível de capturas nos três tamanhos, incluindo o estado inicial e um estado com filtros selecionados. Artefatos gerados ficam fora do controle de versão.
- VIS-006: O README documenta instalação do navegador, comandos, parâmetros, exemplos de filtros e localização dos artefatos. A ajuda dos comandos descreve as opções disponíveis.
- VIS-007: A verificação inclui executar capturas reais de um estado inicial e de um estado filtrado, além das verificações existentes pertinentes à mudança.

## Limites

- As capturas são instrumentos de inspeção, sem exigir comparação automática com imagens de referência.
- Filtros de gráficos devem ser aplicados por interações reais; seletores ou coordenadas informados precisam falhar claramente quando não forem válidos.
