# 📊 Estrutura Visual do Projeto Delucena

## 🗂️ Árvore de Diretórios Completa

```
delucena/
│
├── 📄 Arquivos de Configuração
│   ├── package.json              # Config NPM (scripts, metadados)
│   ├── package-lock.json         # Lock file NPM
│   ├── LICENSE                    # Licença MIT
│   ├── README.md                  # Documentação principal
│   ├── DOCUMENTACAO.md           # Documentação técnica completa
│   ├── ESTRUTURA_PROJETO.md       # Este arquivo
│   ├── CONTRIBUTING.md            # Guia de contribuição
│   ├── SECURITY.md                # Política de segurança
│   ├── CHANGELOG.md               # Histórico de mudanças
│   ├── TERMINAL_EXTENSIBILITY.md  # Guia de extensibilidade do terminal
│   ├── .gitignore                 # Arquivos ignorados pelo Git
│   ├── .editorconfig              # Configuração do editor
│   └── .gitattributes             # Atributos Git
│
├── 🔨 Scripts de Build
│   ├── build.js                   # Build Node.js (templates, minificação)
│   └── build.sh                   # Build Bash (alternativo)
│
├── 📁 scripts/                    # Scripts auxiliares
│   └── optimize-images.js         # Otimização de imagens
│
├── 📁 src/                        # CÓDIGO-FONTE
│   │
│   ├── 🎨 Frontend Principal
│   │   ├── index.html             # HTML base (montado a partir de templates)
│   │   ├── 404.html               # Página de erro 404
│   │   │
│   │   ├── 📁 templates/          # Templates HTML modulares
│   │   │   ├── navigation.html     # Barra lateral de navegação
│   │   │   ├── editor-header.html # Cabeçalho do editor (abas)
│   │   │   ├── footer.html         # Rodapé
│   │   │   ├── sections/           # Seções de conteúdo
│   │   │   │   ├── index-section.html
│   │   │   │   ├── experience-section.html
│   │   │   │   ├── skills-section.html
│   │   │   │   ├── contact-section.html
│   │   │   │   └── readme-section.html
│   │   │   └── terminal/           # Templates do terminal
│   │   │       ├── terminal.html
│   │   │       ├── terminal-header.html
│   │   │       └── terminal-tabs/
│   │   │           ├── problems-tab.html
│   │   │           ├── output-tab.html
│   │   │           ├── terminal-tab.html
│   │   │           ├── debug-tab.html
│   │   │           └── ports-tab.html
│   │   │
│   │   ├── 📁 css/                # CSS modular
│   │   │   ├── main.css            # Arquivo principal (importa todos via @import)
│   │   │   ├── critical.css       # CSS crítico (above the fold, injetado inline)
│   │   │   ├── variables.css      # Variáveis CSS (tema dark/light, cores)
│   │   │   ├── reset.css          # Reset CSS e normalização
│   │   │   ├── layout.css          # Layout principal (grid, flexbox)
│   │   │   ├── icons.css          # Estilos de ícones
│   │   │   ├── editor-ui-wrapper.css # Wrapper do editor
│   │   │   ├── navigation.css     # Barra de navegação lateral
│   │   │   ├── explorer.css        # Explorer de arquivos
│   │   │   ├── extensions.css     # Extensões/Formação acadêmica
│   │   │   ├── editor.css          # Editor de código e abas
│   │   │   ├── syntax-highlight.css # Syntax highlighting (cores VSCode)
│   │   │   ├── terminal.css       # Terminal (wrapper)
│   │   │   ├── utilities.css      # Classes utilitárias
│   │   │   └── terminal/          # CSS do terminal modular
│   │   │       ├── terminal-base.css
│   │   │       ├── terminal-problems.css
│   │   │       ├── terminal-output.css
│   │   │       ├── terminal-terminal.css
│   │   │       ├── terminal-debug.css
│   │   │       └── terminal-ports.css
│   │   │
│   │   ├── 📁 js/                 # JavaScript modular
│   │   │   ├── main.js            # Inicialização de módulos
│   │   │   ├── theme.js           # Gerenciamento de temas (essencial)
│   │   │   ├── navigation.js      # Navegação e explorer (essencial)
│   │   │   ├── header-command-palette.js # Command palette (essencial)
│   │   │   ├── editor-tabs.js     # Gerenciamento de abas (essencial)
│   │   │   ├── code-highlighter.js # Syntax highlighting (não essencial)
│   │   │   ├── code-copy.js       # Cópia de código (não essencial)
│   │   │   ├── preview-toggle.js  # Alternância preview/código (não essencial)
│   │   │   ├── explorer-actions.js # Ações do explorer (não essencial)
│   │   │   ├── explorer-controls.js # Controles do explorer (não essencial)
│   │   │   ├── explorer-highlight.js # Destaque do explorer (não essencial)
│   │   │   ├── explorer-resize.js # Redimensionamento do explorer (não essencial)
│   │   │   ├── terminal.js        # Terminal (wrapper)
│   │   │   ├── terminal-resize.js # Redimensionamento do terminal (não essencial)
│   │   │   ├── output.js          # Simulação de output Maven (não essencial)
│   │   │   └── terminal/          # Módulos do terminal (não essenciais)
│   │   │       ├── terminal-core.js
│   │   │       ├── terminal-terminal.js
│   │   │       └── terminal-output.js
│   │   │
│   │   │   **Nota**: Scripts marcados como "não essenciais" são consolidados
│   │   │   em um bundle que carrega após o First Contentful Paint (FCP).
│   │   │
│   │   ├── 📁 data/               # Dados do portfólio (JSON)
│   │   │   ├── profile.json       # Perfil pessoal (nome, bio, imagem)
│   │   │   ├── experience.json    # Experiências profissionais
│   │   │   ├── skills.json        # Habilidades técnicas por categoria
│   │   │   ├── contact.json       # Links de contato e redes sociais
│   │   │   ├── meta.json          # Meta tags para SEO e redes sociais
│   │   │   ├── pages.json         # Configuração de páginas (habilitar/desabilitar)
│   │   │   └── README.md          # Documentação dos dados JSON
│   │   │
│   │   ├── 📁 assets/            # Recursos estáticos
│   │   │   ├── favicon.svg        # Favicon
│   │   │   ├── icons.svg          # Ícones SVG
│   │   │   └── images/            # Imagens
│   │   │       ├── profile.png
│   │   │       ├── profile.webp
│   │   │       └── profile-*.avif # Versões otimizadas (480w, 768w, 1200w)
│   │   │
│   │   └── 📁 config/             # Arquivos de configuração
│   │       ├── _headers           # Headers Cloudflare Pages
│   │       ├── robots.txt          # Configuração para crawlers
│   │       └── sitemap.xml         # Mapa do site
│   │
│   └── ☕ Backend Spring Boot
│       └── main/
│           ├── java/
│           │   └── com/delucena/dev/
│           │       └── Application.java    # Classe principal Spring Boot
│           │
│           └── resources/
│               ├── application.properties   # Config Spring
│               ├── application.yml         # Config Spring YAML
│               └── static/                  # Arquivos estáticos HTML
│                   ├── index.html          # Página inicial
│                   ├── contact.html        # Contato
│                   ├── experience.html     # Experiência
│                   └── skills.html         # Habilidades
│
└── 📦 dist/                       # ARQUIVOS COMPILADOS (gerados pelo build)
    ├── index.html                 # HTML final (montado, minificado, otimizado)
    ├── 404.html                   # Página 404 (minificada)
    ├── css/                       # CSS consolidado e minificado
    │   ├── main.css              # CSS consolidado (sem @import)
    │   ├── main.{hash}.min.css   # CSS minificado com hash (cache busting)
    │   └── critical.css          # CSS crítico (cópia, também injetado inline)
    ├── js/                        # JS minificado
    │   ├── *.min.js              # Scripts minificados individuais
    │   ├── *.{hash}.min.js       # Scripts com hash (cache busting)
    │   ├── non-essential-bundle.js # Bundle não essencial (debug)
    │   └── non-essential-bundle.{hash}.min.js # Bundle minificado com hash
    ├── assets/                    # Assets copiados (imagens, favicons)
    ├── robots.txt                 # Configuração SEO
    ├── sitemap.xml                # Mapa do site
    └── _headers                    # Headers Cloudflare
```

