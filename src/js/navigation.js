(function() {
  'use strict';

  const MOBILE_BREAKPOINT = 768;
  const MENU_CLOSE_DELAY = 100;

  const SELECTORS = {
    menu: '#menu',
    explorerView: '#explorerView',
    extensionsView: '#extensionsView',
    closeView: '#closeView',
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
    elements.closeView = document.querySelector(SELECTORS.closeView);
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
      updateSidebarState();
    }
  }

  function updateSidebarState() {
    // Atualiza classe no body baseado no estado do menu
    if (elements.menu) {
      if (elements.menu.checked) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
    }
  }

  function initDesktopMenuToggle() {
    if (!elements.explorerView || !elements.extensionsView || !elements.menu) return;

    // Atualiza estado inicial
    updateSidebarState();

    // Observa mudanças no checkbox do menu
    elements.menu.addEventListener('change', updateSidebarState);

    elements.explorerView.addEventListener('change', openMenuIfNeeded);
    elements.extensionsView.addEventListener('change', openMenuIfNeeded);
  }

  function toggleExplorerView(event) {
    if (!isMobile() || !elements.explorerView) return;

    if (elements.explorerView.checked) {
      event.preventDefault();
      // Radio não pode ser desmarcado; volta para o estado "fechado"
      if (elements.closeView) elements.closeView.checked = true;
      return false;
    }

    if (elements.extensionsView?.checked) {
      if (elements.closeView) {
        elements.closeView.checked = true;
      } else {
        // Fallback (deve ser raro): força fechar pelo rádio "close"
        const close = document.querySelector('#closeView');
        if (close) close.checked = true;
      }
    }
  }

  function toggleExtensionsView(event) {
    if (!isMobile() || !elements.extensionsView) return;

    if (elements.extensionsView.checked) {
      event.preventDefault();
      // Radio não pode ser desmarcado; volta para o estado "fechado"
      if (elements.closeView) elements.closeView.checked = true;
      return false;
    }

    if (elements.explorerView?.checked) {
      if (elements.closeView) {
        elements.closeView.checked = true;
      } else {
        // Fallback (deve ser raro): força fechar pelo rádio "close"
        const close = document.querySelector('#closeView');
        if (close) close.checked = true;
      }
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
    // Radio não pode ser desmarcado; seleciona explicitamente o estado "fechado"
    if (elements.closeView) {
      elements.closeView.checked = true;
      return;
    }
    // Fallback para compatibilidade
    const close = document.querySelector('#closeView');
    if (close) close.checked = true;
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
      updateSidebarState();
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
          closeMobileMenus();
        });
      });
    });

    extensionItems.forEach((item) => {
      item.addEventListener('click', () => {
        closeMenuAfterDelay(() => {
          closeMobileMenus();
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

  /**
   * Obtém todas as páginas habilitadas na ordem correta
   */
  function getEnabledPages() {
    const pageOrder = ['readme', 'index', 'experience', 'skills', 'contact'];
    const enabledPages = [];
    
    pageOrder.forEach(pageId => {
      const radio = document.getElementById(pageId);
      if (radio && radio.closest('.editor-tab')) {
        // Verifica se a página está habilitada (existe no DOM)
        enabledPages.push(pageId);
      }
    });
    
    return enabledPages;
  }

  /**
   * Obtém a página atualmente ativa
   */
  function getCurrentPage() {
    const radios = document.querySelectorAll('input[type="radio"][name="openedFile"]:checked');
    if (radios.length > 0) {
      return radios[0].id;
    }
    return null;
  }

  /**
   * Navega para uma página específica
   */
  function navigateToPage(pageId) {
    const radio = document.getElementById(pageId);
    if (radio) {
      radio.checked = true;
      // Dispara o evento change para que outros listeners sejam notificados
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * Atualiza o estado dos botões de navegação (disabled/enabled)
   */
  function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    const enabledPages = getEnabledPages();
    const currentPage = getCurrentPage();
    
    if (!currentPage || enabledPages.length === 0) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    
    const currentIndex = enabledPages.indexOf(currentPage);
    
    // Desabilita botão anterior se estiver na primeira página
    prevBtn.disabled = currentIndex <= 0;
    
    // Desabilita botão próximo se estiver na última página
    nextBtn.disabled = currentIndex >= enabledPages.length - 1;
  }

  /**
   * Inicializa a navegação de páginas
   */
  function initPageNavigation() {
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    
    if (!prevBtn || !nextBtn) return;
    
    // Navegação para página anterior
    prevBtn.addEventListener('click', () => {
      const enabledPages = getEnabledPages();
      const currentPage = getCurrentPage();
      
      if (!currentPage) return;
      
      const currentIndex = enabledPages.indexOf(currentPage);
      if (currentIndex > 0) {
        const prevPageId = enabledPages[currentIndex - 1];
        navigateToPage(prevPageId);
      }
    });
    
    // Navegação para próxima página
    nextBtn.addEventListener('click', () => {
      const enabledPages = getEnabledPages();
      const currentPage = getCurrentPage();
      
      if (!currentPage) return;
      
      const currentIndex = enabledPages.indexOf(currentPage);
      if (currentIndex < enabledPages.length - 1) {
        const nextPageId = enabledPages[currentIndex + 1];
        navigateToPage(nextPageId);
      }
    });
    
    // Observa mudanças nas páginas para atualizar o estado dos botões
    const fileRadios = document.querySelectorAll('input[type="radio"][name="openedFile"]');
    fileRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Pequeno delay para garantir que o DOM foi atualizado
        setTimeout(updateNavigationButtons, 50);
      });
    });
    
    // Atualiza o estado inicial dos botões após um pequeno delay
    // para garantir que todos os elementos estejam prontos
    setTimeout(updateNavigationButtons, 100);
    
    // Também observa mudanças no DOM caso as páginas sejam carregadas dinamicamente
    const observer = new MutationObserver(() => {
      updateNavigationButtons();
    });
    
    const headerElement = document.getElementById('header');
    if (headerElement) {
      observer.observe(headerElement, { childList: true, subtree: true });
    }
  }

  function init() {
    getElements();
    initDesktopMenuToggle();
    initMobileViewToggle();
    initAccountAndSettingsToggle();
    initCloseMenusOnClickOutside();
    initMobileMenuState();
    initMobileMenuClose();
    initPageNavigation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
