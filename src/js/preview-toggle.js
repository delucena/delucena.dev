/**
 * Preview Toggle - Alterna entre visualização e código
 * Gerencia a alternância entre preview (renderizado) e código (HTML formatado)
 */

(function() {
  'use strict';

  // Mapeamento de IDs de arquivo para classes de seção
  const fileSectionMap = {
    'readme': '.readme',
    'index': '.index',
    'experience': '.experience',
    'skills': '.skills',
    'contact': '.contact'
  };

  /**
   * Formata HTML de forma limpa e legível
   * @param {string} html - HTML a ser formatado
   * @returns {string} - HTML formatado
   */
  function formatHTML(html) {
    if (!html) return '';
    
    let formatted = '';
    let indent = 0;
    const tab = '  '; // 2 espaços
    const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                             'link', 'meta', 'param', 'source', 'track', 'wbr'];
    
    // Normaliza o HTML
    html = html.trim();
    
    // Processa o HTML caractere por caractere para melhor controle
    let i = 0;
    let inTag = false;
    let tagBuffer = '';
    let textBuffer = '';
    
    while (i < html.length) {
      const char = html[i];
      
      if (char === '<') {
        // Processa texto acumulado antes da tag
        if (textBuffer.trim()) {
          formatted += tab.repeat(indent) + escapeHtml(textBuffer.trim()) + '\n';
          textBuffer = '';
        }
        
        inTag = true;
        tagBuffer = '<';
        i++;
        
        // Coleta a tag completa
        while (i < html.length && html[i] !== '>') {
          tagBuffer += html[i];
          i++;
        }
        
        if (i < html.length) {
          tagBuffer += '>';
          i++;
        }
        
        // Processa a tag
        const tagContent = tagBuffer.trim();
        const isClosingTag = tagContent.startsWith('</');
        const isSelfClosing = tagContent.endsWith('/>') || 
                            selfClosingTags.some(tag => 
                              new RegExp(`^<${tag}[\\s/>]`, 'i').test(tagContent)
                            );
        
        if (isClosingTag) {
          indent = Math.max(0, indent - 1);
          formatted += tab.repeat(indent) + tagContent + '\n';
        } else if (isSelfClosing) {
          formatted += tab.repeat(indent) + tagContent + '\n';
        } else {
          formatted += tab.repeat(indent) + tagContent + '\n';
          indent++;
        }
        
        inTag = false;
        tagBuffer = '';
      } else {
        if (!inTag) {
          textBuffer += char;
        }
        i++;
      }
    }
    
    // Processa texto restante
    if (textBuffer.trim()) {
      formatted += tab.repeat(indent) + escapeHtml(textBuffer.trim()) + '\n';
    }
    
    return formatted.trim();
  }

  /**
   * Escapa caracteres HTML especiais
   * @param {string} text - Texto a ser escapado
   * @returns {string} - Texto escapado
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Obtém o HTML da seção atual de forma limpa
   * @returns {string} - HTML da seção atual formatado
   */
  function getCurrentSectionHTML() {
    const editor = document.querySelector('.editor');
    
    if (!editor) return '';
    
    // Encontra qual arquivo está selecionado
    let selectedFile = null;
    for (const fileId in fileSectionMap) {
      const radio = document.getElementById(fileId);
      if (radio && radio.checked) {
        selectedFile = fileId;
        break;
      }
    }
    
    if (!selectedFile) return '';
    
    // Encontra a seção correspondente
    const sectionSelector = fileSectionMap[selectedFile];
    const section = editor.querySelector(sectionSelector);
    
    if (!section) return '';
    
    // Clona a seção para não modificar o original
    const clone = section.cloneNode(true);
    
    // Remove atributos desnecessários
    clone.removeAttribute('id');
    clone.removeAttribute('contenteditable');
    
    // Mantém a classe para contexto, mas pode ser removida se necessário
    const className = clone.className;
    clone.removeAttribute('class');
    
    // Adiciona a tag de abertura com classe se existir
    let html = '';
    if (className) {
      html = `<section class="${className}">\n`;
    } else {
      html = '<section>\n';
    }
    
    // Processa o conteúdo interno
    html += formatSectionContent(clone);
    
    // Fecha a tag
    html += '</section>';
    
    return html;
  }

  /**
   * Formata o conteúdo interno de uma seção
   * @param {Element} element - Elemento a ser formatado
   * @param {number} indent - Nível de indentação
   * @returns {string} - HTML formatado
   */
  function formatSectionContent(element, indent = 1) {
    const tab = '  ';
    let html = '';
    
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];
      
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          html += tab.repeat(indent) + escapeHtml(text) + '\n';
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const attrs = getAttributesString(node);
        const hasChildren = node.children.length > 0 || 
                          (node.textContent && node.textContent.trim() && !node.children.length);
        
        if (hasChildren) {
          html += tab.repeat(indent) + `<${tagName}${attrs}>\n`;
          html += formatSectionContent(node, indent + 1);
          html += tab.repeat(indent) + `</${tagName}>\n`;
        } else {
          const text = node.textContent.trim();
          if (text) {
            html += tab.repeat(indent) + `<${tagName}${attrs}>${escapeHtml(text)}</${tagName}>\n`;
          } else {
            html += tab.repeat(indent) + `<${tagName}${attrs}></${tagName}>\n`;
          }
        }
      }
    }
    
    return html;
  }

  /**
   * Obtém string de atributos de um elemento
   * @param {Element} element - Elemento
   * @returns {string} - String de atributos
   */
  function getAttributesString(element) {
    let attrs = '';
    const ignoreAttrs = ['id', 'contenteditable'];
    
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i];
      if (!ignoreAttrs.includes(attr.name)) {
        attrs += ` ${attr.name}="${escapeHtml(attr.value)}"`;
      }
    }
    
    return attrs;
  }

  /**
   * Aplica syntax highlighting ao HTML
   * @param {string} html - HTML a ser destacado
   * @returns {string} - HTML com spans coloridos
   */
  function highlightHTML(html) {
    if (!html) return '';
    
    // Escapa o HTML primeiro
    let highlighted = escapeHtml(html);
    
    // Processa o HTML inteiro de uma vez para melhor controle
    // Destaca comentários HTML primeiro (precisa ser antes das tags)
    highlighted = highlighted.replace(
      /(&lt;!--[\s\S]*?--&gt;)/g,
      '<span class="html-comment">$1</span>'
    );
    
    // Destaca tags HTML com coloração completa
    highlighted = highlighted.replace(
      /(&lt;)(\/?)([\w-]+)([^&]*?)(&gt;)/g,
      function(match, open, slash, tagName, tagContent, close) {
        let processedContent = tagContent;
        
        // Primeiro, destaca atributos com valores entre aspas (simples ou duplas)
        processedContent = processedContent.replace(
          /(\s+)([\w-]+)(\s*=\s*)(["'])([^"']*?)(\4)/g,
          function(attrMatch, space, attrName, equals, quote, attrValue, endQuote) {
            return space + 
                   '<span class="html-attribute">' + attrName + '</span>' +
                   '<span class="html-operator">' + equals + '</span>' +
                   quote +
                   '<span class="html-string">' + attrValue + '</span>' +
                   endQuote;
          }
        );
        
        // Depois, destaca atributos booleanos (sem valor, como checked, disabled, etc.)
        // Processa apenas partes que não contêm spans (não foram processadas)
        processedContent = processedContent.replace(
          /(\s+)([\w-]+)(?=\s|$|&gt;)/g,
          function(attrMatch, space, attrName) {
            // Verifica se já está dentro de um span (atributo com valor já processado)
            if (attrMatch.includes('<span')) {
              return attrMatch;
            }
            return space + '<span class="html-attribute">' + attrName + '</span>';
          }
        );
        
        // Retorna a tag completa com coloração individual
        return '<span class="html-delimiter">' + open + '</span>' + 
               (slash ? '<span class="html-tag-name">' + slash + '</span>' : '') +
               '<span class="html-tag-name">' + tagName + '</span>' + 
               processedContent + 
               '<span class="html-delimiter">' + close + '</span>';
      }
    );
    
    // Destaca texto que não está dentro de spans (texto entre tags)
    // Usa uma abordagem mais cuidadosa para não quebrar spans existentes
    const parts = highlighted.split(/(<span[^>]*>[\s\S]*?<\/span>)/g);
    const processedParts = parts.map(part => {
      // Se já é um span, não processa
      if (part.match(/^<span[^>]*>[\s\S]*?<\/span>$/)) {
        return part;
      }
      
      // Se contém texto, envolve em span de texto
      const trimmed = part.trim();
      if (trimmed) {
        // Preserva espaços/indentação antes e depois
        const beforeMatch = part.match(/^(\s*)/);
        const afterMatch = part.match(/(\s*)$/);
        const before = beforeMatch ? beforeMatch[1] : '';
        const after = afterMatch ? afterMatch[1] : '';
        return before + '<span class="html-text">' + trimmed + '</span>' + after;
      }
      
      return part;
    });
    
    return processedParts.join('');
  }

  /**
   * Atualiza a visualização do código
   */
  function updateCodeView() {
    const codeViewContainer = document.getElementById('codeViewContainer');
    const codeViewContent = document.getElementById('codeViewContent');
    const toggleCheckbox = document.getElementById('togglePreviewCode');
    const editor = document.querySelector('.editor');
    
    if (!codeViewContainer || !codeViewContent || !toggleCheckbox || !editor) return;
    
    if (toggleCheckbox.checked) {
      // Modo código
      const html = getCurrentSectionHTML();
      if (html) {
        // Aplica syntax highlighting
        const highlighted = highlightHTML(html);
        codeViewContent.innerHTML = highlighted;
        
        // Adiciona classe para modo código
        editor.classList.add('code-mode');
        
        // Esconde todas as seções completamente
        const sections = editor.querySelectorAll('section');
        sections.forEach(section => {
          section.style.display = 'none';
          section.style.visibility = 'hidden';
          section.style.opacity = '0';
          section.style.height = '0';
          section.style.overflow = 'hidden';
        });
        
        // Mostra o container de código
        codeViewContainer.style.display = 'block';
        codeViewContainer.style.visibility = 'visible';
        codeViewContainer.style.opacity = '1';
      }
    } else {
      // Modo preview
      editor.classList.remove('code-mode');
      
      // Esconde o container de código
      codeViewContainer.style.display = 'none';
      codeViewContainer.style.visibility = 'hidden';
      codeViewContainer.style.opacity = '0';
      
      // Remove todos os estilos inline das seções
      // para permitir que o CSS controle a exibição
      const sections = editor.querySelectorAll('section');
      sections.forEach(section => {
        section.style.display = '';
        section.style.visibility = '';
        section.style.opacity = '';
        section.style.height = '';
        section.style.overflow = '';
      });
      
      // Força um reflow para garantir que o CSS seja recalculado
      void editor.offsetHeight;
    }
  }

  /**
   * Inicializa o toggle
   */
  function initPreviewToggle() {
    const toggleCheckbox = document.getElementById('togglePreviewCode');
    const header = document.getElementById('header');
    
    if (!toggleCheckbox || !header) return;
    
    // Listener para o toggle
    toggleCheckbox.addEventListener('change', function() {
      updateCodeView();
      updateToggleIcon();
    });
    
    // Listener para mudanças de arquivo
    const fileRadios = header.querySelectorAll('input[type="radio"][name="openedFile"]');
    fileRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (toggleCheckbox.checked) {
          updateCodeView();
        }
      });
    });
    
    // Atualiza o ícone inicial
    updateToggleIcon();
  }

  /**
   * Atualiza o ícone do botão toggle
   */
  function updateToggleIcon() {
    const toggleCheckbox = document.getElementById('togglePreviewCode');
    const toggleLabel = document.querySelector('.preview-toggle-btn');
    
    if (!toggleCheckbox || !toggleLabel) return;
    
    const icon = toggleLabel.querySelector('i');
    if (icon) {
      if (toggleCheckbox.checked) {
        // Modo código - mostra ícone de preview
        icon.className = 'fa-solid fa-eye';
        toggleLabel.title = 'Ver preview';
      } else {
        // Modo preview - mostra ícone de código
        icon.className = 'fa-solid fa-code';
        toggleLabel.title = 'Ver código';
      }
    }
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreviewToggle);
  } else {
    initPreviewToggle();
  }
})();