---

## 🎯 Componentes do Portfólio delucena.dev

### Estrutura do `index.html`

```
index.html
│
├── <head>
│   ├── Meta tags
│   ├── Bootstrap 5.3.2 (CDN)
│   ├── Font Awesome 6.5.1 (CDN)
│   └── style.css (local)
│
├── <main>
│   │
│   ├── #navigation (Sidebar)
│   │   ├── .menu (Barra lateral esquerda)
│   │   │   ├── Hamburger menu
│   │   │   ├── Explorer icon
│   │   │   ├── Extensions icon
│   │   │   ├── GitHub icon
│   │   │   └── Settings menu
│   │   │       ├── Account menu
│   │   │       └── Settings menu
│   │   │
│   │   ├── .explorer (Explorer de arquivos)
│   │   │   ├── Estrutura do projeto
│   │   │   └── Outline/Timeline
│   │   │
│   │   └── .extensions (Extensões/Formação)
│   │       ├── INSTALLED (8 itens)
│   │       └── RECOMMENDED (6 itens)
│   │
│   └── #editor (Área principal)
│       ├── #header (Abas de arquivos)
│       │   ├── index.html
│       │   ├── experience.html
│       │   ├── skills.html
│       │   ├── contact.html
│       │   └── README.md
│       │
│       ├── .editor (Conteúdo editável)
│       │   ├── #_index_ (Apresentação)
│       │   ├── #_experience_ (Experiências)
│       │   ├── #_skills_ (Habilidades)
│       │   ├── #_contact_ (Contatos)
│       │   └── #_readme_ (README)
│       │
│       └── .terminal (Terminal simulado)
│           ├── .header (Abas do terminal)
│           │   ├── PROBLEMS
│           │   ├── OUTPUT
│           │   ├── TERMINAL
│           │   ├── DEBUG CONSOLE
│           │   └── PORTS
│           │
│           └── .content (Conteúdo das abas)
│               ├── .problems (Lista de problemas)
│               ├── .output (Logs Maven)
│               ├── .terminal-content (Simulação terminal)
│               ├── .debug (Console de debug)
│               └── .ports (Portas em uso)
│
└── #footer (Rodapé)
    ├── Branch info
    ├── Error/Warning counts
    ├── Encoding
    └── Language
```

