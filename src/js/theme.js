/**
 * Gerenciamento de Tema
 * Atualiza o label do tema quando o checkbox muda
 * 
 * @module theme
 * @description Gerencia a alternância entre tema dark e light
 */

(function() {
  'use strict';

  const SELECTORS = {
    themeCheckbox: '#theme',
    themeLabel: '#themeLabel'
  };

  let themeCheckbox;
  let themeLabel;

  /**
   * Inicializa os elementos do DOM
   * @returns {boolean} - true se os elementos foram encontrados
   */
  function initElements() {
    try {
      themeCheckbox = document.querySelector(SELECTORS.themeCheckbox);
      themeLabel = document.querySelector(SELECTORS.themeLabel);
      return !!(themeCheckbox && themeLabel);
    } catch (error) {
      console.error('Erro ao inicializar elementos do tema:', error);
      return false;
    }
  }

  /**
   * Atualiza o label do tema baseado no estado do checkbox
   * @throws {Error} Se os elementos não estiverem disponíveis
   */
  function updateThemeLabel() {
    if (!themeCheckbox || !themeLabel) {
      throw new Error('Elementos do tema não encontrados');
    }
    
    try {
      themeLabel.textContent = themeCheckbox.checked ? 'Tema: Light' : 'Tema: Dark';
    } catch (error) {
      console.error('Erro ao atualizar label do tema:', error);
    }
  }

  /**
   * Inicializa o gerenciamento de tema
   */
  function init() {
    if (!initElements()) {
      return;
    }

    try {
      // Atualizar quando o checkbox mudar
      themeCheckbox.addEventListener('change', updateThemeLabel);
      
      // Atualizar inicialmente
      updateThemeLabel();
    } catch (error) {
      console.error('Erro ao inicializar gerenciamento de tema:', error);
    }
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
