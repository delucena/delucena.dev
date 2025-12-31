# 📊 Estrutura Visual do Projeto Delucena

## 🗂️ Árvore de Diretórios Completa

```
delucena/
│
├── 📄 Arquivos de Configuração
│   ├── package.json              # Config NPM (scripts, metadados)
│   ├── package-lock.json         # Lock file NPM
│   ├── LICENSE.txt                # Licença MIT
│   ├── README.md                  # Documentação original
│   ├── DOCUMENTACAO.md           # Documentação completa (esta)
│   └── ESTRUTURA_PROJETO.md      # Este arquivo
│
├── 🔨 Scripts de Build
│   ├── build.js                   # Build Node.js (copia src → dist)
│   └── build.sh                   # Build Bash (copia src → dist)
│
├── 📁 src/                        # CÓDIGO-FONTE
│   │
│   ├── 🎨 Frontend Principal
│   │   ├── index.html            # Portfólio delucena.dev (1900+ linhas)
│   │   └── style.css             # Estilos CSS (1900+ linhas)
│   │
│   └── ☕ Backend Spring Boot
│       └── main/
│           ├── java/
│           │   └── com/delucena/dev/
│           │       └── Application.java    # Classe principal Spring Boot
│           │
│           └── resources/
│               ├── application.properties   # Config Spring (vazio)
│               ├── application.yml         # Config Spring YAML (vazio)
│               │
│               └── static/                   # Arquivos estáticos HTML
│                   ├── index.html          # Página inicial (básica)
│                   ├── contact.html         # Contato (básica)
│                   ├── experience.html      # Experiência (básica)
│                   └── skills.html          # Habilidades (básica)
│
├── 📦 dist/                       # ARQUIVOS COMPILADOS (gerados)
│   ├── index.html                # HTML final (cópia de src/)
│   └── style.css                 # CSS final (cópia de src/)
│
└── 🎯 target/                     # ARQUIVOS JAVA COMPILADOS (Maven)
    ├── classes/                   # Classes .class
    │   └── com/delucena/dev/
    │       └── Application.class
    └── test-classes/              # Classes de teste
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

## 🎨 Sistema de Estilos CSS

### Organização do `style.css`

```
style.css (1900+ linhas)
│
├── Reset CSS
│   └── Normalização de elementos
│
├── Variáveis CSS
│   ├── :root (Tema Dark)
│   └── body:has(#theme:checked) (Tema Light)
│
├── Layout Principal
│   ├── body
│   ├── main
│   └── #editor
│
├── Navegação (#navigation)
│   ├── .menu (Barra lateral)
│   ├── .explorer (Explorer)
│   └── .extensions (Extensões)
│
├── Editor (#editor)
│   ├── #header (Abas)
│   ├── .editor (Conteúdo)
│   └── Seções específicas
│
├── Terminal (.terminal)
│   ├── .header (Abas)
│   ├── .content (Conteúdo)
│   ├── .problems
│   ├── .output
│   ├── .terminal-content
│   ├── .debug
│   └── .ports
│
├── Footer (#footer)
│
├── Sistema de Pastas
│   ├── Ícones por tipo
│   ├── Expansão/colapso
│   └── Indentação
│
├── Menu de Configurações
│   ├── Account menu
│   └── Settings menu
│
├── Temas
│   ├── Dark (padrão)
│   └── Light
│
└── Media Queries
    ├── @media (max-width: 992px)
    └── @media (max-width: 768px)
```

---

## 🔄 Fluxo de Funcionamento

### 1. Carregamento da Página

```
1. Browser carrega index.html
2. Carrega CSS (style.css)
3. Carrega CDNs (Bootstrap, Font Awesome)
4. Aplica estilos CSS
5. JavaScript inicia simulação de terminal
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
- **Total de arquivos**: ~20 arquivos
- **Linhas de código HTML**: ~1040 linhas (index.html)
- **Linhas de código CSS**: ~1900 linhas (style.css)
- **Linhas de código JavaScript**: ~390 linhas (inline no HTML)
- **Linhas de código Java**: ~12 linhas (Application.java)

### Tecnologias
- **Frontend**: HTML5, CSS3, JavaScript (mínimo)
- **Backend**: Java, Spring Boot
- **Build Tools**: Node.js, Bash
- **Dependências Externas**: Bootstrap (CDN), Font Awesome (CDN)

### Funcionalidades CSS-Only
- ✅ Navegação entre arquivos
- ✅ Expansão de pastas
- ✅ Alternância de temas
- ✅ Menu de configurações
- ✅ Destaque de arquivo ativo
- ✅ Responsividade

### Funcionalidades JavaScript
- ⚙️ Simulação de terminal
- ⚙️ Simulação de output Maven
- ⚙️ Scroll automático
- ⚙️ Troca automática de abas

---

## 🎯 Pontos de Entrada

### Para Desenvolvedores Frontend
1. **Editar conteúdo**: `src/index.html` (seções dentro de `.editor`)
2. **Modificar estilos**: `src/style.css`
3. **Adicionar seções**: Seguir padrão existente em `index.html`

### Para Desenvolvedores Backend
1. **Aplicação Spring**: `src/main/java/com/delucena/dev/Application.java`
2. **Configurações**: `src/main/resources/application.yml`
3. **Arquivos estáticos**: `src/main/resources/static/`

### Para Build/Deploy
1. **Build frontend**: `npm run build` ou `./build.sh`
2. **Arquivos finais**: `dist/`
3. **Servir**: Usar servidor HTTP local ou hospedar `dist/`

---

## 🔍 Arquivos Importantes

### Arquivos Principais
- `src/index.html` - **Portfólio principal** (editar aqui)
- `src/style.css` - **Todos os estilos** (editar aqui)
- `src/main/java/.../Application.java` - **Backend Spring Boot**

### Arquivos de Configuração
- `package.json` - Scripts NPM
- `application.yml` - Config Spring Boot (vazio)

### Arquivos Gerados
- `dist/` - Build de produção
- `target/` - Compilados Java

---

**Última atualização**: 2025  
**Mantido por**: Delucena
