# 10_cap_7_tabular_data

Extração textual do PDF correspondente. Páginas sem texto extraível podem conter imagens; a ordem e a formatação podem diferir do original.

## Página 1

Visualização de Dados Tabulares
Emanuele Santos
Bibliografia: VAD, cap. 7

## Página 2

Agenda
Introdução
Valores quantitativos (scatterplots e gráficos de bolha)
Regiões categóricas
Gráficos de barras, barras empilhadas, streamgraph, gráficos de
pontos e gráficos de linhas, mapas de calor (heatmaps) e matrizes
de scatterplots
Orientação de eixo espacial
Coordenadas paralelas, gráfico de barras radiais, gráfico
estrela, pie charts, polar area charts
Limitações e densidade de layout

## Página 3

Introdução
Encode
Arrange
Express
Separate
Order
Align
Use
Manipulate
Facet
Reduce
Change
Select
Navigate
Juxtapose
Partition
Superimpose
Filter
Aggregate
Embed
How?
Map
Color
Motion
Size, Angle, Curvature, ...
Hue
Saturation
Luminance
Shape
Direction, Rate, Frequency, ...
from categorical and ordered
attributes

## Página 4

Introdução
Encode
Arrange
Express
Separate
Order
Align
Use
How?

## Página 5

Introdução
Escolhas de
design para
como organizar
dados tabulares
espacialmente:

## Página 6

Introdução - Por que organizar espacialmente?
O uso de espaço domina o modelo mental do usuário
para o dataset.
Os três canais melhor ranqueados com respeito à
efetividade para atributos quantitativos e ordenados
são todos relacionados à posição espacial:
Posição planar com escala comum
Posição planar com escala desalinhada
Comprimento (length).

## Página 7

Introdução - Por que organizar espacialmente?
O canal melhor ranqueado para atributos categóricos
também é relacionado ao espaço:
Agrupamento de itens em uma mesma região.

## Página 8

Organizando por Chaves e Valores
A distinção entre chave e valor é muito relevante para a
codificação visual de dados tabulares.
Uma chave é um atributo independente que pode ser
usado como índice para identificar itens em uma tabela:
Podem ser categóricos ou ordinais.

## Página 9

Organizando por Chaves e Valores
Um valor é um atributo dependente: o valor de uma
célula em uma tabela:
Podem ser categóricos, ordinais ou quantitativos.
Os diferentes valores para um atributo categórico ou
ordinal são chamados de níveis.

## Página 10

Organizando por Chaves e Valores
As escolhas de design vão
depender da semântica dos
atributos das tabelas: Quantas
chaves e quantos valores
existem na tabela?

## Página 11

Organizando por Chaves e Valores
Idiomas que mostram somente valores, sem chave
(scatterplots);
Idiomas que mostram uma chave e um valor (barras);
Idiomas que mostram duas chaves e um valor (mapas de
calor);
Idiomas para muitas chaves e muitos valores (matrizes de
scatterplots);
Normalmente chaves são usadas para definir uma região no
espaço para cada item na qual os atributos-valores são
mostrados.

## Página 12

Expressando valores quantitativos
Mapeamento direto de valores de  
atributos em posição espacial:
Posicionamento de uma marcação ao longo de um eixo.
Outros atributos podem ser mapeados na mesma
marcação usando outros canais não espaciais (cor,
tamanho ou um glyph).
Exemplos:  
Scatterplots e gráficos de bolha.
Express Values

## Página 13

Sem chaves, apenas valores
Dados:  
2 atributos quantitativos
Marca: pontos
Canais:
Posições horizontal e vertical
Tarefas:
Achar tendências, outliers, distribuição, correlação, clusters.
Escala: Centenas de itens.
Idioma: Scatterplots
[A layered grammar of graphics. Wickham. Journ. Computational and Graphical Statistics 19:1
(2010), 3–28.]

## Página 14

Idioma: Scatterplots
[A layered grammar of graphics. Wickham. Journ. Computational and Graphical Statistics 19:1 (2010), 3–28.]
How to read a log scale

## Página 15

Idioma: Gráficos de Bolha
Scatterplots aumentados
com uso de tamanho e
cor.
Fonte: G. Robertson, R. Fernandez, D. Fisher, B. Lee and J. Stasko, "Effectiveness of Animation in
Trend Visualization," in IEEE Transactions on Visualization and Computer Graphics, vol. 14, no. 6,
pp. 1325-1332, Nov.-Dec. 2008, Figure 1-c.

## Página 16

Regiões categóricas
O uso do espaço para codificar atributos categóricos é
mais complexo do que no caso de atributos quantitativos.
Posição espacial é um canal visual de magnitude ordenada,
mas atributos categóricos não possuem ordem.
Princípio da expressividade seria violado.
Usar espaço para separar os dados em regiões.
Separate
Order
Align

