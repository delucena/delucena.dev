/**
 * Terminal Core
 * Lógica base do terminal: tabs, toggle e sistema de registro de abas
 * 
 * @module terminal-core
 * @description Gerencia abas do terminal, toggle e sistema de registro para extensibilidade
 */

(function() {
  'use strict';

  // Namespace global para o Terminal Core
  window.TerminalCore = window.TerminalCore || {};

  // Registro de abas
  const registeredTabs = {};

  /**
   * Registra uma nova aba no terminal
   * @param {string} id - ID único da aba
   * @param {Object} config - Configuração da aba
   * @param {string} config.label - Label da aba
   * @param {string} config.icon - Classe do ícone Font Awesome
   * @param {Function} [config.init] - Função de inicialização
   */
  TerminalCore.registerTab = function(id, config) {
    try {
      if (!id || !config) {
        console.warn('TerminalCore.registerTab: id e config são obrigatórios');
        return;
      }

      registeredTabs[id] = {
        id: id,
        label: config.label || id.toUpperCase(),
        icon: config.icon || 'fa-solid fa-terminal',
        init: config.init || null
      };

      // Se a aba já existe no HTML, inicializa
      const radio = document.querySelector(`#${id}`);
      if (radio && config.init) {
        radio.addEventListener('change', function() {
          if (this.checked && typeof config.init === 'function') {
            setTimeout(config.init, 100);
          }
        });
      }
    } catch (error) {
      console.error('Erro ao registrar aba:', error);
    }
  };

  /**
   * Obtém todas as abas registradas
   * @returns {Object} Objeto com todas as abas registradas
   */
  TerminalCore.getRegisteredTabs = function() {
    return { ...registeredTabs };
  };

  /**
   * Inicializa o sistema de tabs
   */
  function initTabs() {
    try {
      const allTerminalRadios = document.querySelectorAll('.terminal > input[type="radio"]');
      allTerminalRadios.forEach(radio => {
        radio.addEventListener('change', function() {
          try {
            // Notifica abas registradas sobre mudança
            const tab = registeredTabs[this.id];
            if (tab && tab.init && this.checked) {
              setTimeout(tab.init, 100);
            }
          } catch (error) {
            console.error('Erro ao processar mudança de aba:', error);
          }
        });
      });
    } catch (error) {
      console.error('Erro ao inicializar tabs:', error);
    }
  }

  /**
   * Obtém a altura do terminal (pode ser do localStorage ou padrão)
   */
  function getTerminalHeight() {
    const STORAGE_KEY = 'terminal-height';
    const DEFAULT_HEIGHT = 250;
    
    // Tenta obter do localStorage primeiro
    const savedHeight = localStorage.getItem(STORAGE_KEY);
    if (savedHeight) {
      const height = parseInt(savedHeight, 10);
      if (!isNaN(height) && height > 0) {
        return height;
      }
    }
    
    // Tenta obter da CSS custom property
    const cssHeight = getComputedStyle(document.documentElement).getPropertyValue('--height-terminal').trim();
    if (cssHeight) {
      const height = parseInt(cssHeight, 10);
      if (!isNaN(height) && height > 0) {
        return height;
      }
    }
    
    return DEFAULT_HEIGHT;
  }

  /**
   * Obtém a altura disponível do editor
   */
  function getEditorHeight() {
    const editor = document.querySelector('#editor');
    if (!editor) return 0;
    
    const editorRect = editor.getBoundingClientRect();
    const header = document.querySelector('#header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Altura do editor menos o header
    return editorRect.height - headerHeight;
  }

  /**
   * Verifica se é mobile em landscape
   */
  function isMobileLandscape() {
    // Mobile landscape: largura <= 1024px, altura <= 600px e orientação landscape
    return window.innerWidth <= 1024 && 
           window.innerHeight <= 600 && 
           window.innerWidth > window.innerHeight;
  }

  /**
   * Verifica se deve minimizar o terminal automaticamente
   * Minimiza quando o terminal ocuparia mais de 40% do editor
   * OU quando está em mobile landscape (sempre minimiza)
   */
  function shouldAutoMinimize() {
    // Em mobile landscape, sempre minimiza
    if (isMobileLandscape()) {
      return true;
    }
    
    const terminalHeight = getTerminalHeight();
    const editorHeight = getEditorHeight();
    
    // Se não conseguir obter as alturas, não minimiza
    if (terminalHeight <= 0 || editorHeight <= 0) {
      return false;
    }
    
    // Calcula a porcentagem que o terminal ocuparia do editor
    const percentage = (terminalHeight / editorHeight) * 100;
    
    // Minimiza se ocupar mais de 40% do editor
    return percentage > 40;
  }

  /**
   * Ajusta o estado do terminal baseado no tamanho da tela e editor
   */
  function adjustTerminalForScreenSize() {
    const toggle = document.querySelector('#terminalToggle');
    if (!toggle) return;

    // Pequeno delay para garantir que o DOM esteja totalmente renderizado
    setTimeout(() => {
      if (shouldAutoMinimize()) {
        // Minimiza o terminal se ocupar mais de 40% do editor
        toggle.checked = true;
      } else {
        // Maximiza o terminal se ocupar menos de 40% do editor
        toggle.checked = false;
      }
    }, 100);
  }

  /**
   * Inicializa o toggle do terminal
   */
  function initToggle() {
    try {
      const toggle = document.querySelector('#terminalToggle');
      if (toggle) {
        // Ajusta o estado inicial baseado no tamanho da tela
        adjustTerminalForScreenSize();

        // Ajusta quando a tela é redimensionada (com debounce para performance)
        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            adjustTerminalForScreenSize();
          }, 150);
        });

        // Ajusta quando a orientação muda (especialmente importante para mobile)
        window.addEventListener('orientationchange', () => {
          // Aguarda a orientação ser aplicada
          setTimeout(() => {
            adjustTerminalForScreenSize();
          }, 200);
        });

        // Toggle já funciona via CSS, apenas garante que está funcionando
        toggle.addEventListener('change', function() {
          // Pode adicionar lógica adicional aqui se necessário
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar toggle:', error);
    }
  }

  /**
   * Inicializa o módulo
   */
  function init() {
    try {
      initTabs();
      initToggle();
      
      // Ajusta o terminal após um pequeno delay para garantir que o layout esteja calculado
      // Delay maior para mobile landscape para garantir que o layout esteja totalmente renderizado
      const delay = isMobileLandscape() ? 300 : 200;
      setTimeout(() => {
        adjustTerminalForScreenSize();
      }, delay);
    } catch (error) {
      console.error('Erro ao inicializar TerminalCore:', error);
    }
  }

  // Auto-inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      // Ajusta novamente após o window load para garantir que tudo esteja renderizado
      window.addEventListener('load', () => {
        const delay = isMobileLandscape() ? 300 : 100;
        setTimeout(() => {
          adjustTerminalForScreenSize();
        }, delay);
      });
    });
  } else {
    init();
    // Se já está carregado, ajusta após um pequeno delay
    if (document.readyState === 'complete') {
      const delay = isMobileLandscape() ? 300 : 100;
      setTimeout(() => {
        adjustTerminalForScreenSize();
      }, delay);
    }
  }
})();
