# Documentação Completa do Projeto Delucena

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Componentes Principais](#componentes-principais)
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)
5. [Arquitetura](#arquitetura)
6. [Funcionalidades](#funcionalidades)
7. [Scripts de Build](#scripts-de-build)
8. [Configuração e Execução](#configuração-e-execução)
9. [Detalhes Técnicos](#detalhes-técnicos)

---

## 🎯 Visão Geral

Este projeto é o **portfólio pessoal de delucena.dev**, apresentado em formato de IDE interativa criada **apenas com CSS**, sem dependência de JavaScript para a funcionalidade principal. O projeto serve como um **portfólio pessoal** onde o desenvolvedor (Zé/Delucena) exibe suas informações profissionais, habilidades, experiência e contatos de forma criativa e interativa.

### Características Principais

- ✅ Interface que replica o Visual Studio Code
- ✅ Funcionalidade baseada puramente em CSS (seletores avançados, pseudo-classes)
- ✅ Portfólio interativo com múltiplas seções
- ✅ Suporte a temas claro e escuro
- ✅ Terminal simulado com logs de execução
- ✅ Estrutura de aplicação Spring Boot (básica)

---

## 📁 Estrutura do Projeto

```
delucena/
├── build.js                    # Script de build Node.js (templates, minificação, hash)
├── build.sh                    # Script de build Shell (alternativo)
├── package.json                # Configuração do projeto Node.js
├── package-lock.json           # Lock file do npm
├── LICENSE                     # Licença MIT
├── README.md                   # Documentação principal
├── DOCUMENTACAO.md            # Esta documentação completa
├── ESTRUTURA_PROJETO.md       # Estrutura detalhada do projeto
├── CONTRIBUTING.md            # Guia de contribuição
├── SECURITY.md                # Política de segurança
├── CHANGELOG.md               # Histórico de mudanças
│
├── scripts/                    # Scripts auxiliares
│   ├── optimize-images.js     # Otimização de imagens
│   └── generate-lcp-images.js # Geração de imagens LCP
│
├── src/                        # Código-fonte
│   ├── index.html             # HTML base (montado a partir de templates)
│   ├── 404.html               # Página de erro 404
│   │
│   ├── templates/             # Templates HTML modulares
│   │   ├── top-header.html    # Cabeçalho superior
│   │   ├── navigation.html    # Barra lateral de navegação
│   │   ├── editor-header.html # Cabeçalho do editor (abas)
│   │   ├── footer.html        # Rodapé
│   │   ├── sections/          # Seções de conteúdo
│   │   │   ├── index-section.html
│   │   │   ├── experience-section.html
│   │   │   ├── skills-section.html
│   │   │   ├── contact-section.html
│   │   │   └── readme-section.html
│   │   └── terminal/          # Terminal modular
│   │       ├── terminal.html
│   │       ├── terminal-header.html
│   │       └── terminal-tabs/
│   │           ├── problems-tab.html
│   │           ├── output-tab.html
│   │           ├── terminal-tab.html
│   │           ├── debug-tab.html
│   │           └── ports-tab.html
│   │
│   ├── css/                   # CSS modular
│   │   ├── main.css           # Arquivo principal (importa todos)
│   │   ├── critical.css       # CSS crítico (above the fold)
│   │   ├── variables.css      # Variáveis CSS (tema, cores)
│   │   ├── reset.css          # Reset CSS
│   │   ├── layout.css         # Layout principal
│   │   ├── icons.css          # Ícones
│   │   ├── editor-ui-wrapper.css # Wrapper do editor
│   │   ├── navigation.css     # Barra de navegação
│   │   ├── explorer.css       # Explorer de arquivos
│   │   ├── extensions.css     # Extensões/Formação
│   │   ├── editor.css         # Editor de código
│   │   ├── syntax-highlight.css # Syntax highlighting
│   │   ├── terminal.css       # Terminal (wrapper)
│   │   ├── utilities.css      # Utilitários
│   │   └── terminal/          # CSS modular do terminal
│   │       ├── terminal-base.css
│   │       ├── terminal-problems.css
│   │       ├── terminal-output.css
│   │       ├── terminal-terminal.css
│   │       ├── terminal-debug.css
│   │       └── terminal-ports.css
│   │
│   ├── js/                    # JavaScript modular
│   │   ├── main.js            # Inicialização de módulos
│   │   ├── theme.js           # Gerenciamento de temas
│   │   ├── navigation.js      # Navegação e explorer
│   │   ├── header-command-palette.js # Command palette
│   │   ├── editor-tabs.js     # Gerenciamento de abas
│   │   ├── code-highlighter.js # Syntax highlighting
│   │   ├── code-copy.js       # Cópia de código
│   │   ├── preview-toggle.js  # Alternância preview/código
│   │   ├── explorer-actions.js # Ações do explorer
│   │   ├── explorer-controls.js # Controles do explorer
│   │   ├── explorer-highlight.js # Destaque do explorer
│   │   ├── explorer-resize.js # Redimensionamento do explorer
│   │   ├── terminal.js        # Terminal (wrapper)
│   │   ├── terminal-resize.js # Redimensionamento do terminal
│   │   ├── output.js          # Simulação de output Maven
│   │   └── terminal/          # Módulos do terminal
│   │       ├── terminal-core.js
│   │       ├── terminal-terminal.js
│   │       └── terminal-output.js
│   │
│   ├── data/                  # Dados do portfólio (JSON)
│   │   ├── profile.json       # Perfil pessoal
│   │   ├── experience.json    # Experiências profissionais
│   │   ├── skills.json        # Habilidades técnicas
│   │   ├── contact.json       # Informações de contato
│   │   ├── meta.json          # Meta tags SEO
│   │   ├── pages.json         # Configuração de páginas
│   │   └── README.md          # Documentação dos dados
│   │
│   ├── assets/                # Recursos estáticos
│   │   ├── favicon.svg        # Favicon
│   │   ├── icons.svg          # Ícones SVG
│   │   └── images/            # Imagens
│   │       ├── profile.png
│   │       ├── profile.webp
│   │       └── profile-*.avif # Versões otimizadas
│   │
│   ├── config/                # Arquivos de configuração
│   │   ├── _headers           # Headers Cloudflare Pages
│   │   ├── robots.txt         # Configuração para crawlers
│   │   └── sitemap.xml        # Mapa do site
│   │
│   └── main/                  # Estrutura Spring Boot
│       ├── java/
│       │   └── com/
│       │       └── delucena/
│       │           └── dev/
│       │               └── Application.java    # Classe principal Spring Boot
│       │
│       └── resources/
│           ├── application.properties         # Configurações Spring
│           ├── application.yml                # Configurações Spring YAML
│           └── static/                        # Arquivos estáticos HTML
│               ├── index.html
│               ├── contact.html
│               ├── experience.html
│               └── skills.html
│
└── dist/                       # Arquivos compilados (gerados pelo build)
    ├── index.html             # HTML final (montado e minificado)
    ├── 404.html               # Página 404 minificada
    ├── css/                   # CSS consolidado e minificado
    │   ├── main.css           # CSS consolidado (sem @import)
    │   └── main.{hash}.min.css # CSS minificado com hash
    ├── js/                    # JS minificado
    │   ├── *.min.js           # Scripts minificados
    │   └── non-essential-bundle.{hash}.min.js # Bundle não essencial
    ├── assets/                # Assets copiados
    ├── robots.txt             # Configuração SEO
    ├── sitemap.xml            # Mapa do site
    └── _headers                # Headers Cloudflare
```

---

## 🧩 Componentes Principais

### 1. **Frontend - Portfólio delucena.dev (CSS-Only)**

#### `src/index.html`
O arquivo HTML base contém placeholders para templates modulares:

- **Estrutura Principal**
  - Placeholders para templates (`<!-- TEMPLATE: ... -->`)
  - Meta tags dinâmicas (preenchidas com dados de `meta.json`)
  - Links para CSS e JavaScript

- **Templates Modulares**
  - `top-header.html`: Cabeçalho superior com meta tags
  - `navigation.html`: Barra lateral completa
  - `editor-header.html`: Cabeçalho do editor com abas
  - `sections/*.html`: Seções de conteúdo do portfólio
  - `terminal/*.html`: Terminal e suas abas
  - `footer.html`: Rodapé com informações de status

#### Sistema de Templates e Dados JSON

O projeto utiliza um sistema de templates com injeção de dados:

- **Dados JSON** (`src/data/`):
  - `profile.json`: Informações pessoais e biografia
  - `experience.json`: Experiências profissionais
  - `skills.json`: Habilidades técnicas organizadas por categoria
  - `contact.json`: Links de contato e redes sociais
  - `meta.json`: Meta tags para SEO e redes sociais
  - `pages.json`: Configuração de páginas (habilitar/desabilitar seções)

- **Sintaxe de Templates**:
  - `{{variavel}}`: Placeholder simples
  - `{{#each array}}...{{/each}}`: Loops
  - `{{#if condicao}}...{{/if}}`: Condicionais
  - Acesso aninhado: `{{profile.name}}`, `{{contact.linkedin.url}}`

#### `src/css/` - CSS Modular

O CSS está organizado em módulos separados:

- **`main.css`**: Arquivo principal que importa todos os módulos via `@import`
- **`critical.css`**: CSS crítico (above the fold) injetado inline no `<head>`
- **`variables.css`**: Variáveis CSS para temas (dark/light)
- **`reset.css`**: Reset CSS e normalização
- **`layout.css`**: Layout principal (grid, flexbox)
- **`navigation.css`**: Barra lateral de navegação
- **`explorer.css`**: Explorer de arquivos
- **`extensions.css`**: Extensões/Formação acadêmica
- **`editor.css`**: Editor de código e abas
- **`syntax-highlight.css`**: Syntax highlighting (cores VSCode)
- **`terminal.css`**: Terminal (wrapper)
- **`terminal/*.css`**: Módulos CSS do terminal (6 arquivos)
- **`utilities.css`**: Classes utilitárias
- **`icons.css`**: Estilos de ícones
- **`editor-ui-wrapper.css`**: Wrapper do editor

**Características do CSS**:
- **Variáveis CSS** para temas (claro/escuro)
- **Seletores avançados** (`:has()`, `:checked`, pseudo-classes)
- **Sistema de navegação** baseado em radio buttons e checkboxes
- **Animações e transições** suaves
- **Layout responsivo** com media queries
- **Consolidação automática**: Build resolve todos os `@import` em um único arquivo

### 2. **Sistema de Build Otimizado**

#### `build.js` - Script de Build Node.js

O script de build realiza várias otimizações:

1. **Montagem de Templates**:
   - Lê `src/index.html` com placeholders
   - Carrega dados JSON de `src/data/`
   - Processa templates com injeção de dados
   - Gera `dist/index.html` final

2. **Consolidação de CSS**:
   - Resolve todos os `@import` em `main.css`
   - Gera `main.css` consolidado (sem dependências)
   - Minifica CSS usando CleanCSS
   - Gera versão com hash para cache: `main.{hash}.min.css`

3. **Otimização de JavaScript**:
   - Minifica todos os arquivos JS usando Terser
   - Gera versões com hash: `*.{hash}.min.js`
   - Cria bundle não essencial: `non-essential-bundle.{hash}.min.js`
   - Scripts essenciais carregam com `defer`
   - Bundle não essencial carrega após FCP (First Contentful Paint)

4. **CSS Crítico Inline**:
   - Injeta `critical.css` minificado inline no `<head>`
   - Melhora First Contentful Paint (FCP)

5. **Minificação de HTML**:
   - Minifica HTML usando html-minifier-terser
   - Remove comentários e espaços desnecessários

6. **Otimização de Assets**:
   - Copia assets (imagens, favicons)
   - Executa script de otimização de imagens (se disponível)
   - Copia arquivos de configuração (robots.txt, sitemap.xml, _headers)

**Funcionalidades do Build**:
- ✅ Consolidação automática de CSS (`@import` resolvidos)
- ✅ Minificação agressiva (CSS, JS, HTML)
- ✅ Versionamento com hash (cache busting)
- ✅ Bundle de scripts não essenciais
- ✅ CSS crítico inline
- ✅ Tree-shaking CSS (PurgeCSS, opcional)
- ✅ Suporte a templates com loops e condicionais

### 3. **Backend - Spring Boot Application**

#### `src/main/java/com/delucena/dev/Application.java`
Aplicação Spring Boot básica:

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**Status**: Aplicação mínima, sem controllers ou lógica de negócio implementada.

#### Arquivos de Configuração
- `application.properties`: Configurações Spring
- `application.yml`: Configurações Spring YAML

**Nota**: O backend Spring Boot está presente na estrutura, mas o portfólio principal é estático e não depende dele. Os arquivos em `src/main/resources/static/` são básicos e não são usados pelo portfólio principal.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica com templates modulares
- **CSS3 Modular**: 
  - Variáveis CSS (Custom Properties)
  - Seletores `:has()` (parent selector)
  - Pseudo-classes (`:checked`, `:hover`, etc.)
  - Flexbox e Grid
  - Media Queries
  - Transições e animações
  - CSS crítico inline
- **JavaScript ES6+ Modular**: 
  - Módulos IIFE (Immediately Invoked Function Expression)
  - Scripts essenciais (theme, navigation, editor-tabs)
  - Scripts não essenciais (terminal, syntax highlight) em bundle
  - Carregamento otimizado (defer, requestIdleCallback)
- **Bootstrap 5.3.2** (CDN): Utilitários opcionais
- **Font Awesome 6.5.1** (CDN): Ícones

### Backend
- **Java**: Linguagem base
- **Spring Boot**: Framework Java
- **Maven**: Gerenciador de dependências (implícito pela estrutura)

### Ferramentas de Build
- **Node.js**: Script `build.js` com otimizações avançadas
- **Bash**: Script `build.sh` (alternativo simples)
- **Bibliotecas NPM**:
  - `html-minifier-terser`: Minificação de HTML
  - `terser`: Minificação de JavaScript
  - `clean-css`: Minificação de CSS
  - `purgecss`: Tree-shaking de CSS (opcional)
  - `sharp`: Otimização de imagens
  - `glob`: Busca de arquivos

---

## 🏗️ Arquitetura

### Arquitetura Frontend

```
┌─────────────────────────────────────────┐
│         index.html (Portfólio)           │
│  ┌──────────┬──────────────┬──────────┐ │
│  │ Sidebar │    Editor     │ Terminal │ │
│  │         │               │          │ │
│  │ - Menu  │ - Abas        │ - Tabs   │ │
│  │ - Exp.  │ - Conteúdo    │ - Logs   │ │
│  │ - Ext.  │               │          │ │
│  └──────────┴──────────────┴──────────┘ │
│              Footer                      │
└─────────────────────────────────────────┘
```

### Sistema de Navegação (CSS-Only)

O projeto utiliza um sistema inteligente baseado em:

1. **Radio Buttons** para seleção de abas/views
2. **Checkboxes** para expansão de pastas/menus
3. **Seletores CSS `:has()`** para detectar estado
4. **Pseudo-classes `:checked`** para aplicar estilos

**Exemplo de Funcionamento**:
```css
/* Quando o radio button #index está checked, mostrar a seção .index */
#header:has(div #index:checked) ~ .editor .index {
  display: block;
}
```

### Arquitetura Backend

```
Spring Boot Application
└── Application.java (Entry Point)
    └── (Sem controllers ou services implementados)
```

---

## ⚡ Funcionalidades

### 1. **Explorer de Arquivos**
- Navegação pela estrutura do projeto
- Expansão/colapso de pastas (CSS-only)
- Destaque do arquivo ativo
- Ícones específicos por tipo de arquivo

### 2. **Editor de Código**
- Múltiplas abas de arquivos
- Conteúdo editável (contenteditable)
- Navegação entre seções do portfólio
- Scroll independente

### 3. **Terminal Simulado**
- **Problems**: Lista de erros, warnings e infos
- **Output**: Logs de build Maven/Spring Boot (simulado)
- **Terminal**: Simulação de execução de comandos
- **Debug Console**: Informações de debug
- **Ports**: Portas em uso (8080, 3306)

### 4. **Extensions (Formação)**
- Seção INSTALLED: Formações e certificações
- Seção RECOMMENDED: Cursos recomendados
- Contadores de itens
- Expansão/colapso de seções

### 5. **Menu de Configurações**
- Alternância de tema (claro/escuro)
- Links para redes sociais
- Menu de contatos

### 6. **Temas**
- **Dark Mode** (padrão): Cores escuras
- **Light Mode**: Cores claras
- Transição suave entre temas
- Variáveis CSS para fácil customização

### 7. **Responsividade**
- Media queries para diferentes tamanhos de tela
- Layout adaptável
- Sidebar colapsável em mobile

---

## 🔨 Scripts de Build

### 1. **build.js** (Node.js) - Build Otimizado

O script `build.js` realiza um build completo e otimizado:

**Funcionalidades**:
- ✅ Monta `index.html` a partir de templates modulares
- ✅ Injeta dados JSON nos templates
- ✅ Consolida CSS (resolve todos os `@import`)
- ✅ Minifica CSS, JS e HTML
- ✅ Gera versões com hash para cache busting
- ✅ Cria bundle de scripts não essenciais
- ✅ Injeta CSS crítico inline no `<head>`
- ✅ Otimiza imagens (se script disponível)
- ✅ Copia assets e arquivos de configuração

**Uso**:
```bash
npm run build
```

### 2. **build.sh** (Bash) - Build Alternativo

Script shell simplificado (cópia básica de arquivos).

**Uso**:
```bash
chmod +x build.sh
./build.sh
```

**Nota**: Recomendado usar `npm run build` para obter todas as otimizações.

### Scripts NPM Disponíveis

```json
{
  "build": "node build.js",                    // Build completo otimizado
  "clean": "rm -rf dist",                      // Remove pasta dist
  "rebuild": "npm run clean && npm run build", // Limpa e reconstrói
  "preview": "npm run rebuild && open dist/index.html", // Build e abre (macOS)
  "serve": "npm run build && python3 -m http.server 8000 --directory dist", // Build e servidor local
  "dev": "npm run build && python3 -m http.server 8000 --directory dist"    // Alias para serve
}
```

### Processo de Build Detalhado

1. **Processamento de CSS**:
   - Copia arquivos CSS para `dist/css/`
   - Consolida `main.css` (resolve `@import`)
   - Minifica com CleanCSS
   - Gera `main.{hash}.min.css` com hash SHA-256

2. **Processamento de JavaScript**:
   - Minifica todos os arquivos JS com Terser
   - Gera versões com hash: `*.{hash}.min.js`
   - Cria bundle não essencial com scripts:
     - `code-highlighter.js`
     - `code-copy.js`
     - `preview-toggle.js`
     - `explorer-*.js`
     - `terminal-*.js`
     - `output.js`
   - Bundle carrega após FCP usando `requestIdleCallback`

3. **Montagem de HTML**:
   - Carrega dados JSON de `src/data/`
   - Processa templates com injeção de dados
   - Injeta CSS crítico inline no `<head>`
   - Substitui referências por versões com hash
   - Remove scripts não essenciais (serão carregados via bundle)
   - Minifica HTML final

4. **Otimizações de Performance**:
   - CSS crítico inline (melhora FCP)
   - Scripts essenciais com `defer`
   - Bundle não essencial carrega após FCP
   - Versionamento com hash (cache busting)
   - Preload de CSS principal

---

## 🚀 Configuração e Execução

### Pré-requisitos

- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Node.js** (opcional, para build automatizado)
- **Java 17+** (se quiser executar a aplicação Spring Boot)
- **Maven** (se quiser compilar o backend)

### Opção 1: Visualizar Portfólio (Frontend)

#### Método A: Build e Servidor Local (Recomendado)
```bash
# Instalar dependências (primeira vez)
npm install

# Build e servidor local
npm run serve

# Ou apenas build
npm run build
cd dist && python3 -m http.server 8000
```

Acesse: `http://localhost:8000`

**Nota**: O build é necessário porque o HTML é montado a partir de templates e os dados são injetados dos arquivos JSON.

#### Método B: Build e Preview (macOS)
```bash
npm run preview
```

Abre automaticamente no navegador após o build.

#### Método C: Servidor Local Alternativo
```bash
# Python 3
cd dist && python3 -m http.server 8000

# Node.js (http-server)
npx http-server dist -p 8000

# PHP
cd dist && php -S localhost:8000
```

**⚠️ Importante**: Não abra `src/index.html` diretamente no navegador. O arquivo contém placeholders de templates que precisam ser processados pelo build. Use sempre os arquivos em `dist/` após executar `npm run build`.

### Opção 2: Executar Spring Boot (Backend)

```bash
# Compilar
mvn clean install

# Executar
mvn spring-boot:run
```

**Nota**: A aplicação Spring Boot está configurada para servir arquivos estáticos de `src/main/resources/static/`, mas o portfólio principal está em `src/index.html`.

---

## 🔍 Detalhes Técnicos

### Sistema de Seleção de Arquivos

O sistema utiliza radio buttons ocultos para controlar qual arquivo está ativo:

```html
<input type="radio" name="openedFile" id="index" checked>
<label for="index">index.html(preview)</label>
```

CSS correspondente:
```css
#header:has(div #index:checked) ~ .editor .index {
  display: block;
}
```

### Sistema de Expansão de Pastas

Utiliza checkboxes para controlar visibilidade:

```html
<input type="checkbox" id="folderToggleSrc" checked>
<label class="folder" for="folderToggleSrc">src</label>
<ul>
  <!-- Conteúdo da pasta -->
</ul>
```

CSS:
```css
.folder ~ input[type="checkbox"]:checked ~ ul {
  display: block;
}
```

### Simulação de Terminal

JavaScript mínimo para:
- Simular digitação linha por linha
- Scroll automático
- Troca automática de abas
- Logs realistas de Maven/Spring Boot

### Variáveis CSS para Temas

```css
:root {
  --bg-clr-500: rgb(30, 30, 30);        /* Fundo escuro */
  --secondary-clr-500: rgb(37, 37, 38);  /* Secundário escuro */
  --text-clr-400: rgb(212, 212, 212);    /* Texto claro */
  /* ... */
}

body:has(#theme:checked) {
  --bg-clr-500: rgb(250, 250, 250);     /* Fundo claro */
  --secondary-clr-500: rgb(235, 235, 235); /* Secundário claro */
  --text-clr-400: rgb(44, 44, 44);       /* Texto escuro */
  /* ... */
}
```

### Ícones por Tipo de Arquivo

O CSS define ícones específicos usando Font Awesome:

- `.java`: Ícone Java (laranja)
- `.xml`: Ícone XML (laranja)
- `.html`: Ícone HTML (vermelho)
- `.properties`: Ícone properties (verde)
- `.yml`: Ícone YAML (vermelho)
- `.markdown`: Ícone Markdown (azul)
- `.gitignore`: Ícone Git (vermelho)

---

## 📝 Informações do Portfólio

### Dados Pessoais
- **Nome**: Zé (José Paulo de Lucena Oliveira)
- **Perfil**: Back-end Developer
- **Especialização**: Java, Spring Boot, APIs RESTful, Microserviços

### Formação Acadêmica (Extensions - INSTALLED)
1. PUC Minas - Pós-graduação Lato Sensu, DevOps & Continuous Software Engineering
2. PUC Minas - Pós-graduação Lato Sensu, Arquitetura de Software Distribuído
3. Unipê - Tecnologia em Sistemas para Internet
4. UFPB - Bacharelado em Matemática

### Certificações (Extensions - INSTALLED)
1. Java EE 6 Java Persistence API Developer
2. Java EE 6 Enterprise JavaBeans Developer
3. Java EE 6 Web Component Developer
4. Java SE 6 Programmer
5. Architect Enterprise Applications with Java EE

### Cursos Recomendados (Extensions - RECOMMENDED)
1. Cloud Development Environments for Platform Engineers
2. Introduction to Platform Engineering
3. Intro to AI in Platform Engineering
4. Kubernetes Cluster Lifecycle Management in Platform Engineering
5. Observability for Platform Engineering
6. Vulnerability Management for Platform Engineers

### Habilidades Técnicas
- Java, Spring Boot, Spring Framework, Spring Security
- JPA/Hibernate, MySQL, PostgreSQL, MongoDB
- REST APIs, Microserviços, Spring Cloud
- Docker, Kubernetes, CI/CD
- JUnit, Mockito, Testes unitários e de integração
- Git, GitHub, GitLab, Linux
- Clean Code, SOLID, Design Patterns

### Contatos
- **LinkedIn**: https://www.linkedin.com/in/delucena
- **GitHub**: https://github.com/delucena
- **Website**: https://delucena.dev
- **Email**: josepaulo@delucena.dev

---

## 🎨 Personalização

### Alterar Cores do Tema

Edite as variáveis CSS em `src/style.css`:

```css
:root {
  --bg-clr-500: rgb(30, 30, 30);        /* Cor de fundo */
  --secondary-clr-500: rgb(37, 37, 38);  /* Cor secundária */
  --text-clr-400: rgb(212, 212, 212);   /* Cor do texto */
  --border-clr-400: rgb(0, 122, 204);   /* Cor da borda ativa */
}
```

### Adicionar Nova Seção

1. Adicione uma nova seção no HTML dentro de `<div class="editor">`
2. Adicione um novo label no explorer
3. Adicione uma nova aba no header
4. Adicione as regras CSS correspondentes:

```css
#header:has(div #novoArquivo:checked) ~ .editor .novoArquivo {
  display: block;
}
```

### Modificar Conteúdo do Portfólio

O conteúdo do portfólio é gerenciado através de **dados JSON** e **templates**:

#### Editar Dados (Recomendado)

Edite os arquivos JSON em `src/data/`:

- **`profile.json`**: Nome, biografia, imagem de perfil
- **`experience.json`**: Experiências profissionais
- **`skills.json`**: Habilidades técnicas por categoria
- **`contact.json`**: Links de contato e redes sociais
- **`meta.json`**: Meta tags para SEO
- **`pages.json`**: Habilitar/desabilitar seções

Após editar, execute `npm run build` para aplicar as mudanças.

#### Editar Templates HTML

Se precisar modificar a estrutura HTML, edite os templates em `src/templates/`:

- **`sections/*.html`**: Estrutura HTML das seções
- **`navigation.html`**: Barra lateral
- **`terminal/*.html`**: Terminal e abas
- **`footer.html`**: Rodapé

**Sintaxe de Templates**:
- `{{variavel}}`: Placeholder simples
- `{{#each array}}...{{/each}}`: Loops
- `{{#if condicao}}...{{/if}}`: Condicionais
- Acesso aninhado: `{{profile.name}}`, `{{contact.linkedin.url}}`

Consulte `src/data/README.md` para documentação completa dos dados.

---

## 🐛 Problemas Conhecidos

1. **Navegadores antigos**: Podem não suportar o seletor `:has()` (requer Chrome 105+, Firefox 121+, Safari 15.4+)
2. **Build necessário**: Não é possível abrir `src/index.html` diretamente (contém placeholders de templates)
3. **Backend não implementado**: A aplicação Spring Boot está básica, sem funcionalidades
4. **Arquivos estáticos Spring**: Os HTMLs em `src/main/resources/static/` são básicos e não são usados pelo portfólio principal
5. **Dependências NPM**: Algumas otimizações requerem `npm install` (minificação, tree-shaking)

---

## 📚 Recursos de Aprendizado

- [CSS :has() Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Font Awesome](https://fontawesome.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 🔄 Próximos Passos Sugeridos

1. **Implementar Backend Spring Boot**
   - Criar controllers REST
   - Implementar serviços
   - Adicionar persistência de dados

2. **Melhorar Arquivos Estáticos**
   - Desenvolver conteúdo completo para `static/*.html`
   - Integrar com o backend

3. **Adicionar Funcionalidades**
   - Sistema de comentários
   - Formulário de contato funcional
   - Analytics

4. **Otimizações**
   - Minificar CSS
   - Otimizar imagens
   - Implementar cache

5. **Testes**
   - Testes unitários para backend
   - Testes de integração
   - Testes E2E para frontend

---

**Documentação criada em**: 2025  
**Versão do Projeto**: 1.0.0  
**Autor**: Delucena (José Paulo de Lucena Oliveira)
