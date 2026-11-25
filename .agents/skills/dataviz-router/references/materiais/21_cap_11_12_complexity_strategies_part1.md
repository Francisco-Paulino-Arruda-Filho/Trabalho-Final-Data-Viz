# 21_cap_11_12_complexity_strategies_part1

Extração textual do PDF correspondente. Páginas sem texto extraível podem conter imagens; a ordem e a formatação podem diferir do original.

## Página 1

Lidando com complexidade em
Visualizações (Parte 1)
Emanuele Santos
Bibliografia: VAD, caps. 11 e 12

## Página 2

Agenda
Motivação
Estratégias:
Visão que muda com o tempo
Usando múltiplas visões
Redução de itens e atributos (parte 2)
Foco + contexto (parte 2)

## Página 3

Motivação

## Página 4

https://nbremer.github.io/ORCA/top-contributor-network/

## Página 5

[Sem texto extraível nesta página.]

## Página 6

Estratégias básicas para lidar com a
complexidade 0. Derivar novos dados
Derive
Já foi abordado em
abstração de dados

## Página 7

Estratégias básicas para lidar com a
complexidade

1. Visão que muda com o
   tempo
   Manipulate
   Change
   Select
   Navigate

## Página 8

Estratégias básicas para lidar com a
complexidade 2. Particionar os dados em
múltiplas visões
Facet
Juxtapose
Partition
Superimpose

## Página 9

Estratégias básicas para lidar com a
complexidade 3. Reduzir a quantidade de
dados a ser exibida em uma
visão
Reduce
Filter
Aggregate

## Página 10

Estratégias básicas para lidar com a
complexidade 4. Embutir informações de
foco e contexto dentro de
uma única visão
Embed

## Página 11

1. Visão que muda com o tempo

## Página 12

Manipulando Visões
Visão que muda com o
tempo é a estratégia mais
óbvia, mais popular e mais
flexível.
Navigate
Item Reduction
Zoom
Pan/Translate
Constrained
Geometric or Semantic
Attribute Reduction
Slice
Cut
Project
Change over Time
Select

## Página 13

Maneiras de mudar uma visão
As maneiras de mudar uma visão incluem o conjunto de todas
as escolhas de design para idiomas de visualização.
O que se pode mudar:
Idiomas (mudar de um scatter plot para um gráfico de pontos)
Parâmetros de um idioma
Qualquer aspecto de codificação visual (ordem, organização
espacial, mapeamento de cor)
Os elementos a serem filtrados
Nível de detalhe da agregação

## Página 14

Idioma: Recodificar
Feito no Tableau, http://tableausoftware.com
Alterando a codificação de barras para barras empilhadas.

## Página 15

Idioma: Recodificar
Feito no Tableau, http://tableausoftware.com
Mudando completamente a codificação visual.

## Página 16

Idioma: Reordenar
[LineUp: Visual Analysis of Multi-Attribute Rankings. Gratzl, Lex, Gehlenborg, Pfister, and Streit. IEEE Trans. Visualization and Computer Graphics (Proc. InfoVis 2013) 19:12 (2013), 2277–2286.]
dados: tabelas
tarefa: comparar rankings

## Página 17

Idioma: Realinhar
[LineUp: Visual Analysis of Multi-Attribute Rankings. Gratzl, Lex, Gehlenborg, Pfister, and Streit. IEEE Trans. Visualization and Computer Graphics (Proc. InfoVis 2013) 19:12 (2013), 2277–2286.]
Barras empilhadas
Fáceis de comparar
Primeiro segmento
Barra total
Alinhamento para um segmento
diferente
Dá suporte à comparação flexível

## Página 18

Idioma: transições animadas
Transição suave de um estado para outro
Alternativa a cortes
Dá suporte a rastreio de items quando em quantidades limitadas
Exemplo: Visão multinível de matrizes
O escopo do que é mostrado é alterado suavemente
[Using Multilevel Call Matrices in Large Software Projects. van Ham. Proc. IEEE Symp. Information Visualization (InfoVis), pp. 227–232, 2003.]

## Página 19

https://observablehq.com/@fil/hello-reorder-js

## Página 20

Idioma: Transições animadas
https://www.abc.net.au/news/2022-06-29/census-australia-as-100-people/101181614

## Página 21

Selecionar e enfatizar
Selecionar: operação básica para a maioria das interações.
Escolhas de design:
Quantos tipos de seleção?
Clicar x Passar o mouse por cima.
Ênfase: mudar codificação visual dos alvos da seleção:
Cor: Limitação com respeito ao mapa de cor existente (pode
haver conflitos)
Outros canais: (ex. movimento)
Adicionar marcas de conexão explícitas entre os itens
selecionados.
Select

## Página 22

[LineUp: Visual Analysis of Multi-Attribute Rankings. Gratzl, Lex, Gehlenborg, Pfister, and Streit. IEEE Trans. Visualization and Computer
Graphics (Proc. InfoVis 2013) 19:12 (2013), 2277–2286.]
A seleção é representada pela linha cinza.