## Página 17

Distribuição de regiões em 3 operações
A separação é feita de acordo com um atributo que é
categórico (itens com o mesmo valor de atributo ficam numa
mesma região).
A ordenação e o alinhamento são feitos de acordo com outro
atributo ordenado.
1 Key
2 Keys
3 Keys
Many Keys
List
Recursive Subdivision
Volume
Matrix

## Página 18

Idioma: Gráfico de barras
Uma chave, um valor.
Dados:  
1 atributo categórico e 1
atributo quantitativo.
Marca: linhas.
0
1
2
3
4
5
6
A
B
C
D
E

## Página 19

Idioma: Gráfico de barras
Canais:
Comprimento para expressar valor quantitativo.
Regiões espaciais: uma por marca
Separadas horizontalmente, alinhadas verticalmente
Ordenadas por atributo quantitativo: pelo label
(alfabeticamente) ou pelo atributo quantitativo.  
Tarefa: comparar, encontrar valores.
Escala: dezenas a centenas de níveis por atributo chave.
0
2
4
6
D
A
C
B
E

## Página 20

Idioma: Gráfico de barras empilhadas
Mais uma chave
Dados:  
2 atributos
categóricos e 1
atributo
quantitativo.
Marca: pilha vertical
de marcas de linhas.
https://observablehq.com/@d3/stacked-bar-chart

## Página 21

Idioma: Gráfico de barras empilhadas
Canais:
Comprimento e matiz de cor.
Regiões espaciais: uma por glyph
Alinhadas: glyph completo,  
componente mais baixo da barra;
Não alinhadas: os demais componentes da barra.
Tarefa: relacionamentos parte-todo (dados absolutos).
Escala: até uma dúzia de níveis por atributo empilhado

## Página 22

