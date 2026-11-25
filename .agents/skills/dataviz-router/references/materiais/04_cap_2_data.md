# 04_cap_2_data

Extração textual do PDF correspondente. Páginas sem texto extraível podem conter imagens; a ordem e a formatação podem diferir do original.

## Página 1

O que: Abstração de Dados
Emanuele Santos
Bibliografia: VAD, cap. 2

## Página 2

Agenda
Visão geral
Tipos e Semântica dos Dados
Tipos de Dados
Tipos de Conjuntos de Dados
Tipos de Atributos

## Página 3

Visão Geral

## Página 4

O espaço de design de possíveis idiomas de
visualização é gigantesco e inclui também
considerações de como criar e como interagir
com as representações visuais.

## Página 5

Espaço de design de Idiomas
Idioma de visualização: abordagem distinta para criar ou
manipular representações visuais.
Como desenhar: idioma de codificação visual
Muitas possibilidades de como criar.
Como manipular: idioma de interação
Ainda mais possibilidades:
Tornar um único idioma dinâmico.
Conectar múltiplos idiomas através de interação.

## Página 6

Por que muitos designs são inefetivos?

## Página 7

Framework de Análise:
O que, como e por quê
O que é mostrado?
Abstração de dados.
Por que o usuário está vendo a vis?
Abstração de tarefas.
Como é mostrado?
Idioma: codificação visual e interação.
Cada um desses trios é chamado de instância.

## Página 8

Datasets
What?
Attributes
Dataset Types
Data Types
Data and Dataset Types
Tables
Attributes (columns)
Items
(rows)
Cell containing value
Networks
Link
Node
(item)
Trees
Fields (Continuous)
Geometry (Spatial)
Attributes (columns)
Value in cell
Cell
Multidimensional Table
Value in cell
Items
Attributes
Links
Positions
Grids
Attribute Types
Ordering Direction
Categorical
Ordered
Ordinal
Quantitative
Sequential
Diverging
Cyclic
Tables
Networks &
Trees
Fields
Geometry
Clusters,
Sets, Lists
Items
Attributes
Items (nodes)
Links
Attributes
Grids
Positions
Attributes
Items
Positions
Items
Grid of positions
Position
Tipos abstratos de
dados do que pode
ser visualizado:
dados, conjuntos
de dados e
atributos.
VAD, Figure 2.1
Why?
How?
What?

## Página 9

Tipos e Semântica de Dados

## Página 10

Tipos e Semântica de Dados
Um dos aspectos no design de visualizações é o tipo de
dados disponível.
Que informação podemos extrair dos dados e que
significados precisamos saber explicitamente?
Exemplo: o que os dados abaixo significam?
Basil, 7, S, Pear

## Página 11

Semântica de Dados
É necessário saber a semântica e os tipos dos dados.
Semântica: significado no mundo real.
Exemplos:
Uma palavra representa o primeiro nome de uma
pessoa, o nome fantasia de uma empresa, um objeto,
uma fruta, etc?
Um número representa um dia do mês, uma idade, uma
altura ou uma outra medida, uma posição no espaço?
Basil, 7, S, Pear

## Página 12

Tipos de Dados
O tipo do dado é a sua interpretação estrutural ou
matemática.
No nível dos dados, que tipo de coisa é? Um item, um
relacionamento ou um atributo?
No nível dos conjuntos de dados, como esses tipos de
dados são combinados em uma estrutura maior? É uma
tabela, uma árvore ou um campo de valores amostrados?
No nível de atributos, que tipos de operações
matemáticas fazem sentido para eles? Quantidades x
Categorias.

## Página 13

VAD, Table 2.1

## Página 14

[Sem texto extraível nesta página.]

## Página 15

[Sem texto extraível nesta página.]

## Página 16

Tipos de Dados

## Página 17

5 Tipos Básicos de Dados
Item
Atributo
Link (relacionamento)
Posição
Grid (grade)

## Página 18

5 Tipos Básicos de Dados
Item: entidade individual discreta, ex: uma linha em uma
tabela, um nó de uma árvore, representando uma
pessoa, uma ocorrência de um crime.
Atributo: alguma propriedade específica que pode ser
medida, observada ou registrada, ex: salário, preço,
temperatura. Também chamado de variável, dimensão.
Link: relacionamento entre itens, normalmente em uma
rede.

