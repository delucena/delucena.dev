# delucena.dev - Portfolio

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Java](https://img.shields.io/badge/Java-ED8B00?logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=spring&logoColor=white)

Portfolio pessoal de **delucena.dev** apresentado em formato de IDE interativa. Uma interface criada **apenas com CSS**, sem dependência de JavaScript para a funcionalidade principal, demonstrando o poder do CSS moderno usando seletores avançados, pseudo-classes e propriedades CSS para criar uma experiência interativa única.

[🚀 Demo](#-como-usar) • [📖 Documentação](./DOCUMENTACAO.md) • [🤝 Contribuir](./CONTRIBUTING.md) • [🐛 Reportar Bug](https://github.com/delucena/delucena/issues) • [💡 Sugerir Feature](https://github.com/delucena/delucena/issues)

</div>

## 🎯 Sobre o Projeto

Este é o portfolio pessoal de **José Paulo de Lucena Oliveira (Zé/Delucena)**, um desenvolvedor Back-end especializado em Java e Spring Boot. O projeto demonstra como é possível criar interfaces interativas complexas usando apenas CSS, sem depender de JavaScript. A interface inclui:

- ✅ Barra lateral com explorador de arquivos
- ✅ Editor de código com abas
- ✅ Terminal integrado
- ✅ Menu de configurações
- ✅ Alternância entre tema claro e escuro
- ✅ Navegação entre arquivos
- ✅ Efeitos de hover e transições suaves

## 📁 Estrutura do Projeto

```
delucena/
├── src/                        # Código-fonte
│   ├── index.html              # HTML principal
│   ├── css/                    # Arquivos CSS modulares
│   ├── js/                     # Arquivos JavaScript
│   ├── assets/                 # Imagens e recursos
│   └── main/                   # Estrutura Spring Boot
│       ├── java/               # Código Java
│       └── resources/          # Recursos e configurações
├── dist/                       # Arquivos compilados (gerados)
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
└── LICENSE.txt                # Licença MIT
```

> 📚 Para mais detalhes sobre a estrutura, consulte [ESTRUTURA_PROJETO.md](./ESTRUTURA_PROJETO.md)

## 🚀 Como Usar

### Pré-requisitos

- Um navegador moderno (Chrome, Firefox, Safari, Edge)
- Node.js (opcional, apenas para usar o script de build automatizado)

### Opção 1: Usar os Arquivos Diretamente

1. Abra o arquivo `src/index.html` diretamente no navegador
2. Ou copie manualmente os arquivos de `src/` para `dist/`:
   ```bash
   cp src/index.html dist/index.html
   cp src/style.css dist/style.css
   ```

### Opção 2: Usar o Script de Build (Node.js)

1. Instale as dependências (se necessário):
   ```bash
   npm install
   ```

2. Execute o build:
   ```bash
   npm run build
   ```

3. Abra `dist/index.html` no navegador

**Scripts disponíveis:**
- `npm run build` - Gera a pasta dist com os arquivos compilados
- `npm run clean` - Remove a pasta dist
- `npm run preview` - Gera o build e abre no navegador (macOS)

```bash
npm run build
npm run clean
npm run preview
```

### Opção 3: Usar o Script Shell

1. Torne o script executável:
   ```bash
   chmod +x build.sh
   ```

2. Execute o build:
   ```bash
   ./build.sh
   ```

3. Abra `dist/index.html` no navegador

## 📦 Gerando a Pasta Dist

A pasta `dist/` contém os arquivos prontos para produção. Para gerá-la:

### Método 1: Script Node.js
```bash
npm run build
```

### Método 2: Script Shell
```bash
./build.sh
```

### Método 3: Manualmente
```bash
mkdir -p dist
cp src/index.html dist/index.html
cp src/style.css dist/style.css
```

## 🌐 Como Visualizar

Após gerar a pasta `dist/`, você pode visualizar o projeto de várias formas:

1. **Abrir diretamente no navegador:**
   - Navegue até a pasta `dist/`
   - Abra `index.html` com seu navegador

2. **Usar um servidor local (recomendado):**
   ```bash
   # Python 3
   cd dist && python3 -m http.server 8000

   # Node.js (com http-server)
   npx http-server dist -p 8000

   # PHP
   cd dist && php -S localhost:8000
   ```

   Depois acesse: `http://localhost:8000`

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

Edite os arquivos em `src/`:
- `src/index.html` - Conteúdo e estrutura
- `src/style.css` - Estilos e temas

### Adicionar Novos Arquivos

1. Adicione uma nova seção no HTML dentro de `<div class="editor">`
2. Adicione um novo label no explorer
3. Adicione uma nova aba no header
4. Adicione as regras CSS correspondentes (veja os comentários no CSS)

### Modificar Tema

As cores são definidas em variáveis CSS no início de `style.css`:

```css
:root {
  --bg-clr-500: rgb(30, 30, 30);
  --secondary-clr-500: rgb(37, 37, 38);
  /* ... */
}
```

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - HTML5 semântico
  - CSS3 (variáveis, seletores `:has()`, pseudo-classes)
  - JavaScript (mínimo, apenas para simulação)
  - Bootstrap 5.3.2 (CDN)
  - Font Awesome 6.5.1 (CDN)

- **Backend:**
  - Java
  - Spring Boot

- **Ferramentas:**
  - Node.js (build)
  - Git

## 📊 Estatísticas

- **Linhas de código HTML**: ~1000+
- **Linhas de código CSS**: ~1900+
- **Linhas de código JavaScript**: ~400+
- **Linhas de código Java**: ~12+

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Por favor, leia o [guia de contribuição](./CONTRIBUTING.md) primeiro.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.txt](./LICENSE.txt) para mais detalhes.

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

## 📚 Recursos de Aprendizado

- [CSS :has() Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Font Awesome](https://fontawesome.com/)

---

**Desenvolvido com ❤️ usando apenas CSS**
