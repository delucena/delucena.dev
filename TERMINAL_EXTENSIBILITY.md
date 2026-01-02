# Guia de Extensibilidade do Terminal

Este documento descreve como adicionar novos módulos/abas ao terminal sem muita complexidade.

## Visão Geral

O sistema de terminal foi projetado para ser extensível. Para adicionar uma nova aba, você precisa seguir um padrão simples e consistente.

## Estrutura de Arquivos

```
src/
├── templates/
│   └── terminal/
│       ├── terminal.html (estrutura base)
│       ├── terminal-header.html (header com abas)
│       └── terminal-tabs/
│           ├── problems-tab.html
│           ├── output-tab.html
│           ├── terminal-tab.html
│           ├── debug-tab.html
│           └── ports-tab.html
├── css/
│   └── terminal/
│       ├── terminal-base.css
│       ├── terminal-problems.css
│       ├── terminal-output.css
│       ├── terminal-terminal.css
│       ├── terminal-debug.css
│       └── terminal-ports.css
└── js/
    └── terminal/
        ├── terminal-core.js (sistema de registro)
        ├── terminal-problems.js
        ├── terminal-output.js
        ├── terminal-terminal.js
        ├── terminal-debug.js
        └── terminal-ports.js
```

## Processo Passo a Passo

### Exemplo: Adicionar uma nova aba "Logs"

#### 1. Criar Template HTML

Criar arquivo: `src/templates/terminal/terminal-tabs/logs-tab.html`

```html
<!-- Logs Tab -->
<div class="tab-content terminal-content-logs">
    <div class="terminal-logs">
        <div class="terminal-logs-scrollable">
            <!-- Conteúdo da aba que scrolla -->
            <div class="terminal-log-item">
                <span class="terminal-log-time">10:23:45</span>
                <span class="terminal-log-level">INFO</span>
                <span class="terminal-log-message">Application started</span>
            </div>
        </div>
    </div>
</div>
```

**Estrutura obrigatória:**
- Container: `.tab-content.terminal-content-{name}`
- Wrapper: `.terminal-{name}`
- Área scrollable: `.terminal-{name}-scrollable` (obrigatório para scroll funcionar)

#### 2. Criar CSS

Criar arquivo: `src/css/terminal/terminal-logs.css`

```css
/* ============================================
   TERMINAL LOGS - Aba de Logs
   ============================================ */

.terminal .terminal-logs {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0;
}

.terminal .terminal-logs-scrollable {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  font-family: var(--font-family-mono);
  padding: var(--spacing-md) var(--spacing-xl);
}

.terminal .terminal-log-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  font-size: var(--font-size-base);
}

.terminal .terminal-log-time {
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
  min-width: 80px;
}

.terminal .terminal-log-level {
  color: var(--color-info);
  font-weight: 600;
  min-width: 60px;
}

.terminal .terminal-log-message {
  color: var(--color-text-primary);
  flex: 1;
}
```

**Regras obrigatórias:**
- Container: `.terminal-{name}` com `display: flex`, `flex-direction: column`, `height: 100%`, `overflow: hidden`
- Área scrollable: `.terminal-{name}-scrollable` com `flex: 1`, `min-height: 0`, `overflow-y: auto`, `overflow-x: hidden`
- Usar variáveis CSS do projeto (`variables.css`)

#### 3. Criar JavaScript (se necessário)

Criar arquivo: `src/js/terminal/terminal-logs.js`

```javascript
/**
 * Terminal Logs
 * Lógica da aba de Logs
 * 
 * @module terminal-logs
 */

(function() {
  'use strict';

  const SELECTORS = {
    logsContent: '.terminal-logs-scrollable'
  };

  /**
   * Inicializa a aba de Logs
   */
  function init() {
    try {
      // Sua lógica de inicialização aqui
      console.log('Terminal Logs inicializado');
    } catch (error) {
      console.error('Erro ao inicializar Terminal Logs:', error);
    }
  }

  // Registrar aba no sistema
  if (typeof TerminalCore !== 'undefined') {
    TerminalCore.registerTab('logs', {
      id: 'logs',
      label: 'LOGS',
      icon: 'fa-solid fa-file-lines',
      init: init
    });
  }

  // Auto-inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

**Padrão obrigatório:**
- Usar IIFE (Immediately Invoked Function Expression)
- Registrar a aba usando `TerminalCore.registerTab()`
- Usar JSDoc para documentação
- Error handling consistente

#### 4. Adicionar Radio Button no HTML Base

Editar: `src/templates/terminal/terminal.html`

Adicionar antes do `</div>` do container:

```html
<input type="radio" name="terminal" id="logs">
```

#### 5. Adicionar Label no Header

Editar: `src/templates/terminal/terminal-header.html`

Adicionar antes do `</div>` do header:

```html
<label for="logs" class="terminal-tab-logs">
    <i class="fa-solid fa-file-lines"></i>
    <span>LOGS</span>