## Página 23

Navegar: alterar visibilidade dos itens
Navegar é mudar o ponto de vista
Mudar os itens que estão visíveis em
uma dada visão
Metáfora com uma câmera
Pan/transladar
Zoom geométrico ou semântico
Rotação (em 3D)
Navegação dirigida: uso de transições
animadas
Navigate
Item Reduction
Zoom
Pan/Translate
Constrained
Geometric or Semantic

## Página 24

Idioma: Zoom
semântico
Mudança da codificação
visual
Caixa colorida
Sparkline
Diagrama simples de
linha
Diagrama completo com
eixos e ticks
[LiveRAC - Interactive Visual Exploration of System Management Time-Series Data. McLachlan, Munzner, Koutsofios, and North. Proc. ACM Conf. Human
Factors in Computing Systems (CHI), pp. 1483–1492, 2008.]

## Página 25

Navegar: reduzir atributos
Continuação da metáfora de câmera
Fatiar: mostra apenas elementos
que possuem um determinado valor
de atributo (ex. Plano de corte).
Cortar: mostra apenas elementos
do lado de trás do plano de corte (a
partir da câmera).
Projetar: altera a matemática da
criação da imagem
Ortográfica, Perspectiva, Mercator,
etc.
Attribute Reduction
Slice
Cut
Project
[Interactive Visualization of Multimodal Volume Data for Neurosurgical
Tumor Treatment. Rieder, Ritter, Raspe, and Peitgen. Computer Graphics
Forum (Proc. EuroVis 2008) 27:3 (2008), 1055–1062.]

## Página 26

https://github.com/d3/d3/wiki/Geo-Projections
https://observablehq.com/collection/@d3/d3-geo-projection

## Página 27

https://observablehq.com/@vega/vega-lite-cartographic-projections

## Página 28

2. Usando múltiplas visões

## Página 29

Facet
Facet
Juxtapose
Partition
Superimpose
Facet significa dividir
Estudaremos as escolhas de design
que envolvem dividir o display em:
Múltiplas visões
Múltiplas camadas

## Página 30

Motivação
Comparar duas visões que estão visíveis simultaneamente é
relativamente fácil:
Podemos mover nossos olhos entre as duas visões e
comparar os seus estados
Observação: quando duas visões são mostradas lado a lado,
cada uma só pode ocupar metade da área que uma única visão
ocuparia.
Trade-off entre escassez de espaço de tela e a memória de
trabalho do usuário é o que vai definir entre usar justaposição
de visões e uma visão que muda com o tempo.

## Página 31

Coordenação de visões justapostas
Share Data: All/Subset/None
Como coordenar as visões?

1. Os canais visuais são
   compartilhados entre as
   visões?
2. Linked highlighting é
   usado entre as visões?
3. Como os dados são
   compartilhados entre elas?
4. A navegação é
   sincronizada?
   Share Encoding: Same/Different
   Linked Highlighting
   Share Navigation

## Página 32

Escolhas de Design de como coordenar
visões justapostas
All
Subset
Same
Multiform
Multiform,
Overview/
Detail
None
Redundant
No Linkage
Small Multiples
Overview/
Detail

## Página 33

Idioma: Linked highlighting
Itens selecionados
interativamente em uma
visão são imediatamente
highlighted nas outras
visões
Observe que regiões
contíguas em uma visão
estão distribuídas em
outras visões
Codificação: diferente
Multiforme
Dados: todos
compartilhados
Sistema: EDV
[Visual Exploration of Large Structured Datasets. Wills. Proc. New Techniques and Trends in
Statistics (NTTS), pp. 237–246. IOS Press, 1995.]

## Página 34

Idioma: mapas de ‘olho de pássaro’
Codificação: mesma
Dados: subconjunto
compartilhado
Navegação:
compartilhada
Link bidirecional
Diferenças
Ponto de vista
(tamanho)
overview-detail
Sistema: Google Maps
[A Review of Overview+Detail, Zooming, and Focus+Context Interfaces. Cockburn, Karlson, and Bederson.  
ACM Computing Surveys 41:1 (2008), 1–31.]

## Página 35

Idioma: Pequenos múltiplos
Codificação: mesma
Dados: nada
compartilhado
Na visão maior, cores
indicam diferenças
nos valores dos dois
pequenos múltiplos
selecionados
Navegação:
compartilhada
Sistema: Cerebral
[Cerebral: Visualizing Multiple Experimental Conditions on a
Graph with Biological Context. Barsky, Munzner, Gardy, and
Kincaid. IEEE Trans. Visualization and Computer Graphics
(Proc. InfoVis 2008) 14:6 (2008), 1253–1260.]

## Página 36

Sistema: Cerebral
Idioma: Pequenos múltiplos
Codificação: mesma
Dados: nada
compartilhado
Na visão maior, cores
indicam diferenças
nos valores dos dois
pequenos múltiplos
selecionados
Navegação:
compartilhada
[Cerebral: Visualizing Multiple Experimental Conditions on a
Graph with Biological Context. Barsky, Munzner, Gardy, and
Kincaid. IEEE Trans. Visualization and Computer Graphics
(Proc. InfoVis 2008) 14:6 (2008), 1253–1260.]

