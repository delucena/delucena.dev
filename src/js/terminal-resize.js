/**
 * Gerenciador de redimensionamento do Terminal
 * Permite redimensionar a altura do terminal arrastando a borda superior
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'terminal-height';
  const MIN_HEIGHT = 150;
  const MAX_HEIGHT = 600;
  const DEFAULT_HEIGHT = 250;

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
   * Verifica se é mobile
   */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  /**
   * Configura a barra de resize
   */
  function setupResize() {
    // Não inicializa no mobile
    if (isMobile()) {
      return;
    }
    
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;

    // Verifica se já existe uma barra de resize
    let resizeHandle = terminal.querySelector('.terminal-resize-handle');
    
    if (!resizeHandle) {
      // Cria a barra de resize
      resizeHandle = document.createElement('div');
      resizeHandle.className = 'terminal-resize-handle';
      resizeHandle.setAttribute('role', 'separator');
      resizeHandle.setAttribute('aria-label', 'Redimensionar terminal');
      resizeHandle.setAttribute('aria-orientation', 'horizontal');
      
      // Insere após os inputs radio, mas antes do header
      // Procura o primeiro elemento que não é input (provavelmente o header)
      let insertBefore = null;
      let node = terminal.firstChild;
      
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE && 
            node.tagName === 'INPUT' && 
            node.type === 'radio') {
          // Continua procurando
          node = node.nextSibling;
        } else {
          // Encontrou o primeiro elemento que não é input radio
          insertBefore = node;
          break;
        }
      }
      
      // Se encontrou onde inserir, insere antes desse elemento
      // Caso contrário, insere no final
      if (insertBefore) {
        terminal.insertBefore(resizeHandle, insertBefore);
      } else {
        terminal.appendChild(resizeHandle);
      }
    }

    // Carrega a altura salva ou usa o padrão
    const savedHeight = localStorage.getItem(STORAGE_KEY);
    const initialHeight = savedHeight ? parseInt(savedHeight, 10) : DEFAULT_HEIGHT;
    
    // Aplica a altura inicial
    setTerminalHeight(initialHeight);

    // Configura os event listeners
    setupResizeListeners(resizeHandle);
    
    // Observa mudanças na visibilidade do terminal
    observeTerminalVisibility(resizeHandle);
  }

  /**
   * Configura os event listeners para o resize
   */
  function setupResizeListeners(resizeHandle) {
    let isResizing = false;
    let startY = 0;
    let startHeight = 0;

    // Mouse down - inicia o resize
    resizeHandle.addEventListener('mousedown', (e) => {
      // Só permite resize se terminal estiver visível
      if (!isTerminalVisible()) {
        return;
      }

      isResizing = true;
      startY = e.clientY;
      startHeight = getTerminalHeight();
      
      // Previne seleção de texto durante o drag
      e.preventDefault();
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      
      // Adiciona classe para indicar que está redimensionando
      document.body.classList.add('resizing-terminal');
    });

    // Mouse move - atualiza o tamanho durante o drag
    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      // Para resize vertical, calculamos a diferença em Y
      // Movendo o mouse para cima (Y menor) aumenta a altura
      // Movendo o mouse para baixo (Y maior) diminui a altura
      const diff = startY - e.clientY; // Invertido porque queremos aumentar quando puxamos para cima
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeight + diff));
      
      setTerminalHeight(newHeight);
    });

    // Mouse up - finaliza o resize
    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.body.classList.remove('resizing-terminal');
        
        // Salva a altura no localStorage
        localStorage.setItem(STORAGE_KEY, getTerminalHeight().toString());
      }
    });

    // Previne comportamento padrão em touch devices (opcional)
    resizeHandle.addEventListener('touchstart', (e) => {
      e.preventDefault();
    });
  }

  /**
   * Verifica se o terminal está visível
   */
  function isTerminalVisible() {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return false;
    
    const style = window.getComputedStyle(terminal);
    // Verifica se não está escondido pelo toggle
    // O terminal pode estar escondido com margin-bottom negativo
    const marginBottom = parseInt(style.marginBottom, 10);
    const isHidden = terminal.classList.contains('collapsed') || 
                     style.display === 'none' ||
                     style.visibility === 'hidden' ||
                     marginBottom < -100; // Se margin-bottom for muito negativo, está escondido
    
    return !isHidden;
  }
  
  /**
   * Observa mudanças na visibilidade do terminal para atualizar a barra de resize
   */
  function observeTerminalVisibility(resizeHandle) {
    // Observa mudanças no checkbox que controla a visibilidade do terminal
    const terminalToggle = document.getElementById('terminalToggle');
    
    if (terminalToggle) {
      terminalToggle.addEventListener('change', () => {
        // Pequeno delay para permitir que o CSS seja aplicado
        setTimeout(() => {
          updateResizeHandleVisibility(resizeHandle);
        }, 10);
      });
    }
    
    // Atualiza inicialmente
    updateResizeHandleVisibility(resizeHandle);
  }
  
  /**
   * Atualiza a visibilidade da barra de resize baseado no estado do terminal
   */
  function updateResizeHandleVisibility(resizeHandle) {
    if (!resizeHandle) return;
    
    const isVisible = isTerminalVisible();
    if (isVisible) {
      resizeHandle.style.display = 'block';
    } else {
      resizeHandle.style.display = 'none';
    }
  }

  /**
   * Obtém a altura atual do terminal
   */
  function getTerminalHeight() {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return DEFAULT_HEIGHT;
    
    // Tenta obter da CSS custom property primeiro
    const cssHeight = getComputedStyle(document.documentElement).getPropertyValue('--height-terminal').trim();
    if (cssHeight) {
      const numericHeight = parseInt(cssHeight, 10);
      if (!isNaN(numericHeight)) {
        return numericHeight;
      }
    }
    
    // Tenta obter do estilo inline
    const inlineHeight = terminal.style.height;
    if (inlineHeight) {
      const numericHeight = parseInt(inlineHeight, 10);
      if (!isNaN(numericHeight)) {
        return numericHeight;
      }
    }
    
    // Tenta obter do computed style
    const computedHeight = getComputedStyle(terminal).height;
    if (computedHeight && computedHeight !== 'auto') {
      const numericHeight = parseInt(computedHeight, 10);
      if (!isNaN(numericHeight)) {
        return numericHeight;
      }
    }
    
    return DEFAULT_HEIGHT;
  }

  /**
   * Define a altura do terminal
   */
  function setTerminalHeight(height) {
    // Não aplica estilos no mobile
    if (isMobile()) {
      return;
    }
    
    const terminal = document.querySelector('.terminal');
    
    if (!terminal) return;

    // Define a altura via CSS custom property
    document.documentElement.style.setProperty('--height-terminal', `${height}px`);
    
    // Também define diretamente no elemento para garantir
    terminal.style.height = `${height}px`;
    terminal.style.minHeight = `${height}px`;
    terminal.style.maxHeight = `${height}px`;
  }

  // Inicializa quando o script é carregado
  initResize();
})();
