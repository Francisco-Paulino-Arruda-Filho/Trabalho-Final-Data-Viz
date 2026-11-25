---
name: dataviz-router
description: Encaminha pedidos de avaliação, crítica, sugestão ou implementação de gráficos, tabelas e visualizações com base nas referências de teoria incluídas na skill. Use para pedidos mistos ou quando a intenção visual ainda precisa ser classificada.
---

# Roteador de visualização de dados

Estas skills são locais a este repositório. Resolva os links a partir deste arquivo.

Escolha pelo resultado pedido; não execute todos os modos automaticamente:

| Intenção                               | Skill                                              | Resultado                                        |
| -------------------------------------- | -------------------------------------------------- | ------------------------------------------------ |
| Avaliar adequação ou qualidade         | [dataviz-evaluate](../dataviz-evaluate/SKILL.md)   | Diagnóstico fundamentado e limites da evidência  |
| Criticar problemas ou decisões         | [dataviz-critique](../dataviz-critique/SKILL.md)   | Problemas priorizados, consequências e correções |
| Sugerir representações ou melhorias    | [dataviz-suggest](../dataviz-suggest/SKILL.md)     | Alternativas comparadas e recomendação           |
| Criar, alterar ou aplicar uma proposta | [dataviz-implement](../dataviz-implement/SKILL.md) | Mudança implementada e verificada                |

Em pedidos mistos, combine somente os modos solicitados, reaproveitando o diagnóstico.
“Critique” ou “sugira” não autoriza modificar a aplicação. “Melhore este gráfico”
normalmente inclui implementação; preserve as escolhas explícitas do usuário.
As skills especializadas podem ser usadas diretamente sem passar por este roteador.

A teoria compartilhada está em [fundamentos](references/fundamentos.md);
leia-a ao entrar num modo. Leia [idiomas](references/idiomas.md) somente para
escolher ou comparar representações. Consulte [fontes](references/fontes.md)
para localizar as transcrições dos PDFs e aprofundar apenas o assunto relevante.

Em execuções repetidas, examine primeiro o estado atual e diagnósticos já disponíveis.
Reaproveite resultados ainda válidos, atualize somente pontos alterados e não
duplique gráficos, tabelas, seções ou recomendações já presentes.
