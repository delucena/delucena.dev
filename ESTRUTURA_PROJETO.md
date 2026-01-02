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
│   │   │   ├── main.css            # Arquivo principal (importa todos)
│   │   │   ├── variables.css      # Variáveis CSS (tema, cores)
│   │   │   ├── reset.css          # Reset CSS
│   │   │   ├── layout.css          # Layout principal
│   │   │   ├── navigation.css     # Barra de navegação
│   │   │   ├── explorer.css        # Explorer de arquivos
│   │   │   ├── extensions.css     # Extensões/Formação
│   │   │   ├── editor.css          # Editor de código
│   │   │   ├── syntax-highlight.css # Syntax highlighting
│   │   │   ├── utilities.css      # Utilitários
│   │   │   ├── terminal.css       # Terminal (wrapper)
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
│   │   │   ├── theme.js           # Gerenciamento de temas
│   │   │   ├── navigation.js      # Navegação e explorer
│   │   │   ├── code-highlighter.js # Syntax highlighting
│   │   │   ├── code-copy.js       # Cópia de código
│   │   │   ├── preview-toggle.js  # Alternância preview/código
│   │   │   ├── output.js          # Simulação de output Maven
│   │   │   ├── terminal.js        # Terminal (wrapper)
│   │   │   └── terminal/          # Módulos do terminal
│   │   │       ├── terminal-core.js
│   │   │       ├── terminal-terminal.js
│   │   │       └── terminal-output.js
│   │   │
│   │   ├── 📁 assets/            # Recursos estáticos
│   │   │   ├── favicon.svg        # Favicon
│   │   │   └── images/            # Imagens
│   │   │       ├── profile.png
│   │   │       └── profile.webp
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
    ├── index.html                 # HTML final (montado)
    ├── 404.html                   # Página 404
    ├── css/                       # CSS consolidado e minificado
    ├── js/                        # JS minificado
    ├── assets/                    # Assets copiados
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
│
├── reset.css                   # Reset CSS e normalização
├── variables.css               # Variáveis CSS (tema dark/light, cores)
├── layout.css                  # Layout principal (body, main, grid)
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

### Fluxo de Importação CSS

```
main.css
│
├── @import url('./reset.css')
├── @import url('./variables.css')
├── @import url('./layout.css')
├── @import url('./navigation.css')
├── @import url('./explorer.css')
├── @import url('./extensions.css')
├── @import url('./editor.css')
├── @import url('./syntax-highlight.css')
├── @import url('./utilities.css')
├── @import url('./terminal.css')
└── @import url('./terminal/terminal-base.css')
    └── (outros módulos do terminal)
```

### Build Process

O script `build.js` consolida todos os `@import` em um único arquivo `main.css` na pasta `dist/`, permitindo que o HTML funcione mesmo abrindo diretamente no navegador.

---

## 🧩 Sistema de Templates

O projeto utiliza um sistema de templates modulares onde o `index.html` é montado a partir de componentes HTML reutilizáveis.

### Como Funciona

1. **HTML Base** (`src/index.html`): Contém a estrutura principal e placeholders como `<!-- TEMPLATE: navigation.html -->`
2. **Templates** (`src/templates/`): Componentes HTML modulares
3. **Build Script** (`build.js`): Substitui os placeholders pelos templates correspondentes
4. **Resultado** (`dist/index.html`): HTML final consolidado

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
- **Total de arquivos**: ~50+ arquivos
- **Linhas de código HTML**: ~1000+ linhas (templates modulares)
- **Linhas de código CSS**: ~2000+ linhas (CSS modular)
- **Linhas de código JavaScript**: ~2000+ linhas (JS modular)
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
- ✅ Navegação entre arquivos
- ✅ Expansão de pastas
- ✅ Alternância de temas (dark/light)
- ✅ Menu de configurações
- ✅ Destaque de arquivo ativo
- ✅ Responsividade mobile
- ✅ Sistema de abas do terminal

### Funcionalidades JavaScript
- ⚙️ Simulação de terminal interativo
- ⚙️ Simulação de output Maven
- ⚙️ Syntax highlighting de código
- ⚙️ Cópia de código para clipboard
- ⚙️ Alternância preview/código
- ⚙️ Gerenciamento de temas
- ⚙️ Scroll automático
- ⚙️ Sistema modular de terminal

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
1. **Build frontend**: `npm run build` (gera `dist/` com arquivos consolidados)
2. **Limpar build**: `npm run clean` (remove `dist/`)
3. **Preview local**: `npm run serve` (build + servidor HTTP na porta 8000)
4. **Arquivos finais**: `dist/` (pronto para deploy)
5. **Deploy**: Hospedar pasta `dist/` (Cloudflare Pages, Netlify, etc.)

---

## 🔍 Arquivos Importantes

### Arquivos Principais
- `src/index.html` - **HTML base** (montado a partir de templates)
- `src/css/main.css` - **CSS principal** (importa todos os módulos)
- `src/js/main.js` - **JavaScript principal** (inicialização)
- `src/main/java/.../Application.java` - **Backend Spring Boot**

### Templates HTML
- `src/templates/sections/*.html` - **Conteúdo do portfólio**
- `src/templates/navigation.html` - **Barra lateral**
- `src/templates/terminal/` - **Terminal e abas**

### Arquivos de Configuração
- `package.json` - Scripts NPM e metadados
- `build.js` - Script de build (Node.js)
- `src/config/` - Configurações SEO e deploy

### Arquivos Gerados (não versionados)
- `dist/` - Build de produção (gerado pelo `npm run build`)
- `target/` - Compilados Java (gerado pelo Maven)

---

**Última atualização**: 2025  
**Mantido por**: Delucena
