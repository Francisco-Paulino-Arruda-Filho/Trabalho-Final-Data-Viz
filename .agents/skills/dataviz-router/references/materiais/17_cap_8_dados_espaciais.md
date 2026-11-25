# 17_cap_8_dados_espaciais

Extração textual do PDF correspondente. Páginas sem texto extraível podem conter imagens; a ordem e a formatação podem diferir do original.

## Página 1

Dados Espaciais
Emanuele Santos
Bibliografia: VAD, cap. 8

## Página 2

Agenda
Introdução
Geometria
Dados geográficos
Outros dados derivados
Campos espaciais
Campos escalares (um valor por célula)
Campos vetoriais e tensoriais (muitos valores por célula)

## Página 3

Introdução
Para datasets com semântica espacial, a escolha usual
para organizá-los espacialmente é usar a própria
posição espacial que já é dada para guiar o layout.
Tarefas centrais giram em torno do entendimento de
relacionamentos espaciais.
O canal de posição é utilizado diretamente com essa
informação.

## Página 4

Introdução
Princípio da efetividade: aspecto mais importante dos
dados é usado no canal visual mais efetivo.
Não temos muita liberdade para codificar outros
atributos nesse canal.
Se não existe tarefa de entendimento de
relacionamentos espaciais, o canal de posição está
liberado para outras escolhas de codificação.

## Página 5

Tipos espaciais principais
Geometria
Transmite informação de forma
direta através da posição
espacial dos seus elementos.
Elementos não necessariamente
possuem atributos associados.
Campos espaciais
Atributos são associados a cada
célula no campo.

## Página 6

Geometria
Desenhar geometria pura e simples, sem atributos associados,
é abordado em Computação Gráfica.
O que torna a geometria interessante no contexto de
Visualização é quando ela é derivada a partir de dados brutos
como o resultado de uma decisão de design no nível de
abstração.
Exemplos de geometria derivada: dados geográficos e
geometria gerada a partir de computações em campos
escalares.

## Página 7

Dados geográficos
Há centenas de anos que os cartógrafos lidam com
escolhas de design para a representação visual de
dados geográficos espaciais.
A abstração corresponde ao conjunto de escolhas sobre
como derivar uma geometria a partir de dados brutos
de modo que seja mais adequada para a tarefa
desejada.

## Página 8

Exemplo: como representar uma cidade
Marcação de ponto
Marcação de área

## Página 9

Dados geográficos
Integração com outros atributos não-espaciais, por
exemplo:
Dados de população na forma de uma tabela poderiam
ser usados para codificar o tamanho das marcações de
ponto representando cidades pela sua população.

## Página 10

Mapas choropleth (mapas temáticos)
https://observablehq.com/@d3/choropleth/2

## Página 11

Mapas choropleth (mapas temáticos)
Um mapa de choropleth mostra um
atributo quantitativo codificado como
cor sobre regiões delimitadas como
marcações de área.
A forma de cada região é determinada
usando a geometria dada.
Essa geometria pode estar nos dados
originais ou derivadas de outras bases.
A escolha de design principal aqui é o
colormap.

## Página 12

Mapas choropleth (mapas temáticos)
A paleta de cores também é fácil de
entender: números menores
correspondem a cores mais claras e
números maiores a cores mais
escuras.
Mapas como esses introduzem uma
distorção geográfica — o tamanho da
área geográfica pode não corresponder
à importância do valor dos dados.

## Página 13

Mapas choropleth (mapas temáticos)
Dados:  
Geometria de dados geográficos e
tabela com um atributo quantitativo
por região.
Codificação:  
Espaço: usa geometria dada para
limites de marcação de área.  
Cor: colormap sequencial
segmentado.

## Página 14

Projeção cartográfica
Um dos desafios no mapeamento
de dados é a projeção
cartográfica a ser utilizada.  
O mundo é um globo, mas os
mapas são planos. Um
cartógrafo deve escolher uma
projeção cartográfica para
transformar a esfera terrestre em
um plano bidimensional.

## Página 15

