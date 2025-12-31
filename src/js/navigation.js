/**
 * Navegação e Menu
 * Gerencia interações do menu lateral
 */

(function() {
  'use strict';

  /**
   * Abre o menu quando explorer ou extensions são clicados
   */
  function initMenuToggle() {
    const explorerView = document.getElementById('explorerView');
    const extensionsView = document.getElementById('extensionsView');
    const menuCheckbox = document.getElementById('menu');

    if (explorerView && menuCheckbox) {
      explorerView.addEventListener('change', function() {
        if (this.checked) {
          menuCheckbox.checked = true;
        }
      });
    }

    if (extensionsView && menuCheckbox) {
      extensionsView.addEventListener('change', function() {
        if (this.checked) {
          menuCheckbox.checked = true;
        }
      });
    }
  }

  /**
   * Fecha os menus de account e config quando clicar fora deles
   */
  function initCloseMenusOnClickOutside() {
    const closeRadio = document.getElementById('close');
    const accountMenu = document.querySelector('.menu-account');
    const settingsMenu = document.querySelector('.menu > div:last-child > div:last-child');
    const accountLabel = document.querySelector('label[for="folderToggleAccounts"]');
    const settingsLabel = document.querySelector('label[for="folderToggleSettings"]');
    const menuContainer = document.querySelector('.menu > div:last-child');

    if (!closeRadio) return;

    document.addEventListener('click', function(event) {
      // Verificar se o clique foi dentro de algum dos menus ou nos labels
      const clickedInsideAccountMenu = accountMenu && accountMenu.contains(event.target);
      const clickedOnAccountLabel = accountLabel && accountLabel.contains(event.target);
      
      const clickedInsideSettingsMenu = settingsMenu && settingsMenu.contains(event.target);
      const clickedOnSettingsLabel = settingsLabel && settingsLabel.contains(event.target);

      // Se o clique foi no label, não fechar (permite abrir o menu)
      if (clickedOnAccountLabel || clickedOnSettingsLabel) {
        return;
      }

      // Se o clique foi fora de ambos os menus, fechar os menus
      if (!clickedInsideAccountMenu && !clickedInsideSettingsMenu) {
        closeRadio.checked = true;
      }
    });
  }

  // Inicializar quando o DOM estiver pronto
  function init() {
    initMenuToggle();
    initCloseMenusOnClickOutside();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