Idioma:
Streamgraph
Generalização do gráfico  
de barras empilhadas.
Enfatiza a continuidade  
horizontal.
Dados:  
1 atrib. chave cat. (filme)
1 atrib. chave ordenado (tempo)
1 atrib. valor quant. (bilheteria)
[Stacked Graphs Geometry & Aesthetics. Byron and Wattenberg. IEEE Trans. Visualization and Computer
Graphics (Proc. InfoVis 2008) 14(6): 1245–1252, (2008).

## Página 23

Idioma: Streamgraph
Dados derivados:
Geometria: camadas, onde  
a altura codifica valor  
arrecadado por semana
1 atrib. quant. (ordem das  
camadas)
Escala:
Centenas de chaves temporais
Dezenas a centenas de chaves de filme (mais do que no
gráfico de barras empilhadas).
[Stacked Graphs Geometry & Aesthetics. Byron and Wattenberg. IEEE Trans. Visualization and
Computer Graphics (Proc. InfoVis 2008) 14(6): 1245–1252, (2008).

## Página 24

www.nytimes.com/interactive/2008/02/23/movies/20080223_REVENUE_GRAPHIC.html?_r=0

## Página 25

https://www.ft.com/coronavirus-latest

## Página 26

https://www.ft.com/coronavirus-latest

## Página 27

[Sem texto extraível nesta página.]

## Página 28

Idioma: Gráfico
de pontos
Uma chave, um valor
Dados:  
1 atrib. chave ordenado
e 1 atrib. valor quant.
Marca: pontos.

## Página 29

Idioma: Gráfico de pontos
Canais:
Posições alinhadas para expressar
valor quantitativo.
Separados e ordenados pelo atributo
chave em regiões verticais.
Tarefa: encontrar e comparar valores.
Escala: dezenas a centenas de níveis
por atributo chave.

## Página 30

Idioma: Gráfico de linhas
Uma chave, um valor
Dados:  
1 atrib. chave ordenado e  
1 atrib. valor quant.
Marca: pontos
Conexão de marcas em linhas  
entre pontos.
0
25
50
75
100
2010
2011
2012
2013

## Página 31

Idioma: Gráfico de linhas
Canais:
Posições alinhadas verticalmente  
para expressar valor quantitativo;
Separados e ordenados pelo atributo chave em regiões
horizontais.
Tarefa: achar tendências
As linhas enfatizam a ordem dos itens e o
relacionamento entre itens.
Escala: centenas de níveis por atributo chave.
0
25
50
75
100
2010
2011
2012
2013

## Página 32

Escolhendo entre gráficos de
barras e gráficos de linhas
after [Bars and Lines: A Study of Graphic Communication. Zacks and Tversky. Memory and Cognition 27:6 (1999), 1073–1079.]
Female Male
60
50
40
30
20
10
0  
Female Male
60
50
40
30
20
10
0  
10-year-olds 12-year-olds
60
50
40
30
20
10
0  
60
50
40
30
20
10
0  
10-year-olds 12-year-olds

## Página 33

Escolhendo entre gráficos de
barras e gráficos de linhas
after [Bars and Lines: A Study of Graphic Communication. Zacks and
Tversky. Memory and Cognition 27:6 (1999), 1073–1079.]
Female Male
60
50
40
30
20
10
0  
Female Male
60
50
40
30
20
10
0  
10-year-olds 12-year-olds
60
50
40
30
20
10
0  
60
50
40
30
20
10
0  
10-year-olds 12-year-olds
Depende do tipo do atributo chave:
Categórico: barras;
Ordenados: linhas.
Não usar gráficos de linhas para atributos-chave categóricos
Violação do princípio da expressividade
Implicação de tendência é tão forte que sobrescreve a
semântica:
“Quanto mais masculina a pessoa for, mais alta ela é”

## Página 34

Diferentes representações dos mesmos
dados produzem interpretações diferentes
after [The Arrangement of Marks Impacts Afforded Messages: Ordering, Partitioning, Spacing, and Coloring in Bar Charts. R. Fygenson, S. Franconeri and E. Bertini,
in IEEE TVCG, vol. 30, no. 1, pp. 1008-1018, Jan. 2024]

1. “East companies’ sales are 70% clips.”
2. “In the West, companies sold more clips than staples.”

## Página 35

Idioma: Mapas de calor (heatmaps)
Duas chaves, um valor
Dados:  
2 atrib. categóricos (hora, dia da semana)
1 atrib. quant. (número de pessoas acidentadas)
Marca: área
Separar e alinhar em matriz 2D
Indexados pelos 2 atributos
categóricos.
2 Keys
Matrix

## Página 36

Idioma: Mapas de calor (heatmaps)
Canais:
Cor pelo atributo quantitativo  
Tarefa: encontrar clusters, outliers.
Escala: 1M de itens, 100s de níveis categóricos, ~10 níveis de
atributos quantitativos.

## Página 37

Idioma: Matriz de Scatterplots (SPLOM)
Uma matriz onde cada célula contém um gráfico de
scatterplot completo.
Uma SPLOM mostra todas as combinações de
pares de atributos.
A chave é um atributo derivado
simples que é o mesmo para linhas e
colunas: um índice listando todos os
atributos do dataset.

## Página 38

Tarefa: encontrar correlações,
tendências e outliers.
Idioma: Matriz de Scatterplots
(SPLOM)
Normalmente, apenas um triângulo da
matriz é mostrado com os nomes dos
atributos na diagonal.
Escala: Aproximadamente
uma dúzia de atributos e
centenas de itens.

## Página 39

Orientação de eixo espacial
Rectilinear
Parallel
Radial

## Página 40

Idioma: Coordenadas paralelas
Visualizar muitos atributos quantitativos de uma vez usando
posição espacial.
Dados:  
Vários atributos valor.
Math
Physics
Dance
Drama
100
90
80
70
60
50
40
30
20
10
0  
Parallel Coordinates
Math
Physics
Dance
Drama
85
90
65
50
40
95
80
50
40
60
70
60
90
95
80
65
50
90
80
90
Table

## Página 41

Idioma: Coordenadas paralelas
Layout paralelo:
Posição espacial horizontal usada para separar eixos;
Posição espacial vertical expressa o valor do atributo ao
longo de cada eixo alinhado.
Marcas em linhas conectam os atributos de um mesmo
item.
Tarefa: encontrar tendências, outliers, extremos, correlação.
Escala: dezenas de atributos ao longo do eixo secundário e
centenas de itens.

## Página 42

Coordenadas
paralelas
https://observablehq.com/@d3/brushable-parallel-coordinates

## Página 43

Tarefa: correlação usando SPLOM
[A layered grammar of graphics. Wickham. Journ. Computational and Graphical Statistics 19:1 (2010), 3–28.]
Correlação positiva
Diagonal de baixo pra cima
Correlação negativa
Diagonal de cima pra baixo
Não correlacionados

## Página 44

Tarefa: correlação usando
coordenadas paralelas
Correlação positiva:
Segmentos de retas paralelos.
Correlação negativa:
Todos os segmentos se cruzam no
meio.
Não correlacionados:  
Cruzamentos espalhados
[Hyperdimensional Data Analysis Using Parallel Coordinates. Wegman. Journ. American Statistical
Association 85:411 (1990), 664–675.]

## Página 45

Gráfico de barras radiais
Eixos radiais se encontram no anel central,
marcação em linha
Gráfico estrela
Eixos radiais se encontram no ponto central,
marcação em linha
Gráfico de barras
Eixos retilíneos, alinhados verticalmente
Idiomas: Gráfico de barras radiais,
gráfico estrela

## Página 46

Acurácia
Comprimento desalinhado com posição radial é menos
acurado do que alinhado com posição retilínea.
Idiomas: Gráfico de barras radiais,
gráfico estrela

## Página 47

Pie chart
Marcações área com canal ângulo (ou arco)
Acurácia: ângulo/área muito menos acurado do
que comprimento de linha
Polar area chart
Marcas de área com canal comprimento
Analogia mais direta com gráficos de barras
Idiomas: Pie chart, polar area chart
[A layered grammar of graphics. Wickham. Journ. Computational and Graphical Statistics 19:1 (2010), 3–28.]

## Página 48

Dados
1 atrib. chave cat., 1 atrib. valor quant.
Tarefa:
Julgamentos parte-todo.
Idiomas: Pie chart, polar area chart
[A layered grammar of graphics. Wickham. Journ. Computational and Graphical Statistics 19:1 (2010), 3–28.]

## Página 49

Estudos sobre o Pie Chart
Robert Kosara, Drew Skau,
Judgment Error in Pie Chart Variations,
Short Paper Proceedings of the Eurographics/IEEE VGTC Symposium on Visualization (EuroVis),
pp. 91–95, 2016. DOI: 10.2312/eurovisshort.20161167
Drew Skau, Robert Kosara,
Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts,
Computer Graphics Forum (Proceedings EuroVis), vol. 35, no. 3, pp. 121–130, 2016. DOI:
10.1111/cgf.12888

## Página 50

Tarefa:
Julgamento parte do todo
Gráfico de barras empilhadas normalizadas:
Gráfico de barras empilhadas, normalizadas para o tamanho
máximo da barra.
Idiomas: Gráfico de barras empilhadas
normalizadas
UT TX ID AZ NV GA AK MSNMNE CA OK SDCO KSWYNC AR LA IN IL MNDE HI SCMOVA IA TN KY AL WAMDNDOH WI OR NJ MT MI FL NY DC CT PA MAWV RI NHME VT
0%
10%
20%
30%
40%
50%
60%
70%
80%
90%
100%
Under 5 Years
5 to 13 Years
14 to 17 Years
18 to 24 Years
25 to 44 Years
45 to 64 Years
65 Years and Over
CA TX NY FL IL PA OH MI GA NC NJ VA WA AZ MA IN TN MO MD WI MN CO AL SC LA KY OR OK CT IA MS AR KS UT NV NMWV NE ID ME NH HI RI MT DE SD AK ND VT DC WY
0.0
5.0M
10M
15M
20M
25M
30M
35M
Population
65 Years and Over
45 to 64 Years
25 to 44 Years
18 to 24 Years
14 to 17 Years
5 to 13 Years
Under 5 Years
http://bl.ocks.org/mbostock/3886208,  
http://bl.ocks.org/mbostock/3886394.

## Página 51

Uma única barra é equivalente a um
pie chart completo.
Alta densidade de informação: requer
retângulo estreito
Densidade de informação em um pie
chart: requer círculo grande.
Idiomas: Gráfico de barras empilhadas
normalizadas
<5
5-13
14-17
18-24
25-44
45-64
≥65
UT TX ID AZ NV GA AK MSNMNE CA OK SDCO KSWYNC AR LA IN IL MNDE HI SCMOVA IA TN KY AL WAMDNDOH WI OR NJ MT MI FL NY DC CT PA MAWV RI NHME VT
0%
10%
20%
30%
40%
50%
60%
70%
80%
90%
100%
Under 5 Years
5 to 13 Years
14 to 17 Years
18 to 24 Years
25 to 44 Years
45 to 64 Years
65 Years and Over
http://bl.ocks.org/mbostock/3887235,
http://bl.ocks.org/mbostock/3886394.

## Página 52

Limitações de orientação
Axis Orientation
Rectilinear
Retilíneo: escala com relação ao número de eixos
2 eixos: melhor caso
3: problemático
4+: impossível

## Página 53

Limitações de orientação
Axis Orientation
Rectilinear
Parallel
Radial
[Uncovering Strengths and Weaknesses of Radial Visualizations - an Empirical Approach. Diehl, Beck and Burch. IEEE TVCG (Proc.
InfoVis) 16(6):935--942, 2010.]
Paralelo: não familiar, tempo de treinamento
Radial: limites perceptivos
Assimetria: menor precisão com ângulos do
que com comprimentos.

## Página 54

Densidade de
layout
Layout Density
Dense
Dense Software Overviews
[Visualization of test information to assist fault localization. Jones, Harrold, Stasko. Proc. ICSE
2002, p 467-477.]
