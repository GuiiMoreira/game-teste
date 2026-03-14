# Rua de Pixel — README

Beat ’em up 2D em pixel art para navegador inspirado no feeling arcade de jogos como **Little Fighter**, mas com identidade própria e foco em combate rápido e responsivo.

Este documento define **visão do projeto, arquitetura técnica, estrutura de pastas, cenas, classes principais e ordem de implementação**.

---

# 🎮 Visão do Projeto

**Nome provisório:** Rua de Pixel
**Gênero:** Beat ’em up 2D
**Plataforma:** Web (browser)
**Engine:** Phaser.js
**Linguagem:** TypeScript
**Build Tool:** Vite

O objetivo inicial é criar um **MVP jogável** que prove que o combate é divertido e que a base técnica funciona.

---

# 🧭 Escopo do MVP

O MVP precisa conter:

### Personagem Jogável

* andar
* correr
* pular
* soco
* chute
* combo simples (3 hits)
* ataque aéreo
* receber dano
* cair e levantar

### Inimigos

* Capanga leve
* Brutamonte

### Fase

* 1 fase jogável
* 3 áreas de combate
* ondas de inimigos

### UI

* barra de vida
* tela inicial
* game over

---

# 🧱 Stack Tecnológica

* **Phaser.js** → engine de jogo
* **TypeScript** → tipagem e organização
* **Vite** → dev server e build
* **Tiled (opcional)** → mapas e cenários
* **Aseprite / IA pipeline** → sprites pixel art

---

# 📂 Estrutura de Pastas

```
rua-de-pixel
│
├── public
│   ├── assets
│   │   ├── sprites
│   │   │   ├── player
│   │   │   ├── enemies
│   │   │   └── effects
│   │   │
│   │   ├── tiles
│   │   ├── maps
│   │   ├── ui
│   │   └── audio
│   │
│   └── index.html
│
├── src
│   ├── main.ts
│   ├── game.ts
│   │
│   ├── scenes
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   ├── MenuScene.ts
│   │   ├── GameScene.ts
│   │   └── UIScene.ts
│   │
│   ├── entities
│   │   ├── Player.ts
│   │   ├── Enemy.ts
│   │   ├── LightEnemy.ts
│   │   └── HeavyEnemy.ts
│   │
│   ├── combat
│   │   ├── Hitbox.ts
│   │   ├── Hurtbox.ts
│   │   ├── AttackData.ts
│   │   └── CombatSystem.ts
│   │
│   ├── systems
│   │   ├── StateMachine.ts
│   │   ├── InputManager.ts
│   │   ├── EnemyAI.ts
│   │   └── WaveManager.ts
│   │
│   ├── ui
│   │   ├── HealthBar.ts
│   │   └── HUD.ts
│   │
│   ├── config
│   │   ├── GameConfig.ts
│   │   └── Controls.ts
│   │
│   └── utils
│       ├── MathUtils.ts
│       └── DebugDraw.ts
│
└── package.json
```

---

# 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura **componentizada simples**, separando responsabilidades principais:

### Camadas

```
Game
│
├─ Scenes
│
├─ Entities
│
├─ Combat
│
├─ Systems
│
└─ UI
```

### Descrição

**Scenes**
Controlam o fluxo do jogo.

**Entities**
Objetos interativos do jogo (player, inimigos).

**Combat**
Sistema de hitboxes, dano e impacto.

**Systems**
Lógica reutilizável como IA, estados e input.

**UI**
Interface visual do jogador.

---

# 🎬 Cenas do Jogo

## BootScene

Responsável por:

* configurar o Phaser
* preparar escalas
* iniciar preload

Fluxo:

```
BootScene
↓
PreloadScene
```

---

## PreloadScene

Carrega todos os assets necessários.

Exemplos:

* spritesheets
* áudio
* tilesets
* UI

Após carregar:

```
PreloadScene
↓
MenuScene
```

---

## MenuScene

Tela inicial.

Funções:

* iniciar jogo
* mostrar título
* possivelmente opções futuras

Fluxo:

```
MenuScene
↓
GameScene
```

---

## GameScene

Cena principal do gameplay.

Responsável por:

* spawn do player
* spawn de inimigos
* colisões
* lógica da fase
* waves de inimigos
* comunicação com UI