Tipos de
Projeção
Fonte: Alberto Cairo, The Truthful Art, 2016.
Todos os mapas
distorcem a superfície do
planeta de alguma forma.
Tipos de projeção:  
Cônica,  
Cilíndrica e  
Plana (Azimutal)

## Página 16

Tipos de Projeção
Existem cinco propriedades que podem (e serão) distorcidas
ao projetar um globo terrestre em uma superfície plana: forma,
área, ângulos, distância e direção.  
Qualquer projeção pode respeitar uma ou duas dessas
propriedades, mas não mais do que isso.
Com base nessas propriedades, podemos identificar quatro
grupos de projeções: projeções conformes (preservam formas
continentais e ângulos locais), equivalentes (preservam área),  
equidistantes (preservam distância) e afilática (minimizam as
deformações em conjunto).

## Página 17

Mercator
Foi desenvolvida em 1569 pelo  
geógrafo e cartógrafo Gerardus Mercator.
É uma projeção conforme e cilíndrica.
Ela se tornou a projeção cartográfica  
padrão para navegação.
A projeção de Mercator distorce o  
tamanho dos objetos à medida que a  
latitude aumenta do equador em  
direção aos polos norte e sul.  
Assim, países mais próximos dos polos, como a Groenlândia e a
Antártica, parecem muito maiores do que realmente são.

## Página 18

Mercator x Robinson
Na projeção de Robinson à direita, as áreas dos países estão
mais próximas de seus tamanhos reais.

## Página 19

Mercator x Albers
Observe como a fronteira norte dos Estados Unidos parece reta
no mapa de Mercator à esquerda, mas é mais curva na projeção
de Albers à direita.

## Página 20

Como escolher a melhor projeção?
Não existem projeções boas ou ruins. Existem projeções
apropriadas e inapropriadas.
Uma regra simples é escolher a projeção dependendo da extensão
da área do globo que você vai exibir na sua visualização.
Se você pretende representar uma região maior, um país ou até
mesmo o mundo inteiro, você deve sempre usar uma projeção que
preserve as áreas sem distorcer muito as formas.  
Se você for representar apenas uma região muito pequena, como
seu bairro ou cidade, tente usar projeções conformes, aquelas que
preservam as formas e os ângulos locais.

## Página 21

Projeções para mapas temáticos
Já que o foco primário de
muitos mapas temáticos é
comparar o valor ou padrão
em uma área com o valor ou
padrão de outra, as razões de
área devem ser mantidas.
Assim, recomenda-se usar
uma projeção equivalente.
https://observablehq.com/@ljegou/ttt-continuous-choropleth
Mapa temático usando a
projeção Albers

## Página 22

O Mundo
Mollweide
Hammer
Eckert IV
Robinson

## Página 23

Áreas continentais: Ásia e América
do Norte
Lambert Azimuthal
Albers equal-area

## Página 24

Áreas continentais: Europa e
Australia
Lambert Azimuthal
Albers equal-area

## Página 25

Áreas continentais: África e América
do Sul
Mollweide
Lambert Azimuthal
Sinusoidal

## Página 26

Países em latitudes intermediárias
Lambert Azimuthal
Países grandes
Albers equal-area
Cylindrical equal-area*
Países pequenos
Albers equal-area
Cylindrical equal-area*
*Para regiões com orientação Norte-Sul

## Página 27

Regiões Polares
Lambert Azimuthal

## Página 28

https://datavizcatalogue.com/methods/dot_map.html
Mapa de Pontos

## Página 29

https://datavizcatalogue.com/methods/bubble_map.html
Mapa de Círculos (ou bolhas)

## Página 30

https://archive.nytimes.com/www.nytimes.com/packages/html/politics/2004_ELECTIONRESULTS_GRAPHIC/
Cartogramas
https://archive.nytimes.com/www.nytimes.com/interactive/2008/08/04/sports/olympics/20080804_MEDALCOUNT_MAP.html?_r=0
Fonte: Nusrat & Kobourov, 2016.

## Página 31

Gridded Cartograms
Fonte: Schwabish, 2021, p. 238.

## Página 32

https://datavizcatalogue.com/methods/flow_map.html
Mapa de Fluxo

## Página 33