## Página 19

5 Tipos Básicos de Dados
Posição: um dado espacial, fornecendo uma localização num
espaço bidimensional (2D) ou tridimensional (3D), ex: pares
latitude-longitude representando coordenadas na superfície
terrestre.
Grid: especifica uma estratégia para amostrar dados
contínuos em termos de relacionamento geométrico e
topológico entre suas células.

## Página 20

Tipos de Conjuntos de Dados

## Página 21

Tables
Attributes (columns)
Items
(rows)
Cell containing value
Multidimensional Table
Value in cell
Um conjunto de dados é qualquer coleção de
informações que pode ser alvo de análise.
4 tipos básicos: tabelas,
redes, campos e geometria.
VAD, Figure 2.4
Networks
Link
Node
(item)
Trees
Fields (Continuous)
Attributes (columns)
Value in cell
Cell
Grid of positions
Geometry (Spatial)
Position

## Página 22

Tabelas
Tipos de conjuntos de dados mais comuns.
São formadas por linhas (itens) e colunas
(atributos).
Cada célula da tabela é especificada pela
combinação de uma linha e uma coluna - um item
e um atributo e contém um valor para esse par.
Uma tabela multidimensional possui uma
estrutura mais complexa de indexação de uma
célula, com múltiplas chaves.
Attributes (columns)
Items
(rows)
Cell containing value
Multidimensional Table
Value in cell

## Página 23

Tabelas
VAD, Figure 2.5

## Página 24

Redes/Grafos e Árvores
Tipo de conjunto de dado apropriado
para quando existe algum tipo de
relacionamento entre dois ou mais
itens.
Um item em um grafo é chamado nó.
Um link é um relacionamento entre
dois itens.
Link
Node
(item)

## Página 25

Redes/Grafos
Redes sociais, redes de
computadores, redes de
citações.
Nós e links podem ter
atributos associados a
eles.
https://observablehq.com/@d3/disjoint-force-directed-graph

## Página 26

Árvores
Árvores: redes hierárquicas
acíclicas.
Cada nó-filho possui
um único nó-pai 
apontando para ele.
Exemplos: Estrutura
hierárquica de uma empresa,
árvore genealógica, árvore
filogenética.
https://observablehq.com/@d3/tree-of-life

## Página 27

Campos
Também possui valores de atributos
associados a células.
Cada célula em um campo contém
medidas ou cálculos de um domínio
contínuo (infinitos valores).
Exemplos de medidas: temperatura,
pressão, velocidade, força e
densidade.
Fields (Continuous)
Attributes (columns)
Value in cell
Cell
Grid of positions

## Página 28

Campos
Exemplo de campo: tomografia computadorizada com 64
x 64 x 64 = 262.144 células representando um volume
cúbico.
Uma única fatia 2D de
uma tomografia
computadorizada
Visualização Volumétrica

## Página 29

Campos
Conceitos importantes:
Amostragem (frequência com que as medidas devem ser
realizadas).
Interpolação (como mostrar valores entre os pontos
amostrados) -> reconstrução de uma nova visão dos
dados.

## Página 30

[Sem texto extraível nesta página.]

## Página 31

[Sem texto extraível nesta página.]

## Página 32

[Sem texto extraível nesta página.]

## Página 33

[Sem texto extraível nesta página.]

## Página 34

Tipos de Grid
Grid uniforme: amostragem é feita em intervalos
completamente regulares
Não há necessidade de
armazenar a geometria
ou a topologia do grid

## Página 35

Grid não estruturado
Flexibilidade total
Posições
espaciais e
topologia
explícitas

## Página 36

Geometria
Especifica informação sobre a forma dos itens com posições
espaciais explícitas
Itens são pontos, linhas ou curvas, superfícies 2D ou volumes
3D
São tipos de conjuntos
de dados 
essencialmente 
espaciais e não 
necessariamente 
possuem atributos

## Página 37

Disponibilidade dos dados
Dados estáticos: O conjunto de dados inteiro está
disponível de uma vez (offline).
Dados dinâmicos ou stream de dados: os dados são
obtidos sob demanda ao longo de uma sessão (online).
Itens são adicionados ou removidos ao longo da
visualização.
Qualquer um dos tipos de conjuntos de dados pode ser
estático ou dinâmico.

## Página 38

Tipos de Atributos

