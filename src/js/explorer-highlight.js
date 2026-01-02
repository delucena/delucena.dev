/**
 * Explorer Highlight
 * Expande automaticamente as pastas no explorer e destaca o arquivo
 * quando uma página é visualizada através das abas do header
 */

(function() {
  'use strict';

  // Mapeamento de arquivos para suas pastas pais que precisam ser expandidas
  const FILE_FOLDER_MAP = {
    'readme': {
      folders: ['folderToggleDelucenaDev']
    },
    'index': {
      folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
    },
    'experience': {
      folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
    },
    'skills': {
      folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
    },
    'contact': {
      folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
    }
  };

  /**
   * Expande todas as pastas necessárias para mostrar um arquivo
   * @param {string} fileId - ID do arquivo (readme, index, experience, etc)
   */
  function expandFoldersForFile(fileId) {
    const fileConfig = FILE_FOLDER_MAP[fileId];
    if (!fileConfig) return;

    // Expande todas as pastas necessárias
    fileConfig.folders.forEach(folderId => {
      const folderCheckbox = document.getElementById(folderId);
      if (folderCheckbox) {
        folderCheckbox.checked = true;
      }
    });
  }

  /**
   * Faz scroll até o arquivo no explorer
   * @param {string} fileId - ID do arquivo
   */
  function scrollToFile(fileId) {
    const fileLabel = document.querySelector(`.explorer label[for="${fileId}"]`);
    if (!fileLabel) return;

    const explorer = document.querySelector('.explorer > div:first-child');
    if (!explorer) return;

    // Aguarda um pouco para garantir que as pastas foram expandidas
    setTimeout(() => {
      const labelRect = fileLabel.getBoundingClientRect();
      const explorerRect = explorer.getBoundingClientRect();

      // Verifica se o label está visível no viewport do explorer
      const isVisible = (
        labelRect.top >= explorerRect.top &&
        labelRect.bottom <= explorerRect.bottom
      );

      if (!isVisible) {
        // Calcula a posição para scroll
        // Usa offsetTop relativo ao container do explorer
        let labelOffsetTop = 0;
        let element = fileLabel;
        while (element && element !== explorer) {
          labelOffsetTop += element.offsetTop;
          element = element.offsetParent;
        }

        const explorerHeight = explorer.clientHeight;
        const labelHeight = fileLabel.offsetHeight;

        // Centraliza o arquivo na viewport do explorer
        const targetScroll = labelOffsetTop - (explorerHeight / 2) + (labelHeight / 2);
        
        explorer.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  /**
   * Inicializa os listeners para mudanças de arquivo
   */
  function initFileChangeListeners() {
    const header = document.getElementById('header');
    if (!header) return;

    const fileRadios = header.querySelectorAll('input[type="radio"][name="openedFile"]');
    
    fileRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          const fileId = this.id;
          expandFoldersForFile(fileId);
          scrollToFile(fileId);
        }
      });
    });
  }

  /**
   * Inicializa o highlight do arquivo atual na carga da página
   */
  function initCurrentFileHighlight() {
    const header = document.getElementById('header');
    if (!header) return;

    const checkedRadio = header.querySelector('input[type="radio"][name="openedFile"]:checked');
    if (checkedRadio) {
      const fileId = checkedRadio.id;
      expandFoldersForFile(fileId);
      scrollToFile(fileId);
    }
  }

  /**
   * Inicializa o módulo
   */
  function init() {
    initFileChangeListeners();
    
    // Aguarda um pouco para garantir que o DOM está totalmente carregado
    setTimeout(() => {
      initCurrentFileHighlight();
    }, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