---

## 🎨 Sistema de Estilos CSS Modular

### Organização dos Arquivos CSS

```
css/
│
├── main.css                    # Arquivo principal (importa todos via @import)
├── critical.css                # CSS crítico (above the fold, injetado inline)
│
├── variables.css               # Variáveis CSS (tema dark/light, cores)
├── reset.css                   # Reset CSS e normalização
├── layout.css                  # Layout principal (body, main, grid)
├── icons.css                   # Estilos de ícones
├── editor-ui-wrapper.css      # Wrapper do editor
├── utilities.css               # Classes utilitárias
│
├── navigation.css              # Barra lateral de navegação
├── explorer.css                # Explorer de arquivos
├── extensions.css              # Extensões/Formação acadêmica
│
├── editor.css                  # Editor de código e abas
├── syntax-highlight.css        # Syntax highlighting (cores VSCode)
│
├── terminal.css                # Terminal (wrapper e estilos gerais)
└── terminal/                   # CSS modular do terminal
    ├── terminal-base.css       # Base e layout do terminal
    ├── terminal-problems.css   # Aba Problems
    ├── terminal-output.css     # Aba Output
    ├── terminal-terminal.css   # Aba Terminal
    ├── terminal-debug.css      # Aba Debug Console
    └── terminal-ports.css      # Aba Ports
```

