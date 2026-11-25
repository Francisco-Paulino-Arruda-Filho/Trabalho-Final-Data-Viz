---
name: dataviz-implement
description: Implementa ou melhora gráficos, tabelas e visualizações aplicando princípios de visualização aos dados e à tarefa. Neste dashboard integra o desenho teórico à chart-authoring, às specs e à validação visual.
---

# Implementar visualizações

Leia [fundamentos](../dataviz-router/references/fundamentos.md) e consulte
[idiomas](../dataviz-router/references/idiomas.md) para a representação escolhida.

Antes da edição, inspecione o estado atual e identifique o que já atende ao pedido.
Em nova execução, não duplique componentes, dados, requisitos ou testes existentes;
altere apenas lacunas e preserve alterações não relacionadas.

Estabeleça o contrato visual: pergunta, granularidade, dados e
transformações, marca, atributo → canal, escala, domínio, ordem, unidades,
precisão e interações. Reutilize a proposta existente ou faça uma escolha
proporcional ao pedido; não transforme um ajuste pequeno em redesenho completo.
Defina como observar se a pergunta pode ser respondida após a mudança.

## Integração neste repositório

Siga o AGENTS.md e as specs relevantes. Para gráficos, Vega-Lite, D3 e textos de
ChartCard, leia e use [chart-authoring](../chart-authoring/SKILL.md), que contém
os contratos de filtros, comparação, cores e hover. Para tabelas, leia o
componente e os contratos da seção em que será inserida; mantenha a coordenação
com os filtros aplicáveis. Use [react-expert](../react-expert/SKILL.md) ao alterar
componentes React quando necessário.

Mudanças de comportamento precisam da spec aprovada conforme o AGENTS.md.
Procure workflow-router/spec-workflow nos locais disponíveis quando forem
exigidos. Se estiverem ausentes, declare essa ausência; não finja tê-los usado
nem contorne a aprovação de comportamento. Ainda é possível preparar um delta
concreto de spec para revisão. Esta skill não cria uma aprovação adicional.

Confira dados e tipos antes de codificar; não edite JSONs gerados manualmente.
Mantenha denominadores, ausências e domínio das escalas coerentes com o recorte.
Implemente estados vazio/sem medida sem confundir ausência com zero.
Em tabelas, use cabeçalhos semânticos, unidades claras, precisão consistente e
alinhamento que facilite comparação; não use cor como único acesso ao valor.

## Validação e entrega

Use [test-and-verify](../test-and-verify/SKILL.md) para os checks do projeto.
Teste cálculos novos relevantes com casos de fronteira, sem testes que apenas
repitam a estrutura do componente. Para alterações visuais, execute e inspecione
as capturas conforme specs/visual-inspection.md; confira rótulos, contraste,
sobreposição, legenda e leitura nos tamanhos aplicáveis. Verifique filtros,
seleção, hover, brush e reset quando afetados; capturas estáticas não os provam.

Compare o resultado com o contrato visual e a tarefa original. Relate o que
mudou, a justificativa teórica, a validação realmente executada e limitações.
Não declare inspeção visual nem interação testada sem tê-las observado.
