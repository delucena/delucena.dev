/**
 * Preview Toggle - Alterna entre visualização e código
 * Gerencia a alternância entre preview (renderizado) e código (HTML formatado)
 * 
 * REFATORADO: Estado central + renderização única
 */

(function() {
  'use strict';

  // ============================================
  // ESTADO CENTRAL
  // ============================================
  const state = {
    currentPage: null,      // ID da página atual (ex: 'index', 'skills', 'contact')
    currentViewMode: 'page' // 'page' | 'code'
  };

  // Mapeamento de IDs de arquivo para classes de seção
  const fileSectionMap = {
    'readme': '.readme',
    'index': '.index',
    'experience': '.experience',
    'skills': '.skills',
    'contact': '.contact'
  };

  // ============================================
  // FUNÇÃO ÚNICA: GET ACTIVE TAB ELEMENT
  // ============================================
  // REGRA ABSOLUTA: A aba ativa no DOM é a ÚNICA fonte da verdade
  // Nenhuma variável global ou cache pode decidir qual código exibir.

  /**
   * Obtém o elemento da aba ativa (SEMPRE busca do DOM)
   * Garante que existe APENAS UMA aba ativa por vez
   * @returns {HTMLElement|null} Elemento da aba ativa ou null
   */
  function getActiveTabEl() {
    const header = document.getElementById('header');
    if (!header) {
      return null;
    }
    
    // SEMPRE busca a aba ativa do DOM usando o radio checked
    const checkedRadio = header.querySelector('input[type="radio"][name="openedFile"]:checked');
    if (!checkedRadio) {
      return null;
    }
    
    const activeTab = checkedRadio.closest('.editor-tab');
    if (!activeTab) {
      return null;
    }
    
    // Verifica se há múltiplas abas marcadas como ativas (corrige se necessário)
    const allCheckedRadios = header.querySelectorAll('input[type="radio"][name="openedFile"]:checked');
    if (allCheckedRadios.length > 1) {
      // Mantém apenas a primeira como checked
      for (let i = 1; i < allCheckedRadios.length; i++) {
        allCheckedRadios[i].checked = false;
        const tab = allCheckedRadios[i].closest('.editor-tab');
        if (tab) {
          tab.classList.remove('is-active');
        }
      }
    }
    
    // Verifica se a classe is-active está sincronizada
    const allActiveTabs = header.querySelectorAll('.editor-tab.is-active');
    if (allActiveTabs.length > 1) {
      allActiveTabs.forEach(tab => {
        if (tab !== activeTab) {
          tab.classList.remove('is-active');
        }
      });
    }
    
    // Garante que a aba ativa tem a classe is-active
    if (!activeTab.classList.contains('is-active')) {
      activeTab.classList.add('is-active');
    }
    
    return activeTab;
  }

  /**
   * Obtém o file path da aba ativa (SEMPRE busca do DOM)
   * Esta é a ÚNICA função permitida para determinar qual arquivo exibir
   * @returns {string|null} ID do arquivo (ex: 'index', 'skills') ou null
   */
  function getActiveTabFilePath() {
    const activeTab = getActiveTabEl();
    if (!activeTab) {
      return null;
    }
    
    const fileId = activeTab.getAttribute('data-file-id');
    if (!fileId) {
      return null;
    }
    
    return fileId;
  }

  // ============================================
  // FUNÇÃO DE SINCRONIZAÇÃO DO EDITOR
  // ============================================

  /**
   * Sincroniza o editor (code view/preview) com a aba ativa
   * Esta função é chamada sempre que a aba ativa muda
   * SEMPRE usa getActiveTabEl() como fonte da verdade
   */
  function syncEditorWithActiveTab() {
    const activeTab = getActiveTabEl();
    if (!activeTab) {
      return;
    }
    
    const fileId = activeTab.getAttribute('data-file-id');
    
    if (!fileId) {
      return;
    }
    
    // Atualiza o estado da página atual
    state.currentPage = fileId;
    
    // Atualiza a visualização baseado no modo atual
    if (state.currentViewMode === 'code') {
      renderCodeView();
    } else {
      renderPageView(fileId);
    }
  }

  // ============================================
  // FUNÇÕES DE ESTADO
  // ============================================

  /**
   * Define o modo de visualização
   * @param {string} mode - 'page' | 'code'
   */
  function setViewMode(mode) {
    if (state.currentViewMode === mode) return;
    if (mode !== 'page' && mode !== 'code') {
      return;
    }
    
    state.currentViewMode = mode;
    
    // SEMPRE sincroniza com a aba ativa quando o modo muda
    syncEditorWithActiveTab();
  }

  /**
   * Obtém a página atualmente selecionada
   * @returns {string|null} ID da página ou null
   */
  function getCurrentPage() {
    return getActiveTabFilePath();
  }

  // ============================================
  // FUNÇÕES DE RENDERIZAÇÃO
  // ============================================

  /**
   * Renderiza a visualização (página ou código)
   * @param {string} pageId - ID da página
   * @param {string} mode - 'page' | 'code'
   */
  function renderView(pageId, mode) {
    if (mode === 'code') {
      // SEMPRE renderiza da aba ativa (DOM), não do pageId passado
      renderCodeView();
    } else {
      if (!pageId) {
        return;
      }
      renderPageView(pageId);
    }
  }

  /**
   * Renderiza o modo página (preview)
   * @param {string} pageId - ID da página
   */
  function renderPageView(pageId) {
    const codeViewContainer = document.getElementById('codeViewContainer');
    const editor = document.querySelector('.editor');
    
    if (!editor) return;
    
    // Remove classe de modo código
    editor.classList.remove('code-mode');
    
    // Esconde o container de código
    if (codeViewContainer) {
      codeViewContainer.style.display = 'none';
      codeViewContainer.style.visibility = 'hidden';
      codeViewContainer.style.opacity = '0';
    }
    
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

  /**
   * Renderiza o modo código
   * REGRA ABSOLUTA: SEMPRE busca a aba ativa do DOM
   * PROIBIDO: aceitar parâmetros, usar variáveis globais, cache
   */
  function renderCodeView() {
    // SEMPRE busca a aba ativa do DOM (única fonte da verdade)
    const fileId = getActiveTabFilePath();
    if (!fileId) {
      return;
    }
    
    const codeViewContainer = document.getElementById('codeViewContainer');
    const codeViewContent = document.getElementById('codeViewContent');
    const editor = document.querySelector('.editor');
    
    if (!codeViewContainer || !codeViewContent || !editor) {
      return;
    }
    
    // Remove estilos inline das seções para permitir que o CSS atualize
    const sections = editor.querySelectorAll('section');
    sections.forEach(section => {
      section.style.display = '';
      section.style.visibility = '';
      section.style.opacity = '';
      section.style.height = '';
      section.style.overflow = '';
    });
    
    // Força reflow para o CSS atualizar qual seção está visível
    void editor.offsetHeight;
    void document.body.offsetHeight;
    
    // Aguarda o CSS atualizar e então captura o HTML
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          // Obtém o HTML da seção da aba ativa (SEMPRE do DOM)
          const html = getSectionHTML(fileId);
          
          if (!html) {
            // Limpa o código se não houver HTML
            codeViewContent.innerHTML = '';
            codeViewContent.textContent = '';
            return;
          }
          
          // Adiciona classe para modo código
          editor.classList.add('code-mode');
          
          // Esconde todas as seções
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
          
          // Aplica syntax highlighting
          if (isHighlighterAvailable()) {
            const highlighted = highlightHTML(html);
            codeViewContent.innerHTML = highlighted;
          } else {
            // Aguarda o CodeHighlighter estar disponível
            setTimeout(() => {
              if (isHighlighterAvailable()) {
                const highlighted = highlightHTML(html);
                codeViewContent.innerHTML = highlighted;
              } else {
                // Fallback: HTML escapado sem highlighting
                codeViewContent.textContent = html;
              }
            }, 100);
          }
        }, 100);
      });
    });
  }

  /**
   * Obtém o HTML de uma seção específica
   * @param {string} pageId - ID da página
   * @returns {string} HTML formatado
   */
  function getSectionHTML(pageId) {
    const editor = document.querySelector('.editor');
    if (!editor) return '';
    
    const sectionSelector = fileSectionMap[pageId];
    if (!sectionSelector) {
      return '';
    }
    
    const section = editor.querySelector(sectionSelector);
    if (!section) {
      return '';
    }
    
    // Clona a seção para não modificar o original
    const clone = section.cloneNode(true);
    
    // Remove atributos desnecessários
    clone.removeAttribute('id');
    clone.removeAttribute('contenteditable');
    
    // Mantém a classe para contexto
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

  // ============================================
  // FUNÇÕES AUXILIARES (mantidas do código original)
  // ============================================

  /**
   * Formata HTML de forma limpa e legível
   */
  function formatHTML(html) {
    if (!html) return '';
    
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                             'link', 'meta', 'param', 'source', 'track', 'wbr'];
    
    html = html.trim();
    
    let i = 0;
    let inTag = false;
    let tagBuffer = '';
    let textBuffer = '';
    
    while (i < html.length) {
      const char = html[i];
      
      if (char === '<') {
        if (textBuffer.trim()) {
          formatted += tab.repeat(indent) + escapeHtml(textBuffer.trim()) + '\n';
          textBuffer = '';
        }
        
        inTag = true;
        tagBuffer = '<';
        i++;
        
        while (i < html.length && html[i] !== '>') {
          tagBuffer += html[i];
          i++;
        }
        
        if (i < html.length) {
          tagBuffer += '>';
          i++;
        }
        
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
    
    if (textBuffer.trim()) {
      formatted += tab.repeat(indent) + escapeHtml(textBuffer.trim()) + '\n';
    }
    
    return formatted.trim();
  }

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

  function isHighlighterAvailable() {
    return typeof window.CodeHighlighter !== 'undefined' && 
           typeof window.CodeHighlighter.highlightHTML === 'function';
  }

  function highlightHTML(html) {
    if (!html) return '';
    
    if (isHighlighterAvailable()) {
      return window.CodeHighlighter.highlightHTML(html);
    }
    
    return escapeHtml(html);
  }

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
   * Atualiza o ícone do botão toggle
   */
  function updateToggleIcon() {
    const toggleCheckbox = document.getElementById('togglePreviewCode');
    const toggleLabel = document.querySelector('.preview-toggle-btn');
    
    if (!toggleCheckbox || !toggleLabel) return;
    
    const svg = toggleLabel.querySelector('svg');
    const icon = toggleLabel.querySelector('svg use');
    
    if (svg && icon) {
      if (toggleCheckbox.checked) {
        // Modo código - mostra ícone de preview (olho)
        icon.setAttribute('href', '#icon-eye');
        svg.setAttribute('viewBox', '0 0 24 24');
        toggleLabel.title = 'Ver preview';
      } else {
        // Modo preview - mostra ícone de código
        icon.setAttribute('href', '#icon-code');
        svg.setAttribute('viewBox', '0 0 490 490');
        toggleLabel.title = 'Ver código';
      }
    }
  }

  // ============================================
  // INICIALIZAÇÃO
  // ============================================

  /**
   * Inicializa o sistema de toggle
   */
  function initPreviewToggle() {
    const toggleCheckbox = document.getElementById('togglePreviewCode');
    const header = document.getElementById('header');
    
    if (!toggleCheckbox || !header) return;
    
    // Sincroniza o estado inicial
    const initialPage = getCurrentPage();
    if (initialPage) {
      state.currentPage = initialPage;
    }
    state.currentViewMode = toggleCheckbox.checked ? 'code' : 'page';
    
    // Listener para o toggle
    toggleCheckbox.addEventListener('change', function() {
      const newMode = this.checked ? 'code' : 'page';
      setViewMode(newMode);
      updateToggleIcon();
    });
    
    // Listener para mudanças de página (evento change) - como redundância
    const fileRadios = header.querySelectorAll('input[type="radio"][name="openedFile"]');
    fileRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          // Aguarda um pouco para garantir que o DOM atualizou
          setTimeout(() => {
            syncEditorWithActiveTab();
          }, 10);
        }
      });
    });
    
    // ============================================
    // MUTATION OBSERVER ROBUSTO
    // ============================================
    // Observa mudanças no container de tabs para detectar mudanças na aba ativa
    // Detecta mudanças em:
    // - atributo 'checked' dos radio buttons
    // - classe 'is-active' das tabs
    // - adição/remoção de tabs
    
    let syncTimeout = null;
    const debouncedSync = function() {
      if (syncTimeout) {
        clearTimeout(syncTimeout);
      }
      syncTimeout = setTimeout(() => {
        syncEditorWithActiveTab();
      }, 10);
    };
    
    // Observer para mudanças nos radio buttons (checked)
    const radioObserver = new MutationObserver(function(mutations) {
      let shouldSync = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'checked') {
          const radio = mutation.target;
          if (radio.type === 'radio' && radio.name === 'openedFile') {
            if (radio.checked) {
              shouldSync = true;
            }
          }
        }
      });
      
      if (shouldSync) {
        debouncedSync();
      }
    });
    
    // Observer para mudanças nas classes das tabs (is-active)
    const tabClassObserver = new MutationObserver(function(mutations) {
      let shouldSync = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const tab = mutation.target;
          if (tab.classList.contains('editor-tab')) {
            // Verifica se a classe is-active foi adicionada ou removida
            if (tab.classList.contains('is-active')) {
              shouldSync = true;
            }
          }
        }
      });
      
      if (shouldSync) {
        debouncedSync();
      }
    });
    
    // Observa todos os radio buttons existentes e futuros
    const observeRadios = function() {
      const radios = header.querySelectorAll('input[type="radio"][name="openedFile"]');
      radios.forEach(function(radio) {
        if (!radio.dataset.previewToggleObserved) {
          radioObserver.observe(radio, { 
            attributes: true, 
            attributeFilter: ['checked'] 
          });
          radio.dataset.previewToggleObserved = 'true';
        }
      });
    };
    
    // Observa todas as tabs existentes e futuras (para classe is-active)
    const observeTabs = function() {
      const tabs = header.querySelectorAll('.editor-tab');
      tabs.forEach(function(tab) {
        if (!tab.dataset.previewToggleObserved) {
          tabClassObserver.observe(tab, { 
            attributes: true, 
            attributeFilter: ['class'] 
          });
          tab.dataset.previewToggleObserved = 'true';
        }
      });
    };
    
    // Observa mudanças no DOM para novos radios e tabs (abas recriadas)
    const domObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Observa novos radios
              const newRadios = node.querySelectorAll ? node.querySelectorAll('input[type="radio"][name="openedFile"]') : [];
              newRadios.forEach(function(radio) {
                if (!radio.dataset.previewToggleObserved) {
                  radioObserver.observe(radio, { 
                    attributes: true, 
                    attributeFilter: ['checked'] 
                  });
                  radio.dataset.previewToggleObserved = 'true';
                  
                  // Adiciona listener 'change' como redundância
                  if (!radio.dataset.previewToggleListener) {
                    radio.dataset.previewToggleListener = 'true';
                    radio.addEventListener('change', function() {
                      if (this.checked) {
                        setTimeout(() => {
                          syncEditorWithActiveTab();
                        }, 10);
                      }
                    });
                  }
                }
              });
              
              // Observa novas tabs
              const newTabs = node.classList && node.classList.contains('editor-tab') 
                ? [node] 
                : (node.querySelectorAll ? node.querySelectorAll('.editor-tab') : []);
              newTabs.forEach(function(tab) {
                if (!tab.dataset.previewToggleObserved) {
                  tabClassObserver.observe(tab, { 
                    attributes: true, 
                    attributeFilter: ['class'] 
                  });
                  tab.dataset.previewToggleObserved = 'true';
                }
              });
            }
          });
        }
      });
    });
    
    // Inicializa observadores
    observeRadios();
    observeTabs();
    
    // Observa mudanças no DOM (novos elementos)
    domObserver.observe(header, { 
      childList: true, 
      subtree: true 
    });
    
    // Sincroniza inicialmente
    setTimeout(() => {
      syncEditorWithActiveTab();
    }, 100);
    
    // Atualiza o ícone inicial
    updateToggleIcon();
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreviewToggle);
  } else {
    initPreviewToggle();
  }
})();
