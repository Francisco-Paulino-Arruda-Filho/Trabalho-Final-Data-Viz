# 20_cap_10_color

Extração textual do PDF correspondente. Páginas sem texto extraível podem conter imagens; a ordem e a formatação podem diferir do original.

## Página 1

Mapeamento de Cor e
Outros Canais
Emanuele Santos
Bibliografia: VAD, cap. 10

## Página 2

Agenda
Visão geral
Teoria da Cor
Mapas de cores
Recomendações gerais
Mapeando outros canais

## Página 3

Visão
Geral

## Página 4

Teoria da Cor

## Página 5

Dados
Matéria bruta crítica
Sem dados, não há visualização
De todos os sentidos, a visão é o nosso canal mais
poderoso e eficiente para receber informação do
mundo ao nosso redor
≈70% dos receptores de sentido em
nosso corpo são dedicados à visão

## Página 6

A mecânica da visão
Estímulo
Órgão Sensorial
Sensação
(processo físico)
Percepção
(processo cognitivo)
Órgão Perceptual
olho
cérebro
[Phew, 2012]

## Página 7

Luz
Apenas uma pequena faixa
do espectro eletromagnético
é visível (390-700nm).

## Página 8

O olho
Fovea

## Página 9

A retina
Fina superfície no
fundo do olho coberta
por milhões de células
nervosas
especializadas,
chamadas cones e
bastonetes.

## Página 10

Distribuição de
cones e bastonetes
na retina

## Página 11

A retina
Cones e bastonetes diferem em  
fotossensibilidade:
Bastonetes são especialistas em  
notar luz branda e registram o que  
detectam em branco e preto.
Cones são especialistas em notar luz mais brilhante e
registram o que detectam em cores.
Cones estão divididos em três tipos, cada um responsável
por detectar uma amplitude do espectro de cores: azul, verde
ou vermelho.

## Página 12

Sensibilidade dos cones

## Página 13

Cores como três números
Multiplicando um espectro pelas curvas de resposta dos cones
e integrando o resultado, cria-se o sinal de cor básico para o
cérebro. A altura das barras reflete a força dos três sinais.
[Representing Colors as Three Numbers, Stone, IEEE Computer Graphics and Applications, 25(4), July 2005, pp. 78-85]

## Página 14

Cores como três números
Tricromacia: Todos os espectros
podem ser reduzidos a
precisamente três valores sem
perda de informação com respeito
ao sistema visual.
Metamerismo: Quaisquer
espectros que criarem a mesma
resposta tricromática serão
indistinguíveis.

## Página 15

Daltonismo
Incapacidade de diferenciar
todas ou algumas cores
Os genes para os
pigmentos de cor verde e
vermelho estão apenas no
cromossomo X
Verde-Vermelho:
≈8% dos homens  
<1% das mulheres

## Página 16

Daltonismo e lesão cerebral
[Oliver Sacks]

## Página 17

[Sem texto extraível nesta página.]

## Página 18

[Sem texto extraível nesta página.]

## Página 19

Simuladores de daltonismo
http://vischeck.com
http://www.color-blindness.com/
https://daltonlens.org/colorblindness-simulator
Colorblindly - Extensão para o Chrome que simula
alguns tipos de deficiência de cor

## Página 20

Espaços de cores
Vimos que o espaço de cor
das cores que o sistema
visual humano pode detectar
é tridimensional.
Existem diversas maneiras de
descrever cor
matematicamente como um
espaço e transformar as
cores de um espaço para
outro.
https://dotcolordotcom.files.wordpress.com/2012/08/anatomy-of-a-cie-diagram2x.png

## Página 21

Espaços de cores
CIE XYZ
Criado perceptivamente
RGB
conveniente para
computadores

## Página 22

Espaços de cores
HLS (Hue, Lightness, Saturation)
Transformação simples de RGB
Mais intuitivo, separa brilho de matiz e
saturação

## Página 23

Cor: Luminância, Saturação, Matiz
3 canais:
Identidade para
atributos categóricos:
Matiz (hue)
Magnitude para
atributos ordenados:
Luminância
Saturação
Saturation
Luminance values
Hue

## Página 24

Cor: Luminância, Saturação, Matiz
Outros espaços de cores
comuns:
RGB: escolha ruim para
codificação visual
HSL: melhor, mas cuidado
lightness (brilho) ≠ luminância
Transparência: útil para criar
camadas
Não pode ser combinada com
luminância ou saturação
Corners of the RGB
color cube
L from HSL
All the same
Luminance values

## Página 25

A quantidade de luminância que humanos percebem depende
do comprimento de onda

## Página 26

Mapas de Cores

## Página 27

Limites categóricos: não-contíguos
6-12 bins matiz/cor
bem menos se daltônico
3-4 bins luminância, saturação
Tamanho afeta saliência
Usa alta saturação para regiões pequenas, e pouca
saturação para grandes regiões
Mapas de cores

## Página 28

Cores categóricas: restrições de
discriminabilidade
Cinteny: flexible analysis and visualization of synteny and genome rearrangements in multiple organisms. Sinha and Meller. BMC Bioinformatics, 8:82, 2007.
Uso inefetivo de colormap:
Em pequenas regiões não
contíguas, só conseguimos
distinguir até 12 categorias
e a figura utiliza 21.
Muitas informações
perdidas
Solução: diminuir o número
de bins

## Página 29

Percepção x tipos de marca
A habilidade das
pessoas em
perceber
diferenças de cor
varia
significativamente
de acordo com os
tipos de marca.

## Página 30

[Sem texto extraível nesta página.]

## Página 31

http://colorbrewer2.org

## Página 32

