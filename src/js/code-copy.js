/**
 * Code Copy - Funcionalidade de copiar código HTML
 * Permite copiar o código HTML puro (sem spans de highlight) para a área de transferência
 * 
 * @module code-copy
 * @description Gerencia a cópia de código HTML com feedback visual
 */

(function() {
  'use strict';

  const SELECTORS = {
    codeViewContainer: '#codeViewContainer',
    codeViewContent: '#codeViewContent',
    copyButton: '#codeCopyButton'
  };

  let copyButton = null;
  let codeViewContent = null;

  /**
   * Extrai o texto puro do HTML (sem spans de highlight)
   * @param {HTMLElement} element - Elemento contendo o código com spans
   * @returns {string} - Texto HTML puro
   */
  function extractPlainText(element) {
    if (!element) return '';
    
    // Cria um elemento temporário para processar
    const temp = document.createElement('div');
    // Clona o conteúdo do elemento
    Array.from(element.childNodes).forEach(node => {
      temp.appendChild(node.cloneNode(true));
    });
    
    // Remove todos os spans e mantém apenas o texto
    const spans = temp.querySelectorAll('span.token');
    spans.forEach(span => {
      const textNode = document.createTextNode(span.textContent);
      span.parentNode.replaceChild(textNode, span);
    });
    
    // Converte entidades HTML de volta para caracteres
    let text = temp.textContent || temp.innerText || '';
    
    // Converte entidades HTML escapadas de volta
    text = text
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&amp;/g, '&');
    
    return text;
  }

  /**
   * Copia texto para a área de transferência usando Clipboard API
   * @param {string} text - Texto a ser copiado
   * @returns {Promise<boolean>} - true se copiado com sucesso
   */
  async function copyToClipboard(text) {
    try {
      // Tenta usar a API moderna do Clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback para navegadores mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    } catch (err) {
      console.error('Erro ao copiar para área de transferência:', err);
      return false;
    }
  }

  /**
   * Mostra feedback visual de cópia bem-sucedida
   */
  function showCopyFeedback() {
    if (!copyButton) return;
    
    const originalTitle = copyButton.getAttribute('title') || copyButton.getAttribute('aria-label') || '';
    const icon = copyButton.querySelector('svg');
    
    // Atualiza o ícone temporariamente
    if (icon) {
      const originalHTML = icon.outerHTML;
      icon.outerHTML = '<svg class="icon icon--md" width="20" height="20" viewBox="0 0 448 512" fill="currentColor" aria-hidden="true"><use href="#icon-check"></use></svg>';
      copyButton.setAttribute('title', 'Copiado!');
      copyButton.setAttribute('aria-label', 'Código copiado com sucesso');
      
      // Restaura após 2 segundos
      setTimeout(() => {
        const currentIcon = copyButton.querySelector('svg');
        if (currentIcon) {
          currentIcon.outerHTML = originalHTML;
        }
        copyButton.setAttribute('title', originalTitle);
        copyButton.setAttribute('aria-label', originalTitle);
      }, 2000);
    }
  }

  /**
   * Manipula o clique no botão de copiar
   */
  async function handleCopyClick() {
    if (!codeViewContent) {
      return;
    }
    
    // Extrai o texto puro (sem spans)
    const plainText = extractPlainText(codeViewContent);
    
    if (!plainText) {
      return;
    }
    
    // Copia para a área de transferência
    const success = await copyToClipboard(plainText);
    
    if (success) {
      showCopyFeedback();
    } else {
      console.error('Falha ao copiar código');
      // Poderia mostrar uma mensagem de erro ao usuário aqui
    }
  }

  /**
   * Cria o botão de copiar se não existir
   */
  function createCopyButton() {
    const container = document.querySelector(SELECTORS.codeViewContainer);
    if (!container) return;
    
    // Verifica se o botão já existe
    let button = container.querySelector(SELECTORS.copyButton);
    if (button) {
      copyButton = button;
      return;
    }
    
    // Cria o botão
    button = document.createElement('button');
    button.id = 'codeCopyButton';
    button.className = 'code-copy-button';
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', 'Copiar código');
    button.setAttribute('title', 'Copiar código');
    
    // Cria o SVG via DOM
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon icon--md');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 1920 1920');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#icon-copy');
    svg.appendChild(use);
    
    const srOnly = document.createElement('span');
    srOnly.className = 'sr-only';
    srOnly.textContent = 'Copiar código';
    
    button.appendChild(svg);
    button.appendChild(srOnly);
    
    // Adiciona o evento de clique
    button.addEventListener('click', handleCopyClick);
    
    // Adiciona ao container
    container.appendChild(button);
    copyButton = button;
  }

  /**
   * Inicializa os elementos do DOM
   */
  function initElements() {
    codeViewContent = document.querySelector(SELECTORS.codeViewContent);
    createCopyButton();
  }

  /**
   * Inicializa o módulo de copiar código
   */
  function init() {
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initElements();
      });
    } else {
      initElements();
    }
    
    // Observa mudanças no container de código para garantir que o botão seja criado
    // quando o código for exibido
    const observer = new MutationObserver(() => {
      if (document.querySelector(SELECTORS.codeViewContainer) && !copyButton) {
        initElements();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Inicializa quando o módulo é carregado
  init();
})();
