# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [2.0.0] - 2025-01-01

### Adicionado
- Sistema de templates modulares para HTML (navigation, editor-header, terminal, footer, sections)
- Página 404 personalizada com design consistente ao portfólio
- Syntax highlighting com cores do Visual Studio Code (tema dark/light)
- Meta tags completas de SEO (Open Graph, Twitter Cards)
- Structured Data (JSON-LD) para melhor indexação
- Arquivos de configuração SEO (robots.txt, sitemap.xml)
- Configuração _headers para Cloudflare Pages (cache e segurança)
- Script de otimização de imagens (WebP + fallback PNG)
- Minificação automática de CSS e JS no build
- Sistema de versionamento de assets (cache busting)
- Skip link para acessibilidade
- Classes utilitárias para screen readers (.sr-only)
- Error handling e JSDoc em todos os módulos JavaScript
- Suporte a lazy loading de imagens

### Modificado
- Refatoração completa do HTML monolítico em componentes modulares
- Build system atualizado para processar templates e minificar assets
- Melhorias de acessibilidade (ARIA labels, roles, skip links)
- Melhorias de semântica HTML
- JavaScript com error handling robusto e documentação JSDoc
- CSS consolidado com variáveis de syntax highlighting
- Estrutura de diretórios reorganizada (templates/, config/, scripts/)

### Melhorado
- Performance: minificação de assets, otimização de imagens
- SEO: meta tags completas, structured data, sitemap
- Acessibilidade: WCAG 2.1 compliance, navegação por teclado
- Manutenibilidade: código modular, documentado e organizado
- Cache: configuração otimizada para Cloudflare Pages
- Segurança: headers de segurança implementados

### Removido
- style.css duplicado (mantido apenas sistema modular)
- Código HTML monolítico (substituído por templates)

## [1.0.0] - 2025-12-31

### Adicionado
- Interface de portfólio inspirada no Visual Studio Code
- Sistema de navegação baseado puramente em CSS
- Suporte a temas claro e escuro
- Explorer de arquivos interativo
- Editor de código com múltiplas abas
- Terminal simulado com logs de execução
- Seções de portfólio:
  - Apresentação pessoal
  - Experiências profissionais
  - Habilidades técnicas
  - Informações de contato
  - README com badges
- Sistema de extensões (formação acadêmica e certificações)
- Menu de configurações
- Responsividade para dispositivos móveis
- Scripts de build (Node.js e Bash)
- Documentação completa do projeto
- Estrutura básica Spring Boot
- Arquivos estáticos HTML

### Documentação
- README.md com instruções de uso
- DOCUMENTACAO.md com detalhes técnicos completos
- ESTRUTURA_PROJETO.md com visão geral da arquitetura
- CONTRIBUTING.md com diretrizes de contribuição
- SECURITY.md com política de segurança
- CHANGELOG.md para versionamento

### Configuração
- package.json com scripts de build e metadados completos
- .gitignore completo com padrões para IDEs, OS e arquivos de build
- .gitattributes para normalização de linha
- .editorconfig para padronização de código
- Templates do GitHub para issues e pull requests

### Melhorado
- README.md com badges profissionais, links e estrutura aprimorada
- Remoção de caminhos absolutos pessoais do código
- Limpeza de console.log desnecessários
- package.json com informações de repositório, engines e browserslist
- LICENSE atualizado com copyrights corretos

### Tecnologias
- HTML5 semântico
- CSS3 avançado (variáveis, seletores :has(), pseudo-classes)
- JavaScript mínimo para simulação de terminal
- Spring Boot (estrutura básica)
- Bootstrap 5.3.2 (via CDN)
- Font Awesome 6.5.1 (via CDN)

---

## Tipos de Mudanças

- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades corrigidas

---

**Mantido por**: [Delucena](https://github.com/delucena)
