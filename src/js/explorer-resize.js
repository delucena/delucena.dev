/**
 * Gerenciador de redimensionamento do Explorer/Extensions
 * Permite redimensionar a largura do painel lateral arrastando a borda
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'explorer-width';
  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;
  const DEFAULT_WIDTH = 380;

  /**
   * Inicializa o sistema de resize
   */
  function initResize() {
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupResize);
    } else {
      setupResize();
    }
  }

  /**
   * Configura a barra de resize
   */
  function setupResize() {
    const navigation = document.getElementById('navigation');
    if (!navigation) return;

    // Verifica se já existe uma barra de resize
    let resizeHandle = navigation.querySelector('.explorer-resize-handle');
    
    if (!resizeHandle) {
      // Cria a barra de resize
      resizeHandle = document.createElement('div');
      resizeHandle.className = 'explorer-resize-handle';
      resizeHandle.setAttribute('role', 'separator');
      resizeHandle.setAttribute('aria-label', 'Redimensionar painel lateral');
      resizeHandle.setAttribute('aria-orientation', 'vertical');
      
      // Insere após o explorer/extensions (último elemento dentro de navigation)
      const explorer = navigation.querySelector('.explorer');
      const extensions = navigation.querySelector('.extensions');
      
      // Insere após o último elemento (extensions) dentro de navigation
      if (explorer && extensions) {
        // A barra de resize deve ser o último elemento dentro de #navigation
        navigation.appendChild(resizeHandle);
      }
    }

    // Carrega a largura salva ou usa o padrão
    const savedWidth = localStorage.getItem(STORAGE_KEY);
    const initialWidth = savedWidth ? parseInt(savedWidth, 10) : DEFAULT_WIDTH;
    
    // Aplica a largura inicial
    setExplorerWidth(initialWidth);

    // Configura os event listeners
    setupResizeListeners(resizeHandle);
    
    // Observa mudanças na visibilidade dos painéis
    observePanelVisibility(resizeHandle);
  }
  
  /**
   * Observa mudanças na visibilidade dos painéis para atualizar a barra de resize
   */
  function observePanelVisibility(resizeHandle) {
    // Observa mudanças nos checkboxes que controlam a visibilidade
    const menuCheckbox = document.getElementById('menu');
    const explorerViewRadio = document.getElementById('explorerView');
    const extensionsViewRadio = document.getElementById('extensionsView');
    
    if (menuCheckbox) {
      menuCheckbox.addEventListener('change', () => updateResizeHandleVisibility(resizeHandle));
    }
    
    if (explorerViewRadio) {
      explorerViewRadio.addEventListener('change', () => updateResizeHandleVisibility(resizeHandle));
    }
    
    if (extensionsViewRadio) {
      extensionsViewRadio.addEventListener('change', () => updateResizeHandleVisibility(resizeHandle));
    }
    
    // Atualiza inicialmente
    updateResizeHandleVisibility(resizeHandle);
  }
  
  /**
   * Atualiza a visibilidade da barra de resize baseado no estado dos painéis
   */
  function updateResizeHandleVisibility(resizeHandle) {
    if (!resizeHandle) return;
    
    const isVisible = isPanelVisible();
    if (isVisible) {
      resizeHandle.style.display = 'block';
    } else {
      resizeHandle.style.display = 'none';
    }
  }

  /**
   * Configura os event listeners para o resize
   */
  function setupResizeListeners(resizeHandle) {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    // Mouse down - inicia o resize
    resizeHandle.addEventListener('mousedown', (e) => {
      // Só permite resize se explorer ou extensions estiverem visíveis
      if (!isPanelVisible()) {
        return; // Não permite resize se nenhum painel estiver visível
      }

      isResizing = true;
      startX = e.clientX;
      startWidth = getExplorerWidth();
      
      // Previne seleção de texto durante o drag
      e.preventDefault();
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      // Adiciona classe para indicar que está redimensionando
      document.body.classList.add('resizing');
    });

    // Mouse move - atualiza o tamanho durante o drag
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const diff = e.clientX - startX;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth + diff));
      
      setExplorerWidth(newWidth);
    });

    // Mouse up - finaliza o resize
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.body.classList.remove('resizing');
        
        // Salva a largura no localStorage
        localStorage.setItem(STORAGE_KEY, getExplorerWidth().toString());
      }
    });

    // Previne comportamento padrão em touch devices (opcional)
    resizeHandle.addEventListener('touchstart', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Obtém a largura atual do explorer
   */
  function getExplorerWidth() {
    const explorer = document.querySelector('.explorer');
    if (!explorer) return DEFAULT_WIDTH;
    
    // Tenta obter da CSS custom property primeiro
    const cssWidth = getComputedStyle(document.documentElement).getPropertyValue('--width-navigation').trim();
    if (cssWidth) {
      const numericWidth = parseInt(cssWidth, 10);
      if (!isNaN(numericWidth)) {
        return numericWidth;
      }
    }
    
    // Tenta obter do estilo inline
    const inlineWidth = explorer.style.width;
    if (inlineWidth) {
      const numericWidth = parseInt(inlineWidth, 10);
      if (!isNaN(numericWidth)) {
        return numericWidth;
      }
    }
    
    // Tenta obter do computed style
    const computedWidth = getComputedStyle(explorer).width;
    if (computedWidth && computedWidth !== 'auto') {
      const numericWidth = parseInt(computedWidth, 10);
      if (!isNaN(numericWidth)) {
        return numericWidth;
      }
    }
    
    return DEFAULT_WIDTH;
  }
  
  /**
   * Verifica se explorer ou extensions estão visíveis
   */
  function isPanelVisible() {
    const explorer = document.querySelector('.explorer');
    const extensions = document.querySelector('.extensions');
    
    if (!explorer || !extensions) return false;
    
    const explorerStyle = window.getComputedStyle(explorer);
    const extensionsStyle = window.getComputedStyle(extensions);
    
    const explorerVisible = explorerStyle.opacity !== '0' && 
                           explorerStyle.marginLeft !== `-${getExplorerWidth()}px` &&
                           explorerStyle.pointerEvents !== 'none';
    
    const extensionsVisible = extensionsStyle.opacity !== '0' && 
                             extensionsStyle.marginLeft !== `-${getExplorerWidth()}px` &&
                             extensionsStyle.pointerEvents !== 'none';
    
    return explorerVisible || extensionsVisible;
  }

  /**
   * Define a largura do explorer/extensions
   */
  function setExplorerWidth(width) {
    const explorer = document.querySelector('.explorer');
    const extensions = document.querySelector('.extensions');
    const navigation = document.getElementById('navigation');
    
    if (!explorer || !extensions || !navigation) return;

    // Define a largura via CSS custom property
    document.documentElement.style.setProperty('--width-navigation', `${width}px`);
    
    // Também define diretamente nos elementos para garantir
    explorer.style.width = `${width}px`;
    explorer.style.minWidth = `${width}px`;
    explorer.style.maxWidth = `${width}px`;
    
    extensions.style.width = `${width}px`;
    extensions.style.minWidth = `${width}px`;
    extensions.style.maxWidth = `${width}px`;
  }

  // Inicializa quando o script é carregado
  initResize();
})();