https://projects.susielu.com/viz-palette

## Página 33

https://color.adobe.com

## Página 34

https://blog.datawrapper.de/colorguide/

## Página 35

Mapas de cores: atributos
quantitativos
Mostrar um valor escalar através de uma mapa de cores
ou uma escala de cores.
Mapeia-se o intervalo na reta real a um caminho do
espaço de cores:
m: R → {RGB, HSV}
Ponto crucial: Escolha de m
Depende do objetivo da visualização.

## Página 36

Estratégias básicas
Variar apenas um componente do modelo de cor
Matiz, saturação ou brilho
Atividade: medições quantitativas
Queremos olhar para um certo ponto do gráfico e dizer
do modo mais preciso possível qual o valor do campo
naquele ponto.

## Página 37

Mapas de cores
👎

## Página 38

Estratégias básicas
Brilho relativo x brilho absoluto
Alta sensibilidade à mudança de brilho
Adaptabilidade (depende do contexto)
Mesmos tons de cinza aparecem diferentes
dependendo do entorno

## Página 39

Percepção de cor é relativa

## Página 40

Estratégias básicas
Brilho relativo x brilho absoluto
Alta sensibilidade a mudança de brilho
Adaptabilidade (depende do contexto)
Mesmos tons de cinza aparecem diferentes dependendo do
entorno
Significa que uma escala de cinza não é apropriada para
uma leitura absoluta com precisão
Percepção de matiz é bem mais estável
Usar variação de matiz para medidas quantitativas

## Página 41

https://airquality.gsfc.nasa.gov/
Níveis de NO2 na atmosfera em 2005

## Página 42

https://airquality.gsfc.nasa.gov/
Níveis de NO2 na atmosfera em 2014

## Página 43

https://airquality.gsfc.nasa.gov/sites/default/files/airquality/
PotomacGeophysicalSociety_Nov122020.pdf

## Página 44

Mapeamento de cores
Para medidas qualitativas
Queremos apenas comparar um conjunto de pontos e
ordená-los entre si
Brilho possui uma ordem intuitiva

## Página 45

Mapeamento de cores

## Página 46

Redundância
Indicadores redundantes
Tolerância a falhas: provê a mesma informação de vários
modos
Ideia básica: utilizar mais canais para transmitir
informação, contanto que os canais não interfiram uns com
os outros
Ex. variar matiz e brilho ao mesmo tempo

## Página 47

Componentes redundantes

## Página 48

Cores ordenadas: Evitar mapa de cor
rainbow (default)
Problemas:
Não ordenado perceptivelmente
Escala não é perceptivelmente
linear
Detalhes finos não podem ser
percebidos somente pelo canal
de matiz

## Página 49

Cores ordenadas: Evitar mapa de cor
rainbow (default)
Alternativas
Mapa de cor com luminância
monotonicamente crescente
Matizes ordenadas de
acordo com a sua
luminância

## Página 50

Colormaps divergentes

## Página 51

[Sem texto extraível nesta página.]

## Página 52

[Sem texto extraível nesta página.]

## Página 53

Mapas
bivariados

## Página 54

👎

## Página 55

Recomendações gerais

## Página 56

Use cor moderadamente
Para que a cor seja efetiva, ela deve ser usada com
moderação.
Muita variedade acaba impedindo que qualquer coisa se
sobressaia
É necessário que haja contraste suficiente para atrair a
atenção do público
O uso de muitas cores de uma vez acaba perdendo o seu
poder pré-atentivo.

## Página 57

https://pudding.cool/2025/04/birthday-effect/

## Página 58

Figure 4.15 from storytelling with data by Cole Nussbaumer Knaflic

## Página 59

Use cor consistentemente
O público normalmente leva tempo para se familiarizar
com o significado das cores que você está usando no
início da sua visualização e vai assumir que os mesmos
detalhes se aplicam para todo o resto da visualização.
Não confunda o seu público alterando o uso da cor.

## Página 60

Não se esqueça dos daltônicos
Evite usar tons de vermelho e tons de verde ao mesmo
tempo.
Veja os seus gráficos com olhos de daltônicos (ver slide
com os simuladores).
Porém, às vezes existe uma conotação associada ao uso
de verde e vermelho, nesse caso, use redundância através
de outros canais visuais (saturação, brilho, símbolos, etc.)

## Página 61

Cuidado com o sentimento que a
cor transmite
Cor suscita emoção:
O assunto da visualização é sério ou leve?  
Cores possuem conotações culturais diferentes.

## Página 62

[Sem texto extraível nesta página.]

## Página 63

Mapeando outros canais
Tamanho
Comprimento acurado, área 2D
ok, volume 3d ruim
Ângulo
Acurácia não linear (horizontal,
vertical, diagonal)

## Página 64

Ângulo

## Página 65

Mapeando outros canais
Forma
Combinação complexa de primitivas
geométricas
Muitos bins
Movimento
Altamente separável de elementos estáticos
Binário: ótimo para ênfase
Usar com cuidado para evitar irritação do
usuário

## Página 66

Para saber mais…
Série de posts sobre uso de cor em visualização:
Subtleties of Color
How The Rainbow Color Map Misleads
Being clever with color (video)
Your Friendly Guide to Colors in Data Visualization
Veja a seção de mapas de cores na página de recursos
do site do curso

## Página 67

Podcasts sobre cores
Como funciona o daltonismo? Podcast Naruhodo! #193
Todos nós enxergamos as mesmas cores? Parte 1 de 2
Podcast Naruhodo! #227
Todos nós enxergamos as mesmas cores? Parte 2 de 2
Podcast Naruhodo! #228
Colors - Series of episodes about colors from Radiolab
podcast