**Nota**: O `critical.css` é injetado inline no `<head>` durante o build para melhorar o First Contentful Paint (FCP).

### Fluxo de Importação CSS

```
main.css
│
├── @import url('./variables.css')
├── @import url('./reset.css')
├── @import url('./layout.css')
├── @import url('./icons.css')
├── @import url('./editor-ui-wrapper.css')
├── @import url('./navigation.css')
├── @import url('./explorer.css')
├── @import url('./extensions.css')
├── @import url('./editor.css')
├── @import url('./terminal/terminal-base.css')
├── @import url('./terminal/terminal-problems.css')
├── @import url('./terminal/terminal-output.css')
├── @import url('./terminal/terminal-terminal.css')
├── @import url('./terminal/terminal-debug.css')
├── @import url('./terminal/terminal-ports.css')
├── @import url('./syntax-highlight.css')
└── @import url('./utilities.css')
```

**Nota**: O `critical.css` não é importado em `main.css`. Ele é injetado inline no `<head>` durante o build.

### Build Process

O script `build.js` realiza as seguintes operações:

1. **Consolidação CSS**: Resolve todos os `@import` em `main.css`, gerando um único arquivo consolidado em `dist/css/main.css`
2. **Minificação**: Minifica o CSS consolidado usando CleanCSS
3. **Hash de Cache**: Gera versão com hash SHA-256: `main.{hash}.min.css`
4. **CSS Crítico Inline**: Injeta `critical.css` minificado inline no `<head>` do HTML
5. **Versionamento**: Atualiza referências no HTML para usar versões com hash

Isso permite que o HTML funcione mesmo abrindo diretamente no navegador (após o build), e melhora a performance com cache busting e CSS crítico inline.

---

## 🧩 Sistema de Templates e Dados JSON

O projeto utiliza um sistema de templates modulares com injeção de dados JSON, onde o `index.html` é montado a partir de componentes HTML reutilizáveis.

### Como Funciona

1. **HTML Base** (`src/index.html`): Contém a estrutura principal e placeholders como `<!-- TEMPLATE: navigation.html -->`
2. **Templates** (`src/templates/`): Componentes HTML modulares com sintaxe de templates
3. **Dados JSON** (`src/data/`): Dados do portfólio em formato JSON
4. **Build Script** (`build.js`): 
   - Carrega dados JSON
   - Processa templates com injeção de dados
   - Substitui placeholders pelos templates processados
   - Minifica HTML final
5. **Resultado** (`dist/index.html`): HTML final consolidado, minificado e otimizado

### Sintaxe de Templates

Os templates suportam uma sintaxe simples similar a Handlebars:

- **Variáveis Simples**: `{{profile.name}}`, `{{contact.linkedin.url}}`
- **Loops**: `{{#each experience}}...{{/each}}`
- **Condicionais**: `{{#if responsibilities}}...{{/if}}`
- **Acesso Aninhado**: `{{profile.readme.greeting}}`, `{{meta.og.title}}`
- **Item Atual em Loop**: `{{this}}` (para arrays de strings)

### Arquivos de Dados

- **`profile.json`**: Nome, biografia, imagem de perfil, informações pessoais
- **`experience.json`**: Array de experiências profissionais
- **`skills.json`**: Objeto com categorias de habilidades
- **`contact.json`**: Links de contato e redes sociais
- **`meta.json`**: Meta tags para SEO e redes sociais (Open Graph, Twitter Cards)
- **`pages.json`**: Configuração de páginas (habilitar/desabilitar seções)

Consulte `src/data/README.md` para documentação completa dos arquivos JSON.

### Estrutura de Templates