---

## UIScene

Overlay da interface.

Elementos:

* barra de vida
* contadores
* feedback visual

Separar UI evita misturar lógica com gameplay.

---

# 👤 Entidades

## Player

Responsável por:

* movimento
* ataques
* animações
* receber dano
* estados do personagem

Estados principais:

```
Idle
Walk
Run
Jump
Fall
Attack
Hurt
KnockedDown
GetUp
```

---

## Enemy (base)

Classe base para inimigos.

Contém:

* vida
* sistema de dano
* movimento básico
* ligação com EnemyAI

---

## LightEnemy

Inimigo rápido.

Características:

* pouca vida
* aproxima e ataca rápido

---

## HeavyEnemy

Inimigo forte.

Características:

* lento
* muito dano
* grande knockback

---

# ⚔ Sistema de Combate

O combate usa três elementos principais:

```
BodyBox
Hitbox
Hurtbox
```

### BodyBox

Corpo físico da entidade.

Responsável por:

* colisão
* posição no mundo

---

### Hitbox

Área de ataque ativa.

Contém:

* dano
* duração
* knockback
* direção

---

### Hurtbox

Área onde a entidade pode receber dano.

---

### AttackData

Define propriedades de cada golpe:

```
damage
startupFrames
activeFrames
recoveryFrames
knockback
hitstun
range
```

---

# 🧠 Sistemas

## StateMachine

Gerencia estados de entidades.

Exemplo de fluxo:

```
Idle → Walk → Attack → Recovery → Idle
```

Isso evita lógica confusa.

---

## InputManager

Controla inputs do jogador.

Exemplo:

```
WASD → movimento
J → soco
K → chute
Space → pulo
```

---

## EnemyAI

Define comportamento dos inimigos:

* aproximar jogador
* escolher distância
* atacar
* recuar
* reagir ao dano

---

## WaveManager

Gerencia ondas de inimigos.

Funções:

* spawn
* progressão da fase
* controle de áreas de combate

---

# 🧩 Interface

## HealthBar

Mostra vida do jogador.

---

## HUD

Contém:

* barra de vida
* possivelmente energia
* feedback visual

---

# 🔄 Fluxo do Jogo

```
BootScene
↓
PreloadScene
↓
MenuScene
↓
GameScene
↓
GameOver / Restart
```

---

# 📦 Pipeline de Sprites

Sprites podem ser criados usando:

* pixel art manual
* geração via IA
* normalização de spritesheets

Workflow sugerido:

```
Seed sprite
↓
Generate animation strip
↓
Normalize frames
↓
Export spritesheet
↓
Import into Phaser
```

---

# 🧪 Estratégia de Desenvolvimento

Evitar focar em arte no começo.

Usar:

* sprites temporários
* caixas coloridas
* animações simples

Objetivo inicial:

**provar que o combate é divertido**

---

# 🚀 Ordem de Implementação

## Fase 1 — Fundação

1. Criar projeto Phaser + Vite + TypeScript
2. Implementar BootScene
3. Implementar PreloadScene
4. Implementar MenuScene

---

## Fase 2 — Player básico

5. Criar Player entity
6. Implementar InputManager
7. Implementar movimento
8. Implementar pulo

---

## Fase 3 — Combate

9. Criar sistema de hitbox
10. Implementar soco
11. Implementar dano
12. Implementar knockback

---

## Fase 4 — Inimigos

13. Criar Enemy base
14. Criar LightEnemy
15. Implementar EnemyAI
16. Sistema de morte

---

## Fase 5 — Gameplay

17. Implementar WaveManager
18. Criar primeira fase
19. Spawn de inimigos

---

## Fase 6 — Interface

20. Criar UIScene
21. Implementar HealthBar
22. Feedback visual

---

## Fase 7 — Polimento

23. Animações definitivas
24. efeitos
25. sons
26. balanceamento

---

# 🎯 Objetivo da Versão 1.0

Entregar uma **demo curta jogável** com:

* combate satisfatório
* controles responsivos
* identidade visual pixel
* uma fase completa

Isso valida o projeto antes de expandir para:

* novos personagens
* novas fases
* multiplayer
* sistema de progressão
