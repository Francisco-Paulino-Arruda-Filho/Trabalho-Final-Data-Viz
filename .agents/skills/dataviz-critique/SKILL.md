---
name: dataviz-critique
description: Critica decisões em gráficos, tabelas e visualizações, priorizando problemas de interpretação e propondo correções justificadas pela teoria. Use para revisão crítica sem alteração automática de código.
---

# Criticar visualizações

Leia [fundamentos](../dataviz-router/references/fundamentos.md). Consulte
[idiomas](../dataviz-router/references/idiomas.md) quando comparar uma correção.

Reconstrua pergunta, público, dados, transformações e canais a partir dos artefatos.
Inspecione os dados ou código para confirmar suspeitas; quando só houver imagem,
limite a crítica ao observável. Não invente achados para preencher uma lista.

Para cada problema relevante, informe:

- Evidência e localização: elemento, arquivo/linha ou região da imagem.
- Consequência: que comparação fica difícil ou que inferência pode ser induzida.
- Princípio e fonte: expressividade, efetividade, alinhamento, discriminabilidade,
  contexto ou outro conceito pertinente, com referência e página.
- Correção mínima, eventual alternativa e sua perda ou custo.

Priorize primeiro distorção ou erro nos dados, depois impedimentos à tarefa,
depois esforço de leitura e acabamento. A gravidade depende da tarefa e do
alcance do problema; uma preferência visual isolada não é falha grave.
Diferencie erro confirmado, risco condicional e escolha com trade-off.
Preserve e mencione decisões úteis que a correção deve manter.
Não condene mapas, pizzas, tabelas ou formas radiais por categoria: demonstre
por que servem ou não à pergunta atual. Evite 3D decorativo, mas não trate
campos espaciais tridimensionais como decoração.

Entregue os achados priorizados e limites da revisão, sem editar a aplicação.
Se também foi pedido aplicar as correções, use [implementação](../dataviz-implement/SKILL.md).