## Página 39

Attribute Types
Categorical
Ordered
Ordinal
Quantitative
Ordering Direction
Sequential
Diverging
Cyclic

## Página 40

Atributos Categóricos 
(ou Nominais)
Não possuem ordem
inerente.
Exemplos: nomes de frutas,
títulos de filmes, nomes de 
cidades, etc.

## Página 41

Atributos Ordenados
Todos os dados ordenados possuem uma ordem implícita.
Dados ordinais ou quantitativos.
Dados ordinais: operações matemáticas não são possíveis.
Exemplos: tamanhos de camisa (pequeno, médio e
grande).

## Página 42

Atributos Ordenados: 
Dados Quantitativos
Dão suporte a comparações
aritméticas.
Exemplos: altura, idade, peso,
temperatura, tempo de
execução de um algoritmo,
etc.
Números inteiros e reais.

## Página 43

Atributos Ordenados
Sequenciais:
Existe um intervalo homogêneo de um valor mínimo a um
valor máximo.
Divergentes:
Podem ser separados em duas sequências apontando em
direções opostas partindo de um ponto inicial comum.

## Página 44

Atributos sequenciais e divergentes
Atributos sequenciais:
somente altitude
Atributos divergentes:
altitude e batimetria

## Página 45

Atributos Ordenados Cíclicos
Valores voltam ao ponto de partida em vez de
crescerem indefinidamente.
Várias medidas de tempo são cíclicas: horas do dia,
dias da semana e meses do ano.

## Página 46

Atributos hierárquicos
Pode haver uma estrutura hierárquica em um atributo
ou entre múltiplos atributos.
Por exemplo, os valores diários de ações da bolsa ao
longo de uma década são exemplos de uma série
temporal onde um dos atributos é o tempo.
Tempo pode ser agregado hierarquicamente desde
dias a semanas, meses e anos.

## Página 47

Semântica de atributos
Chave / valor
Temporal / não temporal
Contínuo / discreto

## Página 48

Semântica de atributos: Chave/valor
Atributo chave atua como um índice para acessar
atributos valores.
Variável independente / dependente (estatística).
Dimensão / medida (data mining/tableau).
Importante para tabelas, campos e redes.

## Página 49

Semântica de atributos:Chaves/valores
Tabelas planas:
Uma única chave, vários
atributos valores.
Chave implícita (índice da
linha) ou explícita (contida na
tabela como atributo).
Tabelas multidimensionais:
Várias chaves, vários atributos
valores.

## Página 50

Semântica de atributos: Chaves/valores
Campos
Domínio contínuo.
Campos espaciais: posição espacial atua
como chave quantitativa.
Atributos valores podem ser interpolados.

## Página 51

Semântica de atributos: Chaves/valores
Campos
Diferem no número de chaves e número
de valores.
Campos multivariados: dependem do
número de atributos valores.
Campos multidimensionais: dependem
do número de atributos chaves.

## Página 52

Semântica de atributos:
Campos multivariados
Campos escalares:
Univariado: um único valor
em cada ponto no espaço.
Campo escalar 2D

## Página 53

Semântica de atributos:
Campos multivariados
Campos vetoriais:
Multivariado: lista de valores
em cada ponto no espaço.
Direção e magnitude.
Campo vetorial

## Página 54

https://earth.nullschool.net/

## Página 55

Semântica de atributos:
Campos multivariados
Campos tensoriais:
Multivariado: lista de valores
em cada ponto no espaço.
Valores complexos:
matrizes.
Informação não pode ser
representada por uma seta.
Campo tensorial
Imagem de uma fatia de um MRI de difusão
mostrando a difusão da água no cérebro

## Página 56

Semântica de atributos: Temporal /
não temporal
Um atributo temporal é simplesmente qualquer
informação que se relaciona com o tempo.
Natureza multiescalar:
De nanossegundos a milênios.
Múltiplas hierarquias:
Semanas não se encaixam perfeitamente em meses.
Utilizados como chaves ou valores.

## Página 57

Dados com variação de tempo
Tempo é um dos atributos-chave:
Por exemplo, dados de GPS rastreando uma frota de
carros.
Cada veículo terá uma posição diferente em cada
instante de tempo.
Séries temporais (dados de ações).
Análises típicas envolvem encontrar tendências,
correlações e múltiplas escalas de tempo.
