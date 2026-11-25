# Fundamentos para decidir e revisar

Síntese operacional dos materiais da disciplina de Emanuele Santos, não uma
transcrição. As páginas abaixo são as posições no PDF, contando a capa.
Consulte [fontes](fontes.md) para os arquivos originais. As recomendações de
engenharia e apresentação de resultados nas skills são adaptações locais,
não citações literais dos slides.

## Dados → tarefa → codificação

Descreva **o que** (dados e semântica), **por quê** (tarefa do público) e **como**
(codificação e interação) antes de julgar o idioma. Distingua item, atributo,
link, posição e grid; tabela, rede/árvore, geometria e campo. Um identificador
numérico pode ser nominal; ordinal não implica distâncias aritméticas iguais.
Diferencie quantitativo, temporal, sequencial, divergente e cíclico; documente
chaves, valores e dados derivados. Fonte: 04, pp. 7–8, 17–29, 38–49.

A aparência agradável não compensa uma representação sem aprendizado ou
enganosa. Médias e correlações semelhantes podem esconder distribuições muito
diferentes: examine padrões e extremos quando a pergunta os exigir.
Fonte: 01, pp. 18–21, 28, 33–39.

## Expressividade e efetividade

Expressividade: não introduza uma ordem, continuidade ou magnitude que os dados
não possuem; não omita relações importantes. Matiz e forma distinguem identidade;
posição, comprimento e luminância ordenada podem representar magnitude.
Linhas entre categorias sem continuidade sugerem tendências sem fundamento.
Separar categorias em regiões espaciais é válido; não equivale a tratá-las como
uma variável quantitativa. Fontes: 02, pp. 21–23; 10, pp. 16–17, 30–33.

Efetividade: reserve canais mais precisos à comparação principal. Para magnitude,
posição em escala comum geralmente favorece maior acurácia que posições
não alinhadas, comprimento, ângulo, área ou volume. O ranking é guia para a
tarefa, não proibição universal. Considere discriminabilidade, separabilidade,
popout e agrupamento; combinações de canais podem interferir entre si.
Fontes: 02, pp. 23, 31–45; 10, pp. 6–7.

## Cor e contexto

Use paleta categórica para identidade; sequencial com luminância ordenada para
magnitude; divergente com ponto central semanticamente justificado para desvios.
Evite rainbow para ordem quantitativa. Preserve o significado de cada cor entre
visões. Contraste depende do fundo e do tamanho da marca; não trate um número
de cores dos slides como limite universal. Reduza categorias ou use facetas e
rótulos quando a distinção falhar. Cor redundante com posição, forma ou texto
ajuda acesso à informação. Confira leitura sem depender somente de vermelho/verde
e em escala de cinza quando relevante; não afirme simulação sem executá-la.
Fonte: 20, pp. 23–29, 35–50, 56–65; 02, pp. 58–62.

## Comparação e complexidade

Comparações dependem de alinhamento, escalas e contexto comuns. Pequenos
múltiplos permitem comparar estados visíveis, reduzindo a necessidade de memória
em relação à alternância temporal; compartilhe domínios quando a comparação
absoluta for o objetivo. Domínios independentes devem ser explícitos.
Destaque coordenado preserva contexto; filtro remove itens. Agregação preserva
alguma informação do conjunto, mas esconde variação. Explicite o que ficou fora,
qual estatística resume e o caminho de volta aos detalhes. Não confunda mudar
seleção com mudar denominador. Fontes: 21, pp. 16–18, 21, 30–46;
25, pp. 10–17, 20–22, 28, 36–48.

## Integridade e evidência na aplicação

Como aplicação desses princípios, confira unidades, população, período,
denominador de taxas, agregação e amostras desiguais. Não substitua ausência por
zero nem conclua causalidade a partir de associação visual. Domínios que mudam
com filtros podem alterar a percepção; torne a comparação explícita. Não use
normalização para ocultar volume: exponha o total quando necessário à tarefa.

Separe fatos observados, riscos condicionais e hipóteses. Cite material e página
para a teoria, e artefato/linha/captura para o achado. Uma heurística de design
não equivale a teste com usuários; uma figura isolada não comprova a interação.