```
templates/
├── navigation.html          # Barra lateral completa
├── editor-header.html      # Cabeçalho com abas do editor
├── footer.html             # Rodapé
├── sections/               # Seções de conteúdo do portfólio
│   ├── index-section.html
│   ├── experience-section.html
│   ├── skills-section.html
│   ├── contact-section.html
│   └── readme-section.html
└── terminal/              # Terminal modular
    ├── terminal.html       # Estrutura base do terminal
    ├── terminal-header.html # Cabeçalho com abas do terminal
    └── terminal-tabs/      # Abas individuais do terminal
        ├── problems-tab.html
        ├── output-tab.html
        ├── terminal-tab.html
        ├── debug-tab.html
        └── ports-tab.html
```

### Vantagens

- ✅ **Modularidade**: Cada componente é independente
- ✅ **Reutilização**: Templates podem ser reutilizados
- ✅ **Manutenibilidade**: Fácil localizar e editar componentes
- ✅ **Organização**: Estrutura clara e lógica

---

## 🔄 Fluxo de Funcionamento

### 1. Carregamento da Página

```
1. Browser carrega index.html (montado a partir de templates)
2. Carrega CSS (main.css consolidado ou módulos via @import)
3. Carrega CDNs (Bootstrap, Font Awesome)
4. Carrega JavaScript modular (módulos ES6)
5. Aplica estilos CSS
6. JavaScript inicializa módulos (theme, navigation, terminal, etc.)
```

### 2. Interação do Usuário

```
Usuário clica em arquivo no Explorer
    ↓
Radio button #arquivo fica :checked
    ↓
CSS detecta via :has(#arquivo:checked)
    ↓
Aplica display: block na seção correspondente
    ↓
Arquivo é exibido no editor
```

### 3. Sistema de Temas

```
Usuário clica em "Tema" no menu
    ↓
Checkbox #theme fica :checked
    ↓
CSS detecta body:has(#theme:checked)
    ↓
Aplica variáveis CSS do tema Light
    ↓
Toda a interface muda de cor
```

### 4. Expansão de Pastas

```
Usuário clica em pasta
    ↓
Checkbox da pasta fica :checked
    ↓
CSS detecta .folder ~ input:checked ~ ul
    ↓
Aplica display: block na <ul>
    ↓
Pasta expande mostrando conteúdo
```

---

## 📊 Estatísticas do Projeto

### Arquivos
- **Total de arquivos**: ~70+ arquivos
- **Templates HTML**: ~15 arquivos modulares
- **Arquivos CSS**: ~20 arquivos modulares
- **Arquivos JavaScript**: ~20 arquivos modulares
- **Arquivos de Dados**: 6 arquivos JSON
- **Linhas de código HTML**: ~1500+ linhas (templates modulares)
- **Linhas de código CSS**: ~3000+ linhas (CSS modular, incluindo critical.css)
- **Linhas de código JavaScript**: ~2500+ linhas (JS modular)
- **Linhas de código Java**: ~12 linhas (Application.java)

### Tecnologias
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Java, Spring Boot
- **Build Tools**: Node.js, Bash
- **Dependências Externas**: Bootstrap 5.3.2 (CDN), Font Awesome 6.5.1 (CDN)

### Arquitetura
- **Sistema de Templates**: HTML modular e reutilizável
- **CSS Modular**: Arquivos separados por funcionalidade
- **JavaScript Modular**: Módulos ES6 com IIFE
- **Build System**: Consolidação automática de CSS/JS

### Funcionalidades CSS-Only
- ✅ Navegação entre arquivos (radio buttons + `:has()`)
- ✅ Expansão de pastas (checkboxes + `:checked`)
- ✅ Alternância de temas (dark/light) via variáveis CSS
- ✅ Menu de configurações
- ✅ Destaque de arquivo ativo
- ✅ Responsividade mobile (media queries)
- ✅ Sistema de abas do terminal
- ✅ Layout responsivo com Grid e Flexbox

### Funcionalidades JavaScript
- ⚙️ **Essenciais** (carregam com `defer`):
  - Gerenciamento de temas
  - Navegação e explorer
  - Command palette
  - Gerenciamento de abas do editor
  
