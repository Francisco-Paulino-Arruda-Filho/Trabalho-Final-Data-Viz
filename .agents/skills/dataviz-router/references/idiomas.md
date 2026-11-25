# Idiomas: decisões condicionadas à tarefa

Use com [fundamentos](fundamentos.md). Números referem-se aos arquivos no
[índice de fontes](fontes.md), páginas contadas desde a capa.

| Tarefa e dados                                  | Opção útil                                                     | Cuidado / alternativa                                                                                                                                      | Fonte                                 |
| ----------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Comunicar um ou dois valores                    | Texto com unidade e contexto                                   | Um gráfico pode acrescentar esforço sem informação                                                                                                         | 03 p. 5                               |
| Consultar valores exatos por item               | Tabela, ordenável se ajudar a busca                            | Unidades nos cabeçalhos, precisão consistente, números alinhados e bordas leves; muitas linhas/colunas dificultam padrões                                  | 03 pp. 6–9                            |
| Padrões numa tabela de duas chaves e uma medida | Heatmap ou tabela com destaque                                 | Cor oferece comparação aproximada; métricas incompatíveis não devem compartilhar escala; preserve números se consulta exata importa                        | 03 pp. 8–9; 10 pp. 35–36              |
| Comparar medida por categoria                   | Barras ou pontos alinhados, ordenados conforme tarefa          | Barras codificam comprimento e exigem base zero; pontos permitem destacar intervalos sem codificar comprimento; nomes longos favorecem horizontal          | 03 pp. 17–24; 10 pp. 18–19, 28–29     |
| Tendência com chave ordenada ou temporal        | Linhas                                                         | Conexão precisa ter significado; ausência não deve virar continuidade inventada; zero não é obrigatório para toda linha, mas o domínio precisa estar claro | 03 pp. 11–15; 10 pp. 30–33            |
| Mudança entre dois estados comparáveis          | Slope graph                                                    | Muitas linhas cruzadas dificultam rastreamento; rótulos diretos podem ajudar                                                                               | 03 p. 15                              |
| Associação de duas medidas                      | Dispersão                                                      | Oclusão pode pedir transparência, agregação ou facetas; bolhas adicionam medida em área com menor precisão; associação não estabelece causa                | 03 pp. 28–30; 10 pp. 13–15            |
| Composição de um todo                           | Empilhadas absolutas ou normalizadas; pizza para poucas partes | Normalização perde volume; segmentos internos sem base comum dificultam comparação; pizza tem baixa precisão para valores próximos                         | 03 pp. 32–35, 42; 10 pp. 20–23, 47–51 |
| Distribuição de uma medida                      | Histograma, boxplot, pontos ou densidade conforme amostra      | Bins mudam padrões; boxplot esconde modalidade; declare regra dos bigodes, não confunda bigodes de 1,5 IQR com mínimo e máximo                             | 25 pp. 20–24                          |
| Muitas medidas por item                         | SPLOM ou coordenadas paralelas                                 | SPLOM cresce quadraticamente; ordem de eixos e normalização afetam leitura de coordenadas paralelas; não compare unidades diferentes como iguais           | 10 pp. 37–44                          |
| Padrão espacial                                 | Mapa temático, símbolos ou fluxo                               | Só usar mapa quando posição for relevante; projeção distorce; coroplético dá saliência à área geográfica; comparar taxas pode exigir normalização          | 17 pp. 3–4, 10–21, 28–35              |
| Caminhos e topologia de rede                    | Nó-aresta                                                      | Layout por forças não implica distância semântica; densidade pode gerar emaranhado                                                                         | 18 pp. 7–18                           |
| Comunidades/adjacências em rede densa           | Matriz de adjacência reordenável                               | Ordem afeta padrões; seguir caminhos é mais difícil                                                                                                        | 18 pp. 23–27                          |
| Hierarquia e tamanho das folhas                 | Treemap, icicle ou árvore nó-aresta                            | Contenção serve a hierarquia; treemap troca precisão por densidade; escolha pela tarefa de tamanho, profundidade ou percurso                               | 18 pp. 29–33                          |

Em mapas, considere se uma ordenação ou dispersão responde melhor que geografia.
Escolha projeção pela propriedade e extensão que importam. Agregação espacial
pode mudar resultados ao mudar fronteiras (MAUP: 25 p. 28).

Para campos escalares, avalie fatias, isocontornos e função de transferência;
para campos vetoriais, direção, magnitude, sementes e estabilidade temporal.
Aqui, 3D pode carregar informação espacial real; o problema de gráficos básicos
é o 3D decorativo que distorce a comparação (17 pp. 36–67; 03 pp. 25, 43).

Foco+contexto, zoom semântico, filtros, agregação e facetas são escolhas com
custos: não esconda informação necessária à pergunta nem use distorção geométrica
para comparações de tamanho sem explicar sua consequência (25 pp. 36–48).