</label>
```

#### 6. Incluir Template no Terminal Base

Editar: `src/templates/terminal/terminal.html`

Adicionar no `<div class="content">`:

```html
<!-- TEMPLATE: terminal-tabs/logs-tab.html -->
```

#### 7. Atualizar Build Script

Editar: `build.js`

Na função `buildIndexHtml()`, adicionar após os outros templates:

```javascript
terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/logs-tab.html -->', readTemplate('terminal/terminal-tabs/logs-tab.html'));
```

#### 8. Adicionar Import do CSS

Editar: `src/css/main.css`

Adicionar após os outros imports do terminal:

```css
@import url('./terminal/terminal-logs.css');
```

#### 9. Adicionar Script no HTML

Editar: `src/index.html`

Adicionar após os outros scripts do terminal:

```html
<script src="./js/terminal/terminal-logs.js" defer></script>
```

## Convenções e Padrões

### Nomenclatura

- **CSS Classes**: `.terminal-{name}-{element}` (ex: `.terminal-logs-scrollable`)
- **JavaScript**: `terminal-{name}.js` (ex: `terminal-logs.js`)
- **Templates**: `{name}-tab.html` (ex: `logs-tab.html`)
- **IDs**: Usar kebab-case (ex: `logs`, `my-new-tab`)

### Estrutura HTML Obrigatória

```html
<div class="tab-content terminal-content-{name}">
    <div class="terminal-{name}">
        <!-- Header fixo (opcional) -->
        <div class="terminal-{name}-header">
            <!-- Conteúdo fixo que não scrolla -->
        </div>
        <!-- Área de conteúdo com scroll (obrigatório) -->
        <div class="terminal-{name}-scrollable">
            <!-- Conteúdo que scrolla -->
        </div>
    </div>
</div>
```

### CSS Obrigatório

```css
.terminal .terminal-{name} {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 0;
}

.terminal .terminal-{name}-scrollable {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
```

### JavaScript Obrigatório

```javascript
(function() {
  'use strict';
  
  function init() {
    // Inicialização
  }
  
  if (typeof TerminalCore !== 'undefined') {
    TerminalCore.registerTab('{name}', {
      id: '{name}',
      label: '{LABEL}',
      icon: 'fa-icon-class',
      init: init
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

## Sistema de Registro de Abas

O `TerminalCore.registerTab()` permite registrar novas abas dinamicamente:

```javascript
TerminalCore.registerTab('logs', {
  id: 'logs',                    // ID único da aba
  label: 'LOGS',                 // Label exibido no header
  icon: 'fa-solid fa-file-lines', // Classe do ícone Font Awesome
  init: init                     // Função de inicialização (opcional)
});
```

## Checklist para Nova Aba

- [ ] Template HTML criado em `terminal-tabs/{name}-tab.html`
- [ ] CSS criado em `terminal/terminal-{name}.css` com scroll implementado
- [ ] JavaScript criado em `terminal/terminal-{name}.js` (se necessário)
- [ ] Radio button adicionado em `terminal.html`
- [ ] Label adicionado em `terminal-header.html`
- [ ] Template incluído em `terminal.html`
- [ ] Build script atualizado em `build.js`
- [ ] CSS importado em `main.css`
- [ ] Script incluído em `index.html`
- [ ] Aba registrada usando `TerminalCore.registerTab()`
- [ ] Testado funcionamento completo

## Exemplos Práticos

### Exemplo 1: Aba Simples (sem JavaScript)

Para uma aba que apenas exibe conteúdo estático:

1. Criar template HTML
2. Criar CSS com scroll
3. Adicionar radio button e label
4. Incluir template e atualizar build
5. Importar CSS

Não é necessário criar JavaScript.

### Exemplo 2: Aba com Interatividade

Para uma aba que precisa de lógica JavaScript:

1. Seguir todos os passos do Exemplo 1
2. Criar módulo JavaScript
3. Registrar aba usando `TerminalCore.registerTab()`
4. Incluir script no `index.html`

## Troubleshooting

### Scroll não funciona

- Verificar se `.terminal-{name}-scrollable` tem `flex: 1` e `min-height: 0`
- Verificar se o container pai tem `display: flex` e `flex-direction: column`
- Verificar se `overflow-y: auto` está aplicado

### Aba não aparece

- Verificar se o radio button foi adicionado
- Verificar se o label foi adicionado no header
- Verificar se o CSS está importado
- Verificar se o template está incluído no build

### JavaScript não executa

- Verificar se o script está incluído no `index.html`
- Verificar se `TerminalCore` está disponível (script `terminal-core.js` carregado primeiro)
- Verificar console do navegador para erros

## Suporte

Para dúvidas ou problemas, consulte:
- Código existente das abas (Problems, Output, Terminal, Debug, Ports)
- Este documento
- Comentários no código fonte
