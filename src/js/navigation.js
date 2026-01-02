(function() {
  'use strict';

  const MOBILE_BREAKPOINT = 768;
  const MENU_CLOSE_DELAY = 100;

  const SELECTORS = {
    menu: '#menu',
    explorerView: '#explorerView',
    extensionsView: '#extensionsView',
    closeRadio: '#close',
    explorerLabel: 'label[for="explorerView"]',
    extensionsLabel: 'label[for="extensionsView"]',
    accountMenu: '.menu-account',
    settingsMenu: '.menu > div:last-child > div:last-child',
    accountLabel: 'label[for="folderToggleAccounts"]',
    settingsLabel: 'label[for="folderToggleSettings"]',
    mobileExplorerItems: '.mobile-explorer-list label',
    extensionItems: '.extensions .extension-item',
    navigation: '#navigation'
  };

  const elements = {};

  function getElements() {
    elements.menu = document.querySelector(SELECTORS.menu);
    elements.explorerView = document.querySelector(SELECTORS.explorerView);
    elements.extensionsView = document.querySelector(SELECTORS.extensionsView);
    elements.closeRadio = document.querySelector(SELECTORS.closeRadio);
    elements.explorerLabel = document.querySelector(SELECTORS.explorerLabel);
    elements.extensionsLabel = document.querySelector(SELECTORS.extensionsLabel);
    elements.accountMenu = document.querySelector(SELECTORS.accountMenu);
    elements.settingsMenu = document.querySelector(SELECTORS.settingsMenu);
    elements.accountLabel = document.querySelector(SELECTORS.accountLabel);
    elements.settingsLabel = document.querySelector(SELECTORS.settingsLabel);
    elements.accountRadio = document.querySelector('#folderToggleAccounts');
    elements.settingsRadio = document.querySelector('#folderToggleSettings');
  }

  function isMobile() {
    // Considera mobile se largura <= 768px OU se for landscape com altura <= 600px
    return window.innerWidth <= MOBILE_BREAKPOINT || 
           (window.innerWidth <= 1024 && window.innerHeight <= 600);
  }

  function openMenuIfNeeded() {
    if (elements.menu && (elements.explorerView?.checked || elements.extensionsView?.checked)) {
      elements.menu.checked = true;
    }
  }

  function initDesktopMenuToggle() {
    if (!elements.explorerView || !elements.extensionsView || !elements.menu) return;

    elements.explorerView.addEventListener('change', openMenuIfNeeded);
    elements.extensionsView.addEventListener('change', openMenuIfNeeded);
  }

  function toggleExplorerView(event) {
    if (!isMobile() || !elements.explorerView) return;

    if (elements.explorerView.checked) {
      event.preventDefault();
      elements.explorerView.checked = false;
      return false;
    }

    if (elements.extensionsView?.checked) {
      elements.extensionsView.checked = false;
    }
  }

  function toggleExtensionsView(event) {
    if (!isMobile() || !elements.extensionsView) return;

    if (elements.extensionsView.checked) {
      event.preventDefault();
      elements.extensionsView.checked = false;
      return false;
    }

    if (elements.explorerView?.checked) {
      elements.explorerView.checked = false;
    }
  }

  function initMobileViewToggle() {
    if (!elements.explorerLabel || !elements.extensionsLabel) return;

    elements.explorerLabel.addEventListener('click', toggleExplorerView);
    elements.extensionsLabel.addEventListener('click', toggleExtensionsView);
  }

  function isClickInsideMenu(target) {
    const clickedInsideAccount = elements.accountMenu?.contains(target);
    const clickedOnAccountLabel = elements.accountLabel?.contains(target);
    const clickedInsideSettings = elements.settingsMenu?.contains(target);
    const clickedOnSettingsLabel = elements.settingsLabel?.contains(target);

    return clickedInsideAccount || clickedOnAccountLabel || clickedInsideSettings || clickedOnSettingsLabel;
  }

  function initAccountAndSettingsToggle() {
    // Toggle para Account
    if (elements.accountLabel && elements.accountRadio && elements.closeRadio) {
      elements.accountLabel.addEventListener('mousedown', (event) => {
        // Verifica o estado ANTES do clique processar
        const wasChecked = elements.accountRadio.checked;
        
        // Se já estava checked, previne o comportamento padrão e fecha
        if (wasChecked) {
          event.preventDefault();
          // Usa setTimeout para garantir que o estado seja atualizado após o preventDefault
          setTimeout(() => {
            elements.closeRadio.checked = true;
          }, 0);
        }
        // Se não estava checked, deixa o comportamento padrão acontecer (abre o menu)
      });
    }
    
    // Toggle para Settings
    if (elements.settingsLabel && elements.settingsRadio && elements.closeRadio) {
      elements.settingsLabel.addEventListener('mousedown', (event) => {
        // Verifica o estado ANTES do clique processar
        const wasChecked = elements.settingsRadio.checked;
        
        // Se já estava checked, previne o comportamento padrão e fecha
        if (wasChecked) {
          event.preventDefault();
          // Usa setTimeout para garantir que o estado seja atualizado após o preventDefault
          setTimeout(() => {
            elements.closeRadio.checked = true;
          }, 0);
        }
        // Se não estava checked, deixa o comportamento padrão acontecer (abre o menu)
      });
    }
  }

  function initCloseMenusOnClickOutside() {
    if (!elements.closeRadio) return;

    document.addEventListener('click', (event) => {
      const clickedOnLabel = elements.accountLabel?.contains(event.target) || 
                             elements.settingsLabel?.contains(event.target);

      if (clickedOnLabel) return;

      if (!isClickInsideMenu(event.target)) {
        elements.closeRadio.checked = true;
      }
    });
  }

  function closeMobileMenus() {
    if (elements.explorerView) elements.explorerView.checked = false;
    if (elements.extensionsView) elements.extensionsView.checked = false;
  }

  function handleResize() {
    // Fecha menus mobile quando redimensiona
    if (isMobile()) {
      closeMobileMenus();
    }
    
    // Garante que o menu hamburger funcione corretamente em desktop
    if (!isMobile() && elements.menu) {
      // Se não é mobile e o menu está fechado, garante que explorer/extensions funcionem
      if (!elements.menu.checked && (elements.explorerView?.checked || elements.extensionsView?.checked)) {
        elements.menu.checked = true;
      }
    }
  }

  function initMobileMenuState() {
    if (isMobile()) {
      closeMobileMenus();
    }

    window.addEventListener('resize', handleResize);
  }

  function closeMenuAfterDelay(callback) {
    setTimeout(() => {
      if (isMobile()) {
        callback();
      }
    }, MENU_CLOSE_DELAY);
  }

  function initMobileMenuClose() {
    const mobileExplorerItems = document.querySelectorAll(SELECTORS.mobileExplorerItems);
    const extensionItems = document.querySelectorAll(SELECTORS.extensionItems);

    mobileExplorerItems.forEach((item) => {
      item.addEventListener('click', () => {
        closeMenuAfterDelay(() => {
          if (elements.explorerView) elements.explorerView.checked = false;
        });
      });
    });

    extensionItems.forEach((item) => {
      item.addEventListener('click', () => {
        closeMenuAfterDelay(() => {
          if (elements.extensionsView) elements.extensionsView.checked = false;
        });
      });
    });

    document.addEventListener('click', (event) => {
      if (!isMobile()) return;

      const clickedOnMenu = event.target.closest('.menu');
      const clickedOnExplorer = event.target.closest('.explorer');
      const clickedOnExtensions = event.target.closest('.extensions');
      const clickedOnNavigation = event.target.closest(SELECTORS.navigation);

      if (!clickedOnNavigation && !clickedOnMenu && !clickedOnExplorer && !clickedOnExtensions) {
        closeMobileMenus();
      }
    });
  }

  function init() {
    getElements();
    initDesktopMenuToggle();
    initMobileViewToggle();
    initAccountAndSettingsToggle();
    initCloseMenusOnClickOutside();
    initMobileMenuState();
    initMobileMenuClose();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