## Página 37

Usa o limite do
número de visões,
complexidade de
interação
Listas
reordenáveis
Fácil lookup
Úteis quando
linkadas a outras
codificações
visuais.
[Building Highly-Coordinated Visualizations In Improvise. Weaver. Proc. IEEE Symp. Information
Visualization (InfoVis), pp. 159–166, 2004.]
Sistema: Improvise

## Página 38

Outras Escolhas de Design em
Visões Justapostas
Número de visões
Poucas x Muitas
Quantas visões são demais? (Ainda é um problema aberto)
Visibilidade das visões
Sempre lado-a-lado x pop-ups temporários
Organização das visões
Alinhadas pelo usuário x Alinhamento automático

## Página 39

Particionamento: Alinhamento de listas
Único gráfico com barras agrupadas
Divisão por estado em regiões
Marca complexa dentro de cada região
mostrando todas as idades
Comparação: fácil dentro de um estado,
difícil entre estados
11.0
10.0
9.0
8.0
7.0
6.0
5.0
4.0
3.0
2.0
1.0
0.0  
CA
TK
NY
FL
IL
PA
65 Years and Over
45 to 64 Years
25 to 44 Years
18 to 24 Years
14 to 17 Years
5 to 13 Years
Under 5 Years
CA
TK
NY
FL
IL
PA
0
5
11
0
5
11
0
5
11
0
5
11
0
5
11
0
5
11
0
5
11
Pequenos múltiplos de gráficos de
barras
Divisão por idade em regiões
Um gráfico por região
Comparação: fácil em uma mesma
idade, difícil entre idades de estados
diferentes

## Página 40

Particionamento: Subdivisão
Recursiva
Divisão por tipo (Flat, Semi,
Ter, Det)
Depois por bairro (Ex.: Sutton,
Croydon, etc.)
Depois por tempo: meses
como linhas e anos como
colunas
Na base, cada quadrado é
colorido pela variação de
preço dentro do grupo.
[Configuring Hierarchical Layouts to Address Research Questions.
Slingsby, Dykes, and Wood. IEEE Transactions on Visualization and
Computer Graphics (Proc. InfoVis 2009) 15:6 (2009), 977–984.]
Sistema: HiVE

## Página 41

[Configuring Hierarchical Layouts to Address Research Questions. Slingsby,
Dykes, and Wood. IEEE Transactions on Visualization and Computer
Graphics (Proc. InfoVis 2009) 15:6 (2009), 977–984.]
Ordem diferente
Primeiro bairro depois
tipo
Cor agora representa o
preço médio dentro do
grupo
Padrões bem diferentes
Sistema: HiVE
Particionamento: Subdivisão
Recursiva

## Página 42

Particionamento: Subdivisão
Recursiva
[Configuring Hierarchical Layouts to Address Research Questions.
Slingsby, Dykes, and Wood. IEEE Transactions on Visualization and
Computer Graphics (Proc. InfoVis 2009) 15:6 (2009), 977–984.]
O tamanho das regiões é
pela quantidade de vendas
Não uniformemente
Resultado: treemap
Sistema: HiVE

## Página 43

Particionamente: Subdivisão
Recursiva
[Configuring Hierarchical Layouts to Address Research Questions.
Slingsby, Dykes, and Wood. IEEE Transactions on Visualization and
Computer Graphics (Proc. InfoVis 2009) 15:6 (2009), 977–984.]
Codificação diferente para
regiões de segundo nível
Mapas temáticos
(choropleth)
Sistema: HiVE

## Página 44

Sobrepondo camadas
Camada: conjunto de objetos espalhados sobre uma região
Cada conjunto é um grupo visualmente distinguível
Extensão: a visão toda
Escolhas de design:
Quantas camadas e como as camadas são distinguíveis?
Conjunto pequeno estático ou dinâmico a partir de muitas
camadas possíveis (selecionadas pelo usuário)?
Como são particionadas? A partir dos atributos do dataset x
seleção do usuário
Superimpose Layers

## Página 45

Sobrepondo camadas
Camadas distinguíveis
Codificadas com canais diferentes, sem sobreposição
Duas camadas comumente possíveis, três camadas são
possíveis com design cuidadoso
Superimpose Layers

## Página 46

Camadas visuais estáticas
Camada de cima: estradas
Matiz, tamanho para distinguir estradas
principais de secundárias
Alto contraste de luminância do background
Camada do plano de fundo: regiões
Cores não saturadas para água, parques e áreas
de terra
Usuário pode focar a atenção seletivamente
“Get it right in black and white”
Verificar contraste de luminância visão em escala
de cinza
[Get it right in black and white. Stone. 2010.  
http://www.stonesc.com/wordpress/2010/03/get-it-right-in-black-and-white]
