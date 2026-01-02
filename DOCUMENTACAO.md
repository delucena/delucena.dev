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
├── build.js                    # Script de build Node.js
├── build.sh                    # Script de build Shell
├── package.json                # Configuração do projeto Node.js
├── package-lock.json           # Lock file do npm
├── LICENSE                     # Licença MIT
├── README.md                   # Documentação original do projeto
├── DOCUMENTACAO.md            # Esta documentação completa
│
├── src/                        # Código-fonte
│   ├── index.html             # HTML principal (portfólio VS Code)
│   ├── style.css              # Estilos CSS principais
│   │
│   └── main/                  # Estrutura Spring Boot
│       ├── java/
│       │   └── com/
│       │       └── delucena/
│       │           └── dev/
│       │               └── Application.java    # Classe principal Spring Boot
│       │
│       └── resources/
│           ├── application.properties         # Configurações Spring (vazio)
│           ├── application.yml                # Configurações Spring YAML (vazio)
│           │
│           └── static/                        # Arquivos estáticos HTML
│               ├── index.html                # Página inicial do portfólio
│               ├── contact.html              # Página de contato
│               ├── experience.html           # Página de experiência
│               └── skills.html               # Página de habilidades
│
├── dist/                       # Arquivos compilados (gerados pelo build)
│   ├── index.html             # HTML final
│   └── style.css              # CSS final
│
└── target/                     # Arquivos compilados Java (Maven)
    ├── classes/               # Classes compiladas
    └── test-classes/          # Classes de teste compiladas
```

---

## 🧩 Componentes Principais

### 1. **Frontend - Portfólio delucena.dev (CSS-Only)**

#### `src/index.html`
O arquivo HTML principal contém toda a estrutura do portfólio:

- **Navegação Lateral (Sidebar)**
  - Menu com ícones (hamburger, explorer, extensions, GitHub)
  - Explorer de arquivos (estrutura do projeto)
  - Extensions (formação acadêmica e certificações)
  - Menu de configurações (tema claro/escuro, contatos)

- **Editor Principal**
  - Abas de arquivos (index.html, experience.html, skills.html, contact.html, README.md)
  - Conteúdo editável com informações do portfólio
  - Seções:
    - **Index**: Apresentação pessoal
    - **Experience**: Projetos e experiências profissionais
    - **Skills**: Habilidades técnicas e pessoais
    - **Contact**: Informações de contato e redes sociais
    - **README**: Informações adicionais e badges

- **Terminal Simulado**
  - Aba Problems (erros, warnings, infos)
  - Aba Output (logs Maven/Spring Boot)
  - Aba Terminal (simulação de execução)
  - Aba Debug Console
  - Aba Ports (portas em uso)

- **Footer**
  - Informações de status (branch, erros, encoding, linguagem)

#### `src/style.css`
Arquivo CSS extenso (1900+ linhas) que implementa toda a funcionalidade:

- **Variáveis CSS** para temas (claro/escuro)
- **Seletores avançados** (`:has()`, `:checked`, pseudo-classes)
- **Sistema de navegação** baseado em radio buttons e checkboxes
- **Animações e transições** suaves
- **Layout responsivo** com media queries
- **Estilos para todos os componentes** (explorer, editor, terminal, etc.)

### 2. **Backend - Spring Boot Application**

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
- `application.properties`: Vazio
- `application.yml`: Vazio

**Nota**: As configurações Spring Boot não estão definidas, indicando que o backend ainda não está totalmente implementado.

### 3. **Arquivos Estáticos HTML**

Localizados em `src/main/resources/static/`:

- **index.html**: Página inicial simples
- **contact.html**: Página de contato simples
- **experience.html**: Página de experiência simples
- **skills.html**: Página de habilidades simples

**Status**: Arquivos básicos com estrutura mínima. O conteúdo principal está no `src/index.html` (portfólio delucena.dev).

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: 
  - Variáveis CSS (Custom Properties)
  - Seletores `:has()`
  - Pseudo-classes (`:checked`, `:hover`, etc.)
  - Flexbox e Grid
  - Media Queries
  - Transições e animações
- **JavaScript** (mínimo): Apenas para simulação de terminal e output
- **Bootstrap 5.3.2** (CDN): Utilitários opcionais
- **Font Awesome 6.5.1** (CDN): Ícones

### Backend
- **Java**: Linguagem base
- **Spring Boot**: Framework Java
- **Maven**: Gerenciador de dependências (implícito pela estrutura)

### Ferramentas de Build
- **Node.js**: Para script `build.js`
- **Bash**: Para script `build.sh`

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

### 1. **build.js** (Node.js)

```javascript
// Copia arquivos de src/ para dist/
// - index.html
// - style.css
```

**Uso**:
```bash
npm run build
```

### 2. **build.sh** (Bash)

```bash
# Cria diretório dist/
# Copia arquivos de src/ para dist/
```

**Uso**:
```bash
chmod +x build.sh
./build.sh
```

### Scripts NPM Disponíveis

```json
{
  "build": "node build.js",      // Gera pasta dist
  "clean": "rm -rf dist",        // Remove pasta dist
  "preview": "npm run build && open dist/index.html"  // Build e abre no navegador (macOS)
}
```

---

## 🚀 Configuração e Execução

### Pré-requisitos

- **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- **Node.js** (opcional, para build automatizado)
- **Java 17+** (se quiser executar a aplicação Spring Boot)
- **Maven** (se quiser compilar o backend)

### Opção 1: Visualizar Portfólio (Frontend)

#### Método A: Usar arquivos diretamente
```bash
# Abrir diretamente no navegador
open src/index.html
```

#### Método B: Usar build
```bash
# Gerar build
npm run build

# Abrir no navegador
open dist/index.html
```

#### Método C: Servidor local (recomendado)
```bash
# Python 3
cd dist && python3 -m http.server 8000

# Node.js (http-server)
npx http-server dist -p 8000

# PHP
cd dist && php -S localhost:8000
```

Acesse: `http://localhost:8000`

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

Edite as seções dentro de `<div contenteditable class="editor">` em `src/index.html`:

- `#_index_`: Apresentação
- `#_experience_`: Experiências
- `#_skills_`: Habilidades
- `#_contact_`: Contatos
- `#_readme_`: README

---

## 🐛 Problemas Conhecidos

1. **Navegadores antigos**: Podem não suportar o seletor `:has()`
2. **Edição limitada**: O conteúdo é editável, mas não persiste (apenas visual)
3. **Backend não implementado**: A aplicação Spring Boot está básica, sem funcionalidades
4. **Arquivos estáticos**: Os HTMLs em `static/` são básicos e não são usados pelo portfólio principal

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
