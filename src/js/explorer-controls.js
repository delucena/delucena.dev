/**
 * Explorer Controls - Controles de Expand/Collapse e Navegação
 * Gerencia a expansão/colapso de pastas e navegação automática para arquivos
 */

(function() {
  'use strict';

  /**
   * Expande todas as pastas do explorer
   */
  function expandAll() {
    const checkboxes = document.querySelectorAll('.explorer input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
  }

  /**
   * Colapsa todas as pastas do explorer, exceto a raiz
   */
  function collapseAll() {
    const rootCheckbox = document.getElementById('folderToggleDelucenaDev');
    const checkboxes = document.querySelectorAll('.explorer input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
      // Mantém apenas a raiz expandida
      if (checkbox.id !== 'folderToggleDelucenaDev') {
        checkbox.checked = false;
      }
    });
    
    // Garante que a raiz está expandida
    if (rootCheckbox) {
      rootCheckbox.checked = true;
    }
  }

  /**
   * Encontra o caminho até um arquivo específico
   * @param {string} fileId - ID do arquivo (readme, index, experience, etc.)
   * @returns {Object|null} - Objeto com selector e path, ou null se não encontrado
   */
  function findPathToFile(fileId) {
    const fileMap = {
      'readme': {
        selector: '.explorer .desktop-only label[for="readme"]',
        path: ['folderToggleDelucenaDev']
      },
      'index': {
        selector: '.explorer .desktop-only label[for="index"]',
        path: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      },
      'experience': {
        selector: '.explorer .desktop-only label[for="experience"]',
        path: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      },
      'skills': {
        selector: '.explorer .desktop-only label[for="skills"]',
        path: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      },
      'contact': {
        selector: '.explorer .desktop-only label[for="contact"]',
        path: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      }
    };

    return fileMap[fileId] || null;
  }

  /**
   * Expande o caminho até um arquivo e destaca o arquivo
   * @param {string} fileId - ID do arquivo
   */
  function navigateToFile(fileId) {
    const fileInfo = findPathToFile(fileId);
    if (!fileInfo) return;

    // Expande todos os checkboxes no caminho
    fileInfo.path.forEach(checkboxId => {
      const checkbox = document.getElementById(checkboxId);
      if (checkbox) {
        checkbox.checked = true;
      }
    });

    // Aguarda um pouco para garantir que o DOM foi atualizado
    setTimeout(() => {
      // Encontra o label do arquivo
      const fileLabel = document.querySelector(fileInfo.selector);
      if (fileLabel) {
        // Remove destaque anterior
        document.querySelectorAll('.explorer label.highlighted').forEach(label => {
          label.classList.remove('highlighted');
        });

        // Adiciona destaque ao arquivo
        fileLabel.classList.add('highlighted');

        // Scroll até o arquivo
        fileLabel.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });

        // Remove o destaque após alguns segundos
        setTimeout(() => {
          fileLabel.classList.remove('highlighted');
        }, 2000);
      }
    }, 100);
  }

  /**
   * Inicializa os controles do explorer
   */
  function initExplorerControls() {
    // Botões Expand/Collapse
    const expandBtn = document.getElementById('expandAll');
    const collapseBtn = document.getElementById('collapseAll');

    if (expandBtn) {
      expandBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        expandAll();
      });
    }

    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        collapseAll();
      });
    }

    // Observa mudanças nos arquivos abertos para navegar automaticamente
    const fileRadios = document.querySelectorAll('input[type="radio"][name="openedFile"]');
    fileRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.checked) {
          const fileId = this.id;
          navigateToFile(fileId);
        }
      });
    });

    // Também observa cliques diretos nos labels do explorer (apenas desktop)
    const explorerLabels = document.querySelectorAll('.explorer .desktop-only label[for="readme"], .explorer .desktop-only label[for="index"], .explorer .desktop-only label[for="experience"], .explorer .desktop-only label[for="skills"], .explorer .desktop-only label[for="contact"]');
    explorerLabels.forEach(label => {
      label.addEventListener('click', function() {
        const fileId = this.getAttribute('for');
        if (fileId) {
          // Pequeno delay para garantir que o radio foi marcado e o DOM foi atualizado
          setTimeout(() => {
            navigateToFile(fileId);
          }, 100);
        }
      });
    });
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExplorerControls);
  } else {
    initExplorerControls();
  }
})();
