/**
 * Gerenciamento de Tema
 * Atualiza o label do tema quando o checkbox muda
 */

(function() {
  'use strict';

  const themeCheckbox = document.getElementById('theme');
  const themeLabel = document.getElementById('themeLabel');
  
  if (themeCheckbox && themeLabel) {
    /**
     * Atualiza o label do tema baseado no estado do checkbox
     */
    function updateThemeLabel() {
      themeLabel.textContent = themeCheckbox.checked ? 'Light' : 'Dark';
    }
    
    // Atualizar quando o checkbox mudar
    themeCheckbox.addEventListener('change', updateThemeLabel);
    
    // Atualizar inicialmente
    updateThemeLabel();
  }
})();
