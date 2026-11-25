---
name: dataviz-suggest
description: Sugere e compara gráficos, tabelas e outras representações para uma pergunta e um conjunto de dados, justificando canais e trade-offs. Use para escolher um design ou propor melhorias antes de implementar.
---

# Sugerir visualizações

Leia [fundamentos](../dataviz-router/references/fundamentos.md) e
[idiomas](../dataviz-router/references/idiomas.md). Aprofunde somente o tema
necessário pelo [índice de fontes](../dataviz-router/references/fontes.md).

Parta da tarefa, público, suporte (dashboard, relatório, apresentação), espaço
e dados realmente disponíveis. Confirme granularidade, tipos, cardinalidade,
unidades, ausências e transformações necessárias. Não prometa um gráfico que
dependa de campos inexistentes sem explicitar essa dependência.

Compare um pequeno conjunto de alternativas plausíveis, quando houver escolha
real. Inclua tabela para consulta exata e texto para um ou dois números quando
forem mais úteis. Não force alternativas artificiais para cumprir quantidade.
Para cada opção, indique:

- Pergunta respondida e tarefa favorecida.
- Marca, atributo → canal, ordenação, escala e agregação/normalização.
- Interações necessárias e o contexto que permanece visível.
- Ganho perceptivo, informação perdida, custo de leitura e de implementação.

Recomende uma opção com justificativa ligada à tarefa. Explicite quando outra
opção seria preferível. Para tabelas, detalhe colunas, unidades, ordenação e
precisão; para múltiplas visões, detalhe escalas, cores e seleções compartilhadas.
Separe hipótese de padrão realmente observado nos dados. Não invente conclusões
nem acrescente visualizações sem uma pergunta própria.

Entregue uma proposta concreta que possa virar especificação. Se o pedido inclui
construir ou aplicar, prossiga com [implementação](../dataviz-implement/SKILL.md)
sem exigir nova confirmação apenas pela troca de modo.
