# delucena.dev - Portfolio

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Java](https://img.shields.io/badge/Java-ED8B00?logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=spring&logoColor=white)

Portfolio pessoal de **delucena.dev** apresentado em formato de IDE interativa. Uma interface criada com **CSS modular** e **JavaScript modular**, demonstrando o poder do CSS moderno usando seletores avançados, pseudo-classes e propriedades CSS para criar uma experiência interativa única. O projeto utiliza um sistema de templates modulares e build automatizado.

[🚀 Demo](#-como-usar) • [📖 Documentação](./DOCUMENTACAO.md) • [🤝 Contribuir](./CONTRIBUTING.md) • [🐛 Reportar Bug](https://github.com/delucena/delucena/issues) • [💡 Sugerir Feature](https://github.com/delucena/delucena/issues)

</div>

## 🎯 Sobre o Projeto

Este é o portfolio pessoal de **José Paulo de Lucena Oliveira (Zé/Delucena)**, um desenvolvedor Back-end especializado em Java e Spring Boot. O projeto demonstra como é possível criar interfaces interativas complexas usando CSS moderno e JavaScript modular. A interface inclui:

- ✅ Barra lateral com explorador de arquivos
- ✅ Editor de código com abas e syntax highlighting
- ✅ Terminal integrado com múltiplas abas (Problems, Output, Terminal, Debug, Ports)
- ✅ Menu de configurações
- ✅ Alternância entre tema claro e escuro
- ✅ Navegação entre arquivos
- ✅ Sistema de templates modulares
- ✅ CSS e JavaScript organizados em módulos
- ✅ Build automatizado com minificação
- ✅ Efeitos de hover e transições suaves

## 📁 Estrutura do Projeto

```
delucena/
├── src/                        # Código-fonte
│   ├── index.html              # HTML base (montado a partir de templates)
│   ├── 404.html                # Página de erro 404
│   ├── templates/              # Componentes HTML modulares
│   │   ├── navigation.html     # Barra lateral de navegação
│   │   ├── editor-header.html  # Cabeçalho do editor
│   │   └── terminal/           # Terminal modular
│   │       ├── terminal.html
│   │       ├── terminal-header.html
│   │       └── terminal-tabs/
│   │   ├── footer.html         # Rodapé
│   │   └── sections/           # Seções de conteúdo
│   │       ├── index-section.html
│   │       ├── experience-section.html
│   │       ├── skills-section.html
│   │       ├── contact-section.html
│   │       └── readme-section.html
│   ├── css/                    # Arquivos CSS modulares
│   │   ├── main.css            # Arquivo principal (importa todos)
│   │   ├── variables.css       # Variáveis CSS (tema, cores)
│   │   ├── reset.css           # Reset CSS
│   │   ├── layout.css          # Layout principal
│   │   ├── navigation.css     # Barra de navegação
│   │   ├── explorer.css        # Explorer de arquivos
│   │   ├── editor.css          # Editor de código
│   │   ├── syntax-highlight.css # Syntax highlighting
│   │   ├── terminal.css        # Terminal (wrapper)
│   │   └── terminal/           # CSS modular do terminal
│   ├── js/                     # Arquivos JavaScript modulares
│   │   ├── main.js             # Inicialização
│   │   ├── theme.js            # Gerenciamento de temas
│   │   ├── navigation.js       # Navegação
│   │   ├── code-highlighter.js # Syntax highlighting
│   │   ├── code-copy.js        # Cópia de código
│   │   ├── preview-toggle.js   # Alternância preview/código
│   │   └── terminal/           # Módulos do terminal
│   ├── assets/                 # Imagens e recursos
│   ├── config/                 # Arquivos de configuração
│   │   ├── _headers            # Headers Cloudflare Pages
│   │   ├── robots.txt          # Configuração para crawlers
│   │   └── sitemap.xml         # Mapa do site
│   ├── scripts/                # Scripts auxiliares
│   │   └── optimize-images.js  # Otimização de imagens
│   └── main/                   # Estrutura Spring Boot
│       ├── java/               # Código Java
│       └── resources/          # Recursos e configurações
├── scripts/                    # Scripts auxiliares
│   ├── serve.js                # Script de servidor (verifica e libera porta)
│   ├── optimize-images.js      # Otimização de imagens
│   └── generate-lcp-images.js  # Geração de imagens LCP
├── dist/                       # Arquivos compilados (gerados pelo build)
├── build.js                    # Script de build (Node.js)
├── build.sh                    # Script de build (Shell)
├── package.json                # Configuração do projeto
├── .gitignore                  # Arquivos ignorados pelo Git
├── .editorconfig               # Configuração do editor
├── .gitattributes              # Atributos Git
├── README.md                   # Este arquivo
├── DOCUMENTACAO.md            # Documentação completa
├── ESTRUTURA_PROJETO.md       # Estrutura detalhada
├── CONTRIBUTING.md            # Guia de contribuição
├── SECURITY.md                # Política de segurança
├── CHANGELOG.md               # Histórico de mudanças
└── LICENSE                     # Licença MIT
```

> 📚 Para mais detalhes sobre a estrutura, consulte [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)

## 🚀 Como Usar

### Pré-requisitos

- Um navegador moderno (Chrome, Firefox, Safari, Edge)
- Node.js (opcional, apenas para usar o script de build automatizado)

### Opção 1: Usar o Script de Build (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/delucena/delucena.git
   cd delucena
   ```

2. Instale as dependências (se necessário):
   ```bash
   npm install
   ```

3. Execute o build:
   ```bash
   npm run build
   ```

4. Visualize o resultado:
   ```bash
   npm run serve
   ```
   Acesse `http://localhost:8000` no navegador
   
   💡 **Dica:** O comando `npm run serve` automaticamente verifica se a porta 8000 está em uso e libera qualquer processo que esteja ocupando-a, evitando o erro "Address already in use".

**Scripts disponíveis:**
- `npm run build` - Gera a pasta dist com os arquivos compilados (monta templates, minifica CSS/JS)
- `npm run clean` - Remove a pasta dist
- `npm run preview` - ⚠️ Gera o build e abre no navegador (macOS), mas não funciona com i18n (usa file://)
- `npm run serve` - ✅ Gera o build e inicia servidor HTTP local na porta 8000 (recomendado). **Automaticamente verifica e libera a porta se estiver em uso**
- `npm run dev` - Alias para `serve`

**O que o build faz:**
- Monta `index.html` a partir de templates modulares
- **Consolida CSS** - Resolve todos os `@import` em um único arquivo `main.css` (funciona mesmo abrindo diretamente)
- Minifica CSS e JavaScript (cria arquivos .min.css e .min.js, mantém originais)
- Copia assets (imagens, favicons)
- Copia arquivos de configuração (robots.txt, sitemap.xml, _headers)
- Otimiza imagens (se script disponível)

**Nota:** O build consolida automaticamente todos os CSS (resolve `@import`) em um único arquivo `main.css`. 

⚠️ **Importante sobre imagens e i18n:** Se você abrir `dist/index.html` diretamente no navegador (protocolo `file://`), algumas funcionalidades podem não funcionar devido a restrições de segurança do navegador (CORS). Isso afeta especialmente o sistema de i18n que usa `fetch()` para carregar traduções. **Recomendado:** Use `npm run serve` para testar com um servidor HTTP local.

```bash
npm run build
npm run clean
npm run serve
```

Depois acesse `http://localhost:8000` no navegador.

⚠️ **Nota:** O comando `npm run preview` abre o arquivo diretamente do sistema de arquivos (`file://`), o que causa erros com requisições `fetch()` (usado pelo sistema de i18n). **Use sempre `npm run serve`** para garantir que tudo funcione corretamente.

### Opção 2: Usar o Script Shell (Alternativo)

1. Torne o script executável:
   ```bash
   chmod +x build.sh
   ```

2. Execute o build:
   ```bash
   ./build.sh
   ```

3. Abra `dist/index.html` no navegador

> **Nota:** O script shell é uma versão simplificada. Recomendamos usar `npm run build` para obter todas as funcionalidades (templates, minificação, consolidação CSS).

## 🌐 Como Visualizar

Após gerar a pasta `dist/`, você pode visualizar o projeto de várias formas:

1. **Abrir diretamente no navegador:**
   - Navegue até a pasta `dist/`
   - Abra `index.html` com seu navegador

2. **Usar um servidor local (recomendado):**
   ```bash
   # Usando o script npm (recomendado - libera porta automaticamente)
   npm run serve

   # Python 3 (manual)
   cd dist && python3 -m http.server 8000

   # Node.js (com http-server)
   npx http-server dist -p 8000

   # PHP
   cd dist && php -S localhost:8000
   ```

   Depois acesse: `http://localhost:8000`
   
   ⚠️ **Nota:** Se usar os comandos manuais (Python, Node.js, PHP) e a porta 8000 estiver em uso, você precisará encerrar o processo manualmente ou usar outra porta. O comando `npm run serve` faz isso automaticamente.

## 🎨 Recursos CSS Utilizados

Este projeto utiliza recursos avançados do CSS moderno:

- **Seletores `:has()`** - Para estilização baseada em estado de elementos filhos
- **Pseudo-classes `:checked`** - Para criar interatividade com inputs
- **Variáveis CSS** - Para temas e cores
- **Flexbox e Grid** - Para layout responsivo
- **Transições e animações** - Para efeitos suaves
- **Media queries** - Para responsividade

## 📝 Dependências Externas

O projeto utiliza CDNs para:

- **Bootstrap 5.3.2** - Para alguns utilitários (opcional)
- **Font Awesome 6.5.1** - Para ícones

Essas dependências são carregadas via CDN no HTML, então não é necessário instalar nada localmente.

## 🔧 Personalização

### Alterar Conteúdo

Edite os templates em `src/templates/`:
- `src/templates/sections/*.html` - Seções do portfólio
- `src/templates/navigation.html` - Barra lateral
- `src/templates/terminal/` - Terminal e abas

### Adicionar Novas Seções

1. Crie um novo template em `src/templates/sections/nova-secao.html`
2. Adicione o placeholder no `src/index.html`: `<!-- TEMPLATE: sections/nova-secao.html -->`
3. Adicione um novo label no explorer (`src/templates/navigation.html`)
4. Adicione uma nova aba no header (`src/templates/editor-header.html`)
5. Adicione as regras CSS correspondentes em `src/css/editor.css`

### Modificar Tema

As cores são definidas em variáveis CSS em `src/css/variables.css`:

```css
:root {
  --bg-clr-500: rgb(30, 30, 30);
  --secondary-clr-500: rgb(37, 37, 38);
  /* ... */
}

body:has(#theme:checked) {
  --bg-clr-500: rgb(255, 255, 255);
  --secondary-clr-500: rgb(243, 243, 243);
  /* ... */
}
```

### Adicionar Novas Funcionalidades JavaScript

1. Crie um novo módulo em `src/js/novo-modulo.js`
2. Adicione o script no `src/index.html`
3. Inicialize o módulo em `src/js/main.js` se necessário

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - HTML5 semântico
  - CSS3 modular (variáveis, seletores `:has()`, pseudo-classes)
  - JavaScript ES6+ modular
  - Sistema de templates HTML
  - Bootstrap 5.3.2 (CDN)
  - Font Awesome 6.5.1 (CDN)

- **Backend:**
  - Java
  - Spring Boot

- **Ferramentas:**
  - Node.js (build system)
  - Git
  - Build automatizado com minificação

## 📊 Estatísticas

- **Total de arquivos**: ~50+ arquivos
- **Linhas de código HTML**: ~1000+ (templates modulares)
- **Linhas de código CSS**: ~2000+ (CSS modular)
- **Linhas de código JavaScript**: ~2000+ (JS modular)
- **Linhas de código Java**: ~12+

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia o [guia de contribuição](./CONTRIBUTING.md) primeiro.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 🔒 Segurança

Se você descobrir uma vulnerabilidade de segurança, por favor, não abra uma issue pública. Em vez disso, consulte nossa [política de segurança](./SECURITY.md).

## 📚 Documentação Adicional

- [📖 Documentação Completa](./DOCUMENTACAO.md) - Detalhes técnicos completos
- [📊 Estrutura do Projeto](./ESTRUTURA_PROJETO.md) - Visão geral da arquitetura
- [🤝 Guia de Contribuição](./CONTRIBUTING.md) - Como contribuir
- [🔒 Política de Segurança](./SECURITY.md) - Reportar vulnerabilidades
- [📝 Changelog](./CHANGELOG.md) - Histórico de mudanças

## 🙏 Créditos

- **Interface Baseada em:** Visual Studio Code da Microsoft
- **Desenvolvido por:** [José Paulo de Lucena Oliveira](https://github.com/delucena) (delucena)

## 📞 Contato

- **Website**: [delucena.dev](https://delucena.dev)
- **LinkedIn**: [delucena](https://www.linkedin.com/in/delucena)
- **GitHub**: [@delucena](https://github.com/delucena)
- **Email**: josepaulo@delucena.dev

## 🐛 Problemas Conhecidos

- Alguns navegadores mais antigos podem não suportar o seletor `:has()`
- A funcionalidade de edição de conteúdo é limitada (apenas visual)
- Requer build para funcionar corretamente (HTML é montado a partir de templates)

## 📚 Recursos de Aprendizado

- [CSS :has() Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Font Awesome](https://fontawesome.com/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)

## 🏗️ Arquitetura

O projeto utiliza uma arquitetura modular:

- **Templates HTML**: Componentes reutilizáveis montados durante o build
- **CSS Modular**: Arquivos separados por funcionalidade, consolidados no build
- **JavaScript Modular**: Módulos ES6 com IIFE para encapsulamento
- **Build System**: Consolidação automática de CSS/JS e minificação

Para mais detalhes sobre a arquitetura, consulte [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md).

---

**Desenvolvido com ❤️ usando CSS modular e JavaScript moderno**
