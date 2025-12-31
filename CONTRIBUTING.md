# Guia de Contribuição

Obrigado por considerar contribuir para o projeto delucena.dev! 🎉

Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)

## 📜 Código de Conduta

Este projeto segue um código de conduta. Ao participar, você concorda em manter este código.

## 🤝 Como Contribuir

### Reportar Bugs

Se você encontrou um bug:

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/delucena/delucena/issues)
2. Se não foi reportado, crie uma nova issue com:
   - Título claro e descritivo
   - Descrição detalhada do problema
   - Passos para reproduzir
   - Comportamento esperado vs. comportamento atual
   - Screenshots (se aplicável)
   - Informações do ambiente (navegador, OS, versão)

### Sugerir Melhorias

Sugestões são sempre bem-vindas! Para sugerir uma melhoria:

1. Verifique se a sugestão já não existe nas [Issues](https://github.com/delucena/delucena/issues)
2. Crie uma nova issue com:
   - Título claro
   - Descrição detalhada da funcionalidade
   - Justificativa e casos de uso
   - Exemplos (se aplicável)

### Contribuir com Código

1. **Fork o repositório**
2. **Crie uma branch** para sua feature/fix:
   ```bash
   git checkout -b feature/minha-feature
   # ou
   git checkout -b fix/correcao-bug
   ```
3. **Faça suas alterações** seguindo os padrões de código
4. **Teste suas alterações** localmente
5. **Commit suas alterações** com mensagens claras
6. **Push para sua branch**:
   ```bash
   git push origin feature/minha-feature
   ```
7. **Abra um Pull Request**

## 🔄 Processo de Desenvolvimento

### Setup do Ambiente

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

4. Visualize localmente:
   ```bash
   npm run preview
   # ou use um servidor HTTP local
   ```

### Estrutura do Projeto

- `src/` - Código-fonte
  - `index.html` - HTML principal
  - `css/` - Arquivos CSS
  - `js/` - Arquivos JavaScript
  - `assets/` - Imagens e recursos
- `dist/` - Arquivos compilados (gerados)
- `build.js` / `build.sh` - Scripts de build

## 📝 Padrões de Código

### HTML

- Use indentação de 2 espaços
- Use atributos semânticos
- Mantenha a estrutura acessível (ARIA labels quando necessário)
- Use aspas duplas para atributos

### CSS

- Use indentação de 2 espaços
- Organize por seções lógicas
- Use variáveis CSS para cores e valores reutilizáveis
- Comente seções complexas
- Siga a convenção BEM quando aplicável

### JavaScript

- Use indentação de 2 espaços
- Use `'use strict'` em módulos
- Comente funções complexas
- Mantenha funções pequenas e focadas
- Use nomes descritivos para variáveis e funções

### Java

- Use indentação de 4 espaços
- Siga as convenções de nomenclatura Java
- Adicione JavaDoc para classes e métodos públicos
- Mantenha métodos pequenos e focados

## 💬 Commit Messages

Use mensagens de commit claras e descritivas:

```
tipo(escopo): descrição curta

Descrição mais detalhada (se necessário)

Fixes #123
```

### Tipos de Commit

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula faltando, etc.
- `refactor`: Refatoração de código
- `test`: Adição de testes
- `chore`: Tarefas de manutenção

### Exemplos

```
feat(editor): adiciona suporte a múltiplas abas

fix(navigation): corrige bug no menu mobile

docs(readme): atualiza instruções de instalação

style(css): formata código CSS
```

## 🔍 Pull Requests

### Antes de Abrir um PR

- [ ] Código segue os padrões do projeto
- [ ] Testes passam (se aplicável)
- [ ] Documentação foi atualizada (se necessário)
- [ ] Commits seguem o padrão de mensagens
- [ ] Branch está atualizada com a branch principal

### Template de PR

```markdown
## Descrição
Breve descrição das mudanças

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Checklist
- [ ] Código testado localmente
- [ ] Documentação atualizada
- [ ] Sem novos warnings
- [ ] Testes passando (se aplicável)

## Screenshots (se aplicável)
Adicione screenshots aqui

## Issues Relacionadas
Fixes #123
```

### Revisão de Código

- PRs serão revisados pelo mantenedor
- Feedback será fornecido de forma construtiva
- Mudanças podem ser solicitadas antes do merge

## 📚 Recursos Adicionais

- [Documentação Completa](./DOCUMENTACAO.md)
- [Estrutura do Projeto](./ESTRUTURA_PROJETO.md)
- [README](./README.md)

## 🙏 Agradecimentos

Obrigado por contribuir! Cada contribuição, grande ou pequena, é valiosa para o projeto.

---

**Mantido por**: [Delucena](https://github.com/delucena)