Um mapa é realmente necessário?
Muitos mapas são criados simplesmente porque o designer de
visualização tinha dados geográficos, não porque o mapa é o
melhor meio para aquele conteúdo.

## Página 34

Um mapa é realmente necessário?
Fonte: Washington Post, 2016.
Esses mapas ajudam você a ver a relação positiva entre a taxa de posse de
armas e a taxa de suicídio? Você consegue identificar os estados com as
maiores taxas de suicídio e as maiores taxas de posse de armas?

## Página 35

Um mapa é realmente necessário?
Um bubble plot pode
ser uma melhor
alternativa a um par
de mapas.
Fonte: Schwabish, 2021, p. 232.

## Página 36

Campos escalares: um valor
Campos escalares
possuem um único
valor associado a cada
célula definida
espacialmente.
Campo escalar 2D

## Página 37

Campos escalares: um valor
Normalmente são obtidos a partir de imagens médicas
(tomografia computadorizada e ressonância magnética)
ou gerados de simulações ou medições (sensores).
Existem três tipos de idiomas:
Fatiamento
Isocontornos
Direct volume rendering

## Página 38

Uma única fatia 2D
de uma tomografia
computadorizada
Múltiplas iso-
superfícies
semitransparentes
de um dataset 3D
de um dente
Direct Volume
Rendering do dataset
do torso, mostrando o
coração e as estruturas
vascular e óssea

## Página 39

Isocontornos
Os dados de geometria de dimensão mais baixa
derivados são computados e mostrados usando
técnicas de computação gráfica
Iso-superfícies para um campo 3D;
Isolinhas para um campo 2D.

## Página 40

Isolinhas: mapas topográficos
Isolinhas: linhas que representam os
contornos de um dado nível do valor
escalar do campo.
Elas são distantes em regiões de
pouca mudança e muito próximas em
regiões de mudança rápida.
Como elas nunca se sobrepõem,
contornos para vários valores podem
ser mostrados simultaneamente sem
muita poluição visual.

## Página 41

Isolinhas: mapas topográficos
Quando colorimos as regiões entre
os contornos com um color map,
geramos um contour plot.
Mapas topográficos mostram
contornos para uma mesma
elevação acima do nível do mar.
Contornos pequenos indicam picos
das montanhas e regiões planas
praticamente não contêm linhas.

## Página 42

Isolinhas: mapas topográficos
Dados:  
Campo escalar 2D; dados geográficos.
Dados derivados:  
Geometria: isolinhas computadas do
campo.
Codificação:  
Espaço: usa dados geométricos de
linhas e pontos e marcações de área.  
Cor: colormap customizado contínuo.

## Página 43

Isolinhas na
visualização de
crimes
José Florencio de Queiroz Neto, Emanuele Santos, Creto Augusto Vidal. In Proceedings of 2016 29th SIBGRAPI Conference on
Graphics, Patterns and Images (SIBGRAPI), Sao Paulo, 2016, pp. 305-312.

## Página 44

Isolinhas na visualização de crimes
José Florencio de Queiroz Neto, Emanuele Santos, Creto Augusto Vidal. In Proceedings of 2016 29th SIBGRAPI Conference on
Graphics, Patterns and Images (SIBGRAPI), Sao Paulo, 2016, pp. 305-312.

## Página 45

Isolinhas na visualização de crimes
José Florencio de Queiroz Neto, Emanuele Santos, Creto Augusto Vidal. In Proceedings of 2016 29th SIBGRAPI Conference on
Graphics, Patterns and Images (SIBGRAPI), Sao Paulo, 2016, pp. 305-312.

## Página 46

Iso-superfície
Transforma um campo escalar 3D em uma
ou mais superfícies 2D.
Uso de controles de interação: navegação,
zoom e translação.
No caso 3D, já não é possível mostrar
dezenas de iso-superfícies devido à
oclusão.
É preciso escolher o nível que mostra o
resultado mais útil.
Técnicas para guiar a escolha do isovalor
são necessárias.

## Página 47

[Sem texto extraível nesta página.]

## Página 48

Direct Volume Rendering
Cria uma imagem diretamente da
informação contida dentro do
campo escalar, sem derivar
representação geométrica
intermediária.
As questões algorítmicas
envolvidas na computação são
bem complexas.

