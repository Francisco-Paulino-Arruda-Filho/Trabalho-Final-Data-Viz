# 18_cap_9_networks_trees

Extração textual do PDF correspondente. Páginas sem texto extraível podem conter imagens; a ordem e a formatação podem diferir do original.

## Página 1

Redes e Árvores
Emanuele Santos
Bibliografia: VAD, cap. 9

## Página 2

Motivação

## Página 3

[Sem texto extraível nesta página.]

## Página 4

Agenda
Diagramas node-link
Matrizes de Adjacência
Containers
Exemplos de Aplicações

## Página 5

Introdução
Adjacency Matrix
TREES
NETWORKS
Derived Table
Existem praticamente
três classes de idiomas
para organizar dados de
redes e de árvores:
Diagramas node-link
Matrizes de adjacência
Containers (apenas
árvores)
Arrange Networks and Trees
Node–Link Diagrams
TREES
NETWORKS
Connection Marks
Enclosure
TREES
NETWORKS
Containment Marks

## Página 6

Diagramas Node-Link

## Página 7

Idioma: Diagrama Node-Link
Codificação visual:
Marcas de conexão com linhas
(links) e de nós com pontos.
https://observablehq.com/@d3/force-directed-graph

## Página 8

Considerações
Posição espacial: sem significado
codificado diretamente.
Minimizar cruzamento de arestas.
Semântica de proximidade:
Às vezes sim;
Às vezes a proximidade é arbitrária,
efeito colateral do algoritmo de layout;
Comprimento da aresta influencia a
percepção (arestas longas são mais
salientes).

https://observablehq.com/@d3/force-directed-graph

## Página 9

Tarefas:  
Explorar a topologia da rede;
Localizar caminhos e
clusters.
Escala:
Densidade aresta/nó: E <
4N.
http://bl.ocks.org/mbostock/1062288
Tarefas e Escala

## Página 10

Desenho segue modelo físico
Arestas = molas
Nós = partículas repulsivas
Force-directed Placement

## Página 11

Algoritmo
Inicie com um layout aleatório
Itere:
Para cada par de vértices calcule a força de repulsão
Para cada aresta calcule a força de atração
Acumule as forças por nó
Atualize a posição de cada nó na direção da força
acumulada
Pare quando o layout for “bom o bastante”

## Página 12

Vantagens:
Bastante flexível, layouts esteticamente agradáveis para vários
tipos de redes;
É possível adicionar outras forças;
Relativamente fácil de implementar.
Desvantagens:
O loop de repulsão é O(n2) por iteração;
Melhoria para O(n logn) com quadtree ou k-d tree;
Suscetível a mínimo local.
Vantagens e desvantagens

## Página 13

Outros layouts
Ortogonal
Ótimo para diagramas UML;
Algoritmos complexos.

## Página 14

Outros layouts
Layouts circulares
Também tentam evitar
sobreposição de elementos
A profundidade da árvore é
codificada como a
distância ao centro do
círculo.
No exemplo ao lado, os
links são curvas splines.

## Página 15

Outros layouts
Layouts aninhados
Algoritmos de layout são
aplicados recursivamente.
Ótimos para grafos com
estrutura hierárquica.

## Página 16

Edge Bundling:
Técnica para
agrupamento
de arestas para
minimizar
cruzamentos.
https://observablehq.com/@emanueles/interactive-hierarchical-edge-bundling

## Página 17

hairball
A representação
node-link nem
sempre vai
funcionar.

## Página 18

sfdp (scalable force-
directed placement)
Arestas são coloridas
por tamanho.
Estrutura de cluster é
visível.
Porém, em um dado
momento vai atingir
um limite.
[Efficient and high quality force-directed graph drawing. Hu. The Mathematica Journal 10:37–71, 2005.]

## Página 19

26028 nós e
100290 arestas

## Página 20

http://gephi.org

## Página 21

