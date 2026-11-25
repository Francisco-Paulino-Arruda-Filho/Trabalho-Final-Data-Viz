# 25_cap_11_12_complexity_strategies_part2

Extração textual do PDF correspondente. Páginas sem texto extraível podem conter imagens; a ordem e a formatação podem diferir do original.

## Página 1

Lidando com complexidade em
Visualizações - Parte 2
Emanuele Santos
Bibliografia: VAD, caps. 13 e 14

## Página 2

Agenda
Motivação
Estratégias:
Visão que muda com o tempo
Usando múltiplas visões
Redução de itens e atributos
Foco + contexto

## Página 3

Recapitulação…

## Página 4

Estratégias básicas para lidar com a
complexidade 0. Derivar novos dados
Derive
Já foi abordado em
abstração de dados

## Página 5

Estratégias básicas para lidar com a
complexidade

1. Visão que muda com o
   tempo
   Manipulate
   Change
   Select
   Navigate

## Página 6

Estratégias básicas para lidar com a
complexidade 2. Particionar os dados em
múltiplas visões
Facet
Juxtapose
Partition
Superimpose

## Página 7

Estratégias básicas para lidar com a
complexidade 3. Reduzir a quantidade de
dados a ser exibida em uma
visão
Reduce
Filter
Aggregate

## Página 8

Estratégias básicas para lidar com a
complexidade 4. Embutir informações de
foco e contexto dentro de
uma única visão
Embed

## Página 9

3. Reduzindo itens e atributos

## Página 10

Redução
Reduzir a quantidade de dados exibida
em uma visão é uma maneira óbvia de
reduzir a sua complexidade visual.
A dificuldade está em minimizar as
chances de que informação
importante para a tarefa esteja
escondida para o usuário.
Reduce
Filter
Aggregate

## Página 11

Redução
A redução pode ser aplicada
tanto para itens quanto para
atributos.
Filtrar simplesmente elimina
elementos.
Agregar cria um único novo
elemento pela combinação de
outros elementos.
Reducing Items and Attributes
Filter
Items
Attributes
Reduce
Filter
Aggregate
Embed
Aggregate
Items
Attributes

## Página 12

Filtrar ou Agregar?
Filtrar é muito direto para os usuários entenderem e
também fácil de implementar.
Problema: “O que os olhos não veem…”: as pessoas
tendem a desprezar os elementos que não estão visíveis,
podendo introduzir erros.

## Página 13

Filtrar ou Agregar?
Agregar pode ser um pouco mais seguro do ponto de vista
cognitivo, pois o elemento resultante da agregação ainda
possui informação sobre todos os elementos que ele
substitui.
Porém, por definição, ele não transmite toda a informação
omitida.
Desafio: como e o que sumarizar de maneira que se adeque
aos dados e à tarefa em questão.
Filtrar e agregar não são mutuamente exclusivos, podem ser
combinados.

## Página 14

Filtros

## Página 15

Idioma: Filtro dinâmico
Desafio: projetar um sistema de
visualização onde filtragem pode
ser usada para explorar
efetivamente um conjunto de
dados.
Queries dinâmicas:
Interação e codificação visual
fortemente acopladas.
Usuário pode ver o resultado da
intervenção imediatamente.
[Visual information seeking: Tight coupling of dynamic
query filters with starfield displays. Ahlberg and
Shneiderman. Proc. ACM Conf. on Human Factors in
Computing Systems (CHI), pp. 313–317, 1994.]

## Página 16

Idioma: Filtro dinâmico
Sistema: FilmFinder
[Visual information seeking: Tight coupling of dynamic query filters with starfield displays. Ahlberg and Shneiderman. Proc. ACM Conf. on
Human Factors in Computing Systems (CHI), pp. 313–317, 1994.]
Filtro de itens

## Página 17

Idioma: scented widgets
Widgets comuns podem ser estendidos para mostrar dicas de
informação sobre o dataset.
Concisos, usam o mínimo de espaço adicional para conter alta
densidade de informação (no próprio painel de controle).
Essas dicas ajudam um pesquisador a decidir se deve
aprofundar-se mais na busca em uma dada fonte ou se deve
partir para outra fonte.
[Scented Widgets: Improving Navigation Cues with Embedded Visualizations. Willett, Heer, and Agrawala. IEEE Trans. Visualization and Computer Graphics
(Proc. InfoVis 2007) 13:6 (2007), 1129–1136.]

## Página 18

Idioma: DOSFA
DOSFA: Dimensional Ordering,
Spacing, and Filtering Approach
Filtro de atributos
Codificação: plot estrela
Sistema: DOSFA
[Interactive Hierarchical Dimension Ordering, Spacing and Filtering for Exploration Of High Dimensional Datasets. Yang, Peng,Ward, and.
Rundensteiner. Proc. IEEE Symp. Information Visualization (InfoVis), pp. 105–112, 2003.]

## Página 19

Agregação

## Página 20

