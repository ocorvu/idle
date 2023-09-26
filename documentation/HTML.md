# A estrutura

## head

a tag `<head>` está encarregada apenas de importar as dependencias __CSS__ onde a ordem (por enquanto) tem importância crucial.

Os estilos do arquivo `settings.css` sempre devem ser importados primeiro senão as funcionalidades não funcionam corretamente. _(precisa de correção)_

Sendo assim, a ordem de importação até o momento é a seguinte:

```html
<head>
    <link rel="stylesheet" href="css/settings.css">
    <link rel="stylesheet" href="css/app.css">
    <link rel="stylesheet" href="css/upgrades.css">
    <link rel="stylesheet" href="css/achievements.css">
    <link rel="stylesheet" href="css/card.css">
    <link rel="stylesheet" href="css/progress.css">
</head>
```

Por enquanto, ainda está presente o __import do script__ do Bootstrap5, que será removido em breve. Isso irá ocorrer pois a intenção desse projeto é fazer tudo (ou quase tudo) da maneira mais manual possível.

_OBS: Quando me refiro a "apenas de importar as dependências CSS" estou excluindo as __tagso brigatórias__ `<meta>` e `<title>`._

## body

A divisão do `<body>` foi feita da seguinte maneira:

```html
<body>
    <header id="main-header"></header>
    <section></section>
    <main></main>
    <section id="feed"></section>
</body>
```

Conforme o snippet acima temos a divisão _do_ `<body>` em quatro blocos.

### header - main-header

Aqui está definido o cabeçalho principal da página. Nele, serão exibidos o logo, os botões de navegação (desktop e mobile) e também os __pontos__ do jogador.

```html
<header id="main-header">
    <img id="logo">
    <div id="box">
    <nav>
        <a><img alt="Upgrades"></a>
        <a><img alt="Achievements"></a>
        <a><img alt="Config"></a>
        <a><img alt="Info"></a>
    </nav>
</header>
```

A `<div>` tem a função de exibir os pontos que o jogador possui no momento.

### section

A `<section>` tem a função de guardar os menus __Information__ e __Config__:

- Information: o jogador tem acesso a informações gerais sobre o seu progresso no jogo;
- Config: configurações gerais do jogo como volume, tema (dark e light) e botão "Salvar Progresso".

```html
<section>
    <section data-content="information" class="hide settings">
        <div class="settings-header">
                <h2>Info</h2>
        <button class="settings-close-button"></button>
        <p>Points: <span id="clicks">0</span></p>
    </section>
    <section data-content="config" class="hide settings">
        <header class="settings-header">
            <h2 class="settings-title">Settings</h2>
            <button class="settings-close-button">X</button>
        </header>
        <section class="settings-music">
            <p>Music
                <span>
                    <button class="settings-music-button" data-music="off">OFF</button>
                    <button class="settings-music-button settings-music-button-active" data-music="on">ON</button>
                </span>
            </p>
        </section>
        <section class="settings-volume">
            <p>Volume
                <input type="range" name="volume" id="volume" min="0" max="1" step="0.05" value="0.25">
            </p>
        </section>
        <section class="settings-save">
            <p>
                <button id="save">Save</button>
                <span id="saveMessage" class="hide">Salvo com sucesso!</span>
            </p>
        </section>
    </section>
</section>
```

### main

A `<main>` está divida em três blocos: Upgrades, Game e Achievements.

- Upgrades: menu lateral à direita onde o jogador consegue subir e ver os níveis dos personagems;
- Game: onde está definida a área reservada apenas para a _"gameplay"_ do jogo, onde são exibidos os cards dos personagens;
- Achievements: menu lateral à esquerda onde o jogador consegue visualizar as conquistas obtidas por cada personagem.

```html
<main>
    <aside id="upgrades"></aside>
    <section id="game"></section>
    <aside id="achievements"></aside>
</main>
```

#### aside - upgrades

As informações exibidas para cada personagem no menu __Upgrades__ é:

- Nome do personagem;
- Nível atual;
- Custo para o próximo nível;

```html
<aside id="upgrades" class="upgrades-md" data-content="upgrades">
    <section id="upgrades-content">
        <header id="upgrades-header">
            <h2>Upgrades<img src="icons/icons8-comprar-atualização-30 (1).png"></h2>
            <button type="button" class="close hide" aria-label="Close">X</button>
        </header>
        <ul id="upgrades-body">
            <!-- hero1 -->
            <li id="hero1" class="hero" data-heroes="hero1" data-bs-container="body" data-bs-toggle="tooltip"
                data-bs-placement="right" data-bs-html="true">
                <div class="hero-body">
                    <div>
                        <h3 data-heroes-name="hero1"></h3>
                        <small class="hero-cost">
                            Cost:
                            <span class="hero-cost-value" data-heroes-cost="hero1"></span>
                        </small>
                    </div>
                    <span class="hero-level" data-heroes-level="hero1"></span>
                </div>
            </li>
            <!-- para cada herói temos um novo <li> -->
        </ul>
    </section>
    <button class="hide close-bar" data-close-button="upgrades"></button>
</aside>
```

#### section - game

A `<section>` game é divida em outras duas onde uma tem a função de exibir as cartas dos personagens - inimigos, e a outra de exibir os personagems - heróis.

Cada carta de personagem exibe por padrão as seguintes informações:

- Nome;
- Barra de HP;
- ATK;
- DEF;

Caso seja um inimigo, o botão de `Alvo` será exibido. Caso seja um herói um botão de `Ataque` será exibido. Indicando que um inimigo `Alvo` irá receber um `Ataque` de um héroi.

```html
<section id="game">
    <h2>Enemies</h2>
    <section id="enemies">
        <!-- Aqui são exibidas as cartas dos inimigos-->
    </section>
    <h2>Heroes</h2>
    <section id="heroes">
        <!-- Aqui são exibidas as cartas dos heróis-->
    </section>
```

Cada `carta` é representada por uma `<section>`:

```html
<section class="card hero-card-border">
    <img class="hero-thumb" src="" alt="Nome do Personagem" />
    <h3>
        Nome do Personagem
    </h3>
    <p>
        HP: <span>Atual</span>/<span>Total</span>
        <progress class="enemie-hp" max="HP Total" value="HP Atual">70</progress>
    </p>
    <p>
        ATK: 30
    </p>
    <p>
        DEF: 10
    </p>
    <button>Attack</button>
</section>
```

#### aside - achievements

No menu __Achievements__ são exibidos:

- Nome do personagem;
- Badge de cada conquista desse personagem em forma de lista.

```html
<aside id="achievements" class="achievements-md" data-content="achievements">
    <button class="hide close-bar" data-close-button="achievements"></button>
    <section id="achievements-content">
        <header id="achievements-header">
            <h2>Achievements<img src=""></h2>
            <button type="button" class="close hide" aria-label="Close">X</button>
        </header>
        <ul class="achievements-heroes-list" data-achievement="list">
            <li data-achievement-hero="hero1">
                <h3>Nome do Herói</h3>
                <ul class="achievements-hero-badges">
                    <!-- Aqui são adicionados os badges de cada conquista -->
                </ul>
            </li>
        </ul>
    </section>
</aside>
```

### feed

No feed serão exibidas mensagens referentes as conquitas dos hérois, level ups e relatórios de combate.

```html
<section id="feed">
    <!-- Aqui serão adicionadas sempre ao topo as mensagens -->
    <p class="activity">Welcome! :D</p>
</section>
```