A visualização ao lado
foi construída no Gephi.  
A rede possui 12151 nós
e 35642 arestas
correspondendo ao
relacionamento entre
desenvolvedores (nós
pretos) e bug reports
(nós coloridos) do
projeto Hadoop ao longo
de 10 anos.

## Página 22

[Sem texto extraível nesta página.]

## Página 23

Matriz de Adjacências

## Página 24

Representação
Em vez de um diagrama node-link, usa-se a representação de
matriz de adjacências:

## Página 25

Identificando padrões visuais
[Henry & Fekete, 2006]
A: ator se conectando
a várias comunidades
B: Uma comunidade
C: Uma clique

## Página 26

Les Misérables
https://observablehq.com/@fil/hello-reorder-js
Interação de personagens:

## Página 27

Vantagens e desvantagens
Vantagens
Funcionam bem para grafos densos
Visualmente escalável
Fácil identificação de clusters
Desvantagens
Ordem das linhas afeta o que pode
ser visto
Visualização abstrata
Difícil de seguir caminhos

## Página 28

Containers

## Página 29

Treemap
Dados
Árvore
1 atrib. quant. em nós folhas
Codificação
Marcas de área para  
estrutura hierárquica
Orientação retilínea
Tamanho codifica atributo
quantitativo.
http://homes.cs.washington.edu/~jheer/files/zoo/

## Página 30

Treemap
Tarefas
Consulta ao atributo
das folhas
Escala
1M folhas
http://homes.cs.washington.edu/~jheer/files/zoo/

## Página 31

Esquemas aninhados
Venn Diagram
http://homes.cs.washington.edu/~jheer/files/zoo/
http://homes.cs.washington.edu/~jheer/files/zoo/
Icicle Tree

## Página 32

Radial Icicle tree
http://homes.cs.washington.edu/~jheer/files/zoo/
Esquemas aninhados

## Página 33

Esquemas aninhados
Provê uma visão geral da
hierarquia em pouco espaço.
Fácil comparar os nós.
Difícil de perceber a
profundidade com precisão.
link não funciona mais

## Página 34

Exemplos de Aplicações

## Página 35

https://newsmap.ijmacd.com/?edition=BR_pt-419

## Página 36

http://infograficos.estadao.com.br/politica/operacao-lava-jato/?nucleo=&situacao=&partido=

## Página 37

https://nbremer.github.io/ORCA/top-contributor-network/
by Nadieh Bremer

## Página 38

The Fermi Paradox
by Nadieh Bremer

## Página 39

http://www.eigenfactor.org/projects/well-formed/
Circular+Linear+Treemap+Force directed
Visualizing Information Flow in Science

## Página 40

http://www.eigenfactor.org/projects/well-formed/radial.html

## Página 41

http://www.eigenfactor.org/projects/well-formed/radial.html

## Página 42

Circular+Linear+Treemap+Force directed
Visualizing Information Flow in Science
Mudança ao longo do tempo
http://www.eigenfactor.org/projects/well-formed/time.html

## Página 43

[Sem texto extraível nesta página.]

## Página 44

[Sem texto extraível nesta página.]

## Página 45

http://www.autodeskresearch.com/projects/citeology

## Página 46

[Sem texto extraível nesta página.]

## Página 47

https://youtu.be/IKESYrF1SGE

## Página 48

63.779 referências
cruzadas na Bíblia
(arcos coloridos de
acordo com a
distância entre os
capítulos)
Cada barra no gráfico de
barras corresponde a um
capítulo (o tamanho denota
o número de versículos), os
livros alternam em cinza-
claro e branco)
http://www.chrisharrison.net/index.php/Visualizations/BibleViz

## Página 49

Slides interativos
Use as setas do teclado para passar os slides. Praticamente
cada slide é uma visualização interativa.
http://mbostock.github.io/d3/talk/20110921/#0
O vídeo pode ser conferido aqui: https://vimeo.com/29458354