Idioma: Histograma
Agregação estática de itens
Tarefa: descobrir distribuição
Dados: Tabela
Dados derivados:
Nova tabela: chaves são os bins, valores são contagens
Número de bins é fundamental.
Padrão pode mudar completamente dependendo da
discretização.
Oportunidade para interação: número de bins pode ser alterado
na visualização.

## Página 21

Agregação estática de itens.
Tarefa: descobrir/comunicar
distribuição através de seus quartis.
Dados: Tabela
Dados derivados: 5 atributos
quantitativos
Menor valor, Primeiro Quartil (Q1),
Mediana (Q2), Terceiro Quartil (Q3) e
Maior valor.
Valores além dos limites são
considerados outliers.
Idioma: Boxplot
https://datavizcatalogue.com/methods/box_plot.html
Limite
inferior
outlier
outlier
Limite
superior
Menor valor
Maior valor
Mediana (Q2)
Q3
Q1
IQR
1.5(IQR)
1.5(IQR)

## Página 22

Podem mascarar a
variabilidade e a densidade
real dos dados.
Para públicos não
especializados, sua leitura
pode ser difícil e levar a
interpretações equivocadas.
Limitações do boxplot
https://nightingaledvs.com/ive-stopped-using-box-plots-should-you/
https://nightingaledvs.com/i-stopped-using-box-plots-the-aftermath/

## Página 23

Boxplot: Variantes
[40 years of boxplots. Wickham and Stryjewski. 2012. had.co.nz]
Bean plot
Box plot
Vase plot
Violin plot

## Página 24

Boxplot: Variantes
Bee swarm box plot
http://datavizcatalogue.com/blog/box-plot-variations/
Letter-value box plot
Box-Percentile plot

## Página 25

Boxplot em
D3
https://observablehq.com/@akngs/box-plot-explained

## Página 26

Boxplot em
D3
https://observablehq.com/@akngs/d3-boxplot

## Página 27

Idioma: Coordenadas paralelas hierárquicas
Agregação dinâmica de itens.
Dados derivados: cluster hierárquico.
Codificação: Faixa do cluster com transparência variável, linha
na média, largura pelos valores máximo e mínimo e cor pela
proximidade na hierarquia.
[Hierarchical Parallel Coordinates for Exploration of Large Datasets. Fua, Ward, and Rundensteiner. Proc. IEEE Visualization Conference (Vis ’99), pp. 43– 50, 1999.]

## Página 28

Agregação espacial
O desafio na agregação espacial é considerar corretamente a
natureza espacial dos dados ao agregá-los.
Em cartografia, MAUP: Modifiable Areal Unit Problem (MAUP) é um
grande problema.
Alterando as bordas das regiões gera resultados bastante diferentes
http://gispopsci.org/maup/

## Página 29

Redução de dimensionalidade (DR)
Agregação de atributos.
Derivar espaço de baixa dimensão a partir de espaço de alta dimensão
medido.
Usada quando você não consegue medir diretamente o que é
importante.
A dimensionalidade verdadeira do dataset é conjecturada para ser
menor do que a dimensionalidade das medições.
Fatores latentes, variáveis escondidas.
Dados de medições
de tumores
DR
Maligno
Benigno
dados: espaço medido 9D
dados derivados: espaço 2D

## Página 30

Redução de dimensionalidade para
documentos
Task 1
In
HD data
Out
2D data
Produce
In High-
dimensional data
Why?
What?
Derive
Out 2D data
In
2D data
Task 2
How?
Why?
What?
Encode
Navigate
Select
Discover
Explore
Identify
In 2D data
Out Scatterplot
Out Clusters &
points
Out
Scatterplot
Clusters & points
Task 3
In
Scatterplot
Clusters & points
Out
Labels for
clusters
Why?
What?
Produce
Annotate
In Scatterplot
In Clusters & points
Out Labels for
clusters
wombat

## Página 31

Stephen Ingram, Tamara Munzner, and Marc Olano. “Glimmer: Multilevel MDS on the GPU.” IEEE Transactions on Visualization and Computer
Graphics 15:2 (2009), 249–261.

## Página 32

Como mostrar dados de DR?
Em técnicas de Redução de Dimensionalidade padrão, o
usuário escolhe o número de atributos criados:
2 atributos: scatterplot
Mais de 2 atributos: matriz de scatterplot (SPLOM)
Objetivo ao analisar os scatterplots gerados para visualizar
dados DR não é achar correlação, é verificar ou descobrir se os
dados formam clusters significativos e verificar se os novos
atributos sintéticos são significativos.
Para isso é importante poder selecionar um ponto no
scatterplot e inspecionar os dados de alta dimensão que ele
representa.

## Página 33

Como mostrar dados de DR?
Quando existe uma categorização dos
pontos, esses podem ser coloridos de acordo
com essa categorização.
Tarefa: checar se os padrões de cor
combinam com os padrões dos cluster
espaciais dos dados reduzidos.
Apenas a distância relativa é o que importa.
Estudos empíricos indicam que a matriz de
scatterplot é o método mais seguro para
inspecionar dados de redução de
dimensionalidade.
Michael Sedlmair, Tamara Munzner, and Melanie Tory. “Empirical Guidance on Scatterplot and Dimension Reduction Technique
Choices.” IEEE Transactions on Visualization and Computer Graphics (Proc. InfoVis 13) 19:12 (2013), 2634–2643.
Stephen Ingram, Tamara Munzner, and Marc
Olano. “Glimmer: Multilevel MDS on the GPU.”
IEEE Transactions on Visualization and Computer
Graphics 15:2 (2009), 249–261.

