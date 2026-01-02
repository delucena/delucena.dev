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
   * Inicializa o toggle do terminal
   */
  function initToggle() {
    try {
      const toggle = document.querySelector('#terminalToggle');
      if (toggle) {
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
    } catch (error) {
      console.error('Erro ao inicializar TerminalCore:', error);
    }
  }

  // Auto-inicialização
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