- ⚙️ **Não Essenciais** (bundle após FCP):
  - Simulação de terminal interativo
  - Simulação de output Maven
  - Syntax highlighting de código
  - Cópia de código para clipboard
  - Alternância preview/código
  - Ações e controles do explorer
  - Redimensionamento de componentes
  - Scroll automático

---

## 🎯 Pontos de Entrada

### Para Desenvolvedores Frontend

#### Editar Conteúdo
- **Seções do portfólio**: `src/templates/sections/*.html`
- **Navegação**: `src/templates/navigation.html`
- **Terminal**: `src/templates/terminal/`
- **HTML base**: `src/index.html` (contém placeholders para templates)

#### Modificar Estilos
- **CSS principal**: `src/css/main.css` (importa todos os módulos)
- **Variáveis de tema**: `src/css/variables.css`
- **Estilos específicos**: Editar o módulo CSS correspondente
- **Terminal**: `src/css/terminal/*.css`

#### Adicionar Funcionalidades
- **JavaScript**: Adicionar módulo em `src/js/`
- **Registrar módulo**: Adicionar import em `src/index.html`
- **Inicialização**: Adicionar em `src/js/main.js` se necessário

### Para Desenvolvedores Backend
1. **Aplicação Spring**: `src/main/java/com/delucena/dev/Application.java`
2. **Configurações**: `src/main/resources/application.yml`
3. **Arquivos estáticos**: `src/main/resources/static/`

### Para Build/Deploy
1. **Instalar dependências**: `npm install` (primeira vez)
2. **Build frontend**: `npm run build` (gera `dist/` com arquivos consolidados, minificados e com hash)
3. **Limpar build**: `npm run clean` (remove `dist/`)
4. **Preview local**: `npm run serve` (build + servidor HTTP na porta 8000)
5. **Arquivos finais**: `dist/` (pronto para deploy)
6. **Deploy**: Hospedar pasta `dist/` (Cloudflare Pages, Netlify, Vercel, etc.)

**Otimizações do Build**:
- ✅ CSS consolidado (sem `@import`)
- ✅ CSS crítico inline no `<head>`
- ✅ Minificação agressiva (CSS, JS, HTML)
- ✅ Versionamento com hash (cache busting)
- ✅ Bundle de scripts não essenciais
- ✅ Preload de recursos críticos

---

## 🔍 Arquivos Importantes

### Arquivos Principais
- `src/index.html` - **HTML base** (montado a partir de templates)
- `src/css/main.css` - **CSS principal** (importa todos os módulos)
- `src/css/critical.css` - **CSS crítico** (above the fold, injetado inline)
- `src/js/main.js` - **JavaScript principal** (inicialização)
- `src/main/java/.../Application.java` - **Backend Spring Boot**

### Templates HTML
- `src/templates/sections/*.html` - **Conteúdo do portfólio** (5 seções)
- `src/templates/navigation.html` - **Barra lateral**
- `src/templates/terminal/` - **Terminal e abas** (6 templates)
- `src/templates/top-header.html` - **Cabeçalho superior**
- `src/templates/editor-header.html` - **Cabeçalho do editor**
- `src/templates/footer.html` - **Rodapé**

### Arquivos de Dados
- `src/data/profile.json` - **Perfil pessoal**
- `src/data/experience.json` - **Experiências profissionais**
- `src/data/skills.json` - **Habilidades técnicas**
- `src/data/contact.json` - **Contatos e redes sociais**
- `src/data/meta.json` - **Meta tags SEO**
- `src/data/pages.json` - **Configuração de páginas**

### Arquivos de Configuração
- `package.json` - Scripts NPM e metadados
- `build.js` - Script de build otimizado (Node.js)
- `src/config/` - Configurações SEO e deploy (robots.txt, sitemap.xml, _headers)

### Arquivos Gerados (não versionados)
- `dist/` - Build de produção (gerado pelo `npm run build`)
- `target/` - Compilados Java (gerado pelo Maven)

---

**Última atualização**: 2025  
**Mantido por**: Delucena