## Página 34

Redução de dimensionalidade x
redução de atributos
Vocabulário utilizado inconsistentemente na área
Dimensão/atributo
Redução de atributos: reduzir conjunto de atributos através de
filtragem
Inclui projeção ortográfica
Redução de dimensionalidade: criar um conjunto menor de
dimensões/atributos
Implica em algum tipo de agregação e não filtragem

## Página 35

4. Foco+Contexto

## Página 36

Embutir: Foco+Contexto
Família de idiomas Foco+Contexto:  
Embutir informação detalhada sobre um
conjunto selecionado (foco) dentro de uma
única visão que também contém
informações gerais sobre mais dados
(contexto)
Reduzir a quantidade de dados mostrados
na visão usando combinação sofisticada de
filtro e agregação.
Embed

## Página 37

Escolhas de design:
Elisão
Filtrar e agregar seletivamente
Apenas os elementos em foco são  
mostrados em detalhe
Sobreposição de camadas
Lente local
Distorção de geometria
Regiões de contexto são comprimidas para abrir espaço
para regiões de foco aumentadas
Embed
Elide Data
Superimpose Layer
Distort Geometry

## Página 38

Por que embutir foco+contexto?
A ideia é mitigar o potencial para desorientação proveniente de
técnicas de navegação comuns, tais como o zoom geométrico
Idiomas de Foco+contexto são exemplos de navegação não
literal (análogos ao zoom semântico que estudamos
anteriormente)
Interação e codificação visual fortemente acopladas
Conjunto em foco muda dinamicamente à medida que o
usuário interage com o sistema

## Página 39

Elisão

## Página 40

Idioma: DOITrees Revisited
Alguns itens são dinamicamente filtrados (ocultos).
Alguns itens são dinamicamente agregados.
Alguns itens são mostrados
em detalhe (foco).
[DOITrees Revisited: Scalable, Space-Constrained Visualization of Hierarchical Data. Heer and Card. Proc. Advanced Visual Interfaces (AVI), pp. 421–424, 2004.]

## Página 41

Sobreposição de camadas

## Página 42

Idioma: Lente
mágica
Interface transparente genérica
localizada entre a aplicação e o
cursor
Detalhes das trajetórias sob a
lente são mostrados na lente ou
ao lado
Krüger et al, 2013. TrajectoryLenses - a set-based filtering and exploration technique
for long-term trajectory data. In Proceedings of the 15th Eurographics Conference on
Visualization (EuroVis '13). pp 451-460.

## Página 43

TrajectoryLenses
Krüger et al, 2013. TrajectoryLenses - a set-based filtering and exploration technique for long-term trajectory data. In Proceedings of the 15th
Eurographics Conference on Visualization (EuroVis '13). pp 451-460.
https://www.youtube.com/watch?v=4Ju2Hj7aicw

## Página 44

Distorção de geometria

## Página 45

Distorção de geometria
Escolhas de design:
Forma da região: radial, retilínea, complexa
Quantas regiões? Uma, muitas
Extensão ou impacto da região: local, global
Metáfora de interação

## Página 46

Idioma: Fisheye Lens
Distorção de geometria
Forma: radial
Foco: única região
Impacto: local
Metáfora:
mover  
uma lente
de aumento
tipo olho de
peixe
http://tulip.labri.fr/TulipDrupal/?q=node/351
http://tulip.labri.fr/TulipDrupal/?q=node/371

## Página 47

Idiom: Stretch and Squish Navigation
Distorção de
geometria
Forma: retilínea
Foco: múltiplo
Impacto: global
Metáfora: efeito
sanfona, borda fixa
[TreeJuxtaposer: Scalable Tree Comparison Using Focus+Context With Guaranteed Visibility.
Munzner, Guimbretiere, Tasiran, Zhang, and Zhou. ACM Transactions on Graphics (Proc.
SIGGRAPH) 22:3 (2003), 453– 462.]
Sistema: TreeJuxtaposer

## Página 48

Distorção:
Custos e benefícios
Benefícios: combinam
foco+contexto numa única visão
Comparações de topologia de
rede não são afetadas: conexão,
contenção
Custos
Comparações de tamanho
prejudicadas; efeitos de
distorção não são claros se a
estrutura original não for familiar
e constância/rastreamento do
objeto pode ser prejudicado
[Living Flows: Enhanced Exploration of Edge-Bundled Graphs Based on GPU-Intensive Edge Rendering.
Lambert, Auber, and Melançon. Proc. Intl. Conf. Information Visualisation (IV), pp. 523–530, 2010.]
Lente olho de peixe
Lente de aumento
Sobreposição de vizinhança Bring and Go