## Página 49

Direct Volume Rendering
Uma escolha de design crucial é a
função de transferência que
mapeia mudanças no valor escalar
para opacidade e cor.
Achar a função de transferência
manualmente requer muita
tentativa e erro.

## Página 50

[Sem texto extraível nesta página.]

## Página 51

[Sem texto extraível nesta página.]

## Página 52

[Sem texto extraível nesta página.]

## Página 53

Campos vetoriais: múltiplos valores
Área de aplicação: Dinâmica
Computacional de Fluidos
Visualização de Fluxo lida com
um tipo particular de campo
vetorial: campo de velocidade
Cada célula: direção e
magnitude
Campos vetoriais 2D e 3D
http://www.aerospaceweb.org/question/planes/q0102a.shtml

## Página 54

Steady x Unsteady
Steady: Campo vetorial permanece constante.
Unsteady: Campo vetorial varia com o tempo.

## Página 55

Pontos críticos
saddle
circulating
sink
circulating
source
source
sink

## Página 56

Campos vetoriais: Codificações Visuais
Flow glyph: mostram informação local em cada célula através
de um glyph
Geometric flow: traçado de trajetória de partículas usando um
conjunto esparso de sementes
Texture flow: traçado de trajetória de partículas usando um
conjunto denso de sementes
Feature flow: usa computação global do campo inteiro para
achar features explicitamente e exibi-las usando glyphs ou
geometria

## Página 57

Flow Glyphs
Posicionam-se símbolos no
campo vetorial
Setas representam direção e
magnitude  
Regularmente espaçados
Aleatoriamente espaçados
Escala
Cuidado com poluição visual
Outras primitivas podem ser
usadas

## Página 58

Streamlines
Linhas que em todos os
lugares são tangentes ao
campo vetorial.
No caso de um campo
constante (steady), uma
streamline representa a
trajetória que uma partícula
iria seguir se solta no campo.

## Página 59

Pathlines, Streamlines e Streaklines
Pathline
Traçado de uma partícula no fluxo
Extensão de streamline para unsteady flows
Streamline
Pathline do campo vetorial em um dado momento
Streakline
Injetar continuamente partículas em um ponto no fluxo e
depois conectam-se as partículas.

## Página 60

http://en.wikipedia.org/wiki/Streamlines,_streaklines,_and_pathlines
A partícula vermelha se move
de acordo com o fluxo de um
fluido.
A pathline é desenhada em
vermelho.
A streakline é desenhada em
azul.
As linhas pontilhadas são as
streamlines.
Pathlines, Streamlines e Streaklines

## Página 61

Streaklines no mundo real

## Página 62

Streaklines no mundo real
https://www.youtube.com/watch?v=dZzh9IeFf2o
Streaklines de fluido passando por cilindro: fonte:
Batchelor, 1967.

## Página 63

Pathlines e Streaklines
Streamlines (e streaklines) nunca intersectam umas
com as outras num mesmo instante.
Uma partícula não pode ter duas velocidades diferentes
num mesmo ponto.
No caso de streaklines, duas partículas não podem
ocupar o mesmo lugar no espaço.
Mas pathlines, sim.

## Página 64

Line Integral Convolution (LIC)
Ideia básica:
Integração de ruído ao
longo de streamlines.
Técnica que se saiu melhor
no estudo para a
LOCalização de pontos
críticos.

## Página 65

Variação de LIC na Web
http://hint.fm/wind/

## Página 66

Variação de LIC na Web
http://hint.fm/wind/
30 de abril de 2025
18 de setembro de 2022

## Página 67

Campos tensoriais: muitos valores
Visualização de fluxo também
se aplica a dados de tensores.
Campos tensoriais
normalmente contêm uma
matriz em cada célula no
campo.
Medem propriedades: stress,
condutividade, curvatura e
difusão.

## Página 68

[Sem texto extraível nesta página.]

## Página 69

Aplicação de Visualização de campos
espaciais
Visualização do furacão Katrina
http://www.ncsa.illinois.edu/News/Stories/Katrina/
