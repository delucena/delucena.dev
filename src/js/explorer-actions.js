/**
 * Gerenciador de ações do Explorer
 * Controla expand/collapse de todas as pastas
 */

(function() {
  'use strict';

  /**
   * Inicializa os event listeners para os botões de ação
   */
  function initExplorerActions() {
    // Aguarda o DOM estar pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupActions);
    } else {
      setupActions();
    }
  }

  /**
   * Configura os event listeners dos botões
   */
  function setupActions() {
    const explorer = document.querySelector('.explorer');
    if (!explorer) return;

    // Botões de expandir/colapsar tudo no header do projeto
    const expandAllBtn = document.getElementById('expandAllBtn');
    const collapseAllBtn = document.getElementById('collapseAllBtn');
    
    if (expandAllBtn) {
      expandAllBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Previne que o clique expanda/colapse o projeto raiz
        expandAllFolders(explorer);
      });
    }
    
    if (collapseAllBtn) {
      collapseAllBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Previne que o clique expanda/colapse o projeto raiz
        collapseAllFolders(explorer);
      });
    }

    // Botões de criar arquivo/pasta (apenas visual, sem ação)
    const createFileBtns = explorer.querySelectorAll('.explorer-action-btn[aria-label="Criar arquivo"]');
    const createFolderBtns = explorer.querySelectorAll('.explorer-action-btn[aria-label="Criar pasta"]');
    
    createFileBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Previne que o clique expanda/colapse o projeto raiz
        // Sem ação - apenas visual
      });
    });
    
    createFolderBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation(); // Previne que o clique expanda/colapse o projeto raiz
        // Sem ação - apenas visual
      });
    });

    // Toggle Expand/Collapse - usa checkbox igual ao toggle de código
    const toggleCheckbox = document.getElementById('toggleExpandCollapse');
    if (toggleCheckbox) {
      toggleCheckbox.addEventListener('change', function() {
        const explorer = document.querySelector('.explorer');
        if (!explorer) return;
        
        if (toggleCheckbox.checked) {
          expandAllFolders(explorer);
        } else {
          collapseAllFolders(explorer);
        }
        updateToggleIcon();
      });
      
      // Atualiza o ícone inicial
      updateToggleIcon();
    }

    // Expande automaticamente o caminho quando um arquivo é clicado
    setupFileClickExpansion(explorer);
  }

  /**
   * Expande todas as pastas no explorer
   */
  function expandAllFolders(explorer) {
    // Seleciona todos os checkboxes de pastas dentro do explorer
    // Exclui os checkboxes de OUTLINE e TIMELINE que estão no explorer-bottom
    // Exclui também o checkbox do toggle expand/collapse
    const allCheckboxes = explorer.querySelectorAll('input[type="checkbox"]');
    
    allCheckboxes.forEach(checkbox => {
      // Verifica se o checkbox NÃO está dentro do explorer-bottom
      const isInExplorerBottom = checkbox.closest('.explorer-bottom');
      // Verifica se NÃO é o checkbox do toggle expand/collapse
      const isToggleCheckbox = checkbox.id === 'toggleExpandCollapse';
      
      if (!isInExplorerBottom && !isToggleCheckbox) {
        checkbox.checked = true;
      }
    });
  }

  /**
   * Colapsa todas as pastas no explorer
   */
  function collapseAllFolders(explorer) {
    // Seleciona todos os checkboxes de pastas dentro do explorer
    // Exclui os checkboxes de OUTLINE e TIMELINE que estão no explorer-bottom
    // Exclui também o checkbox do toggle expand/collapse
    // Colapsa também o projeto raiz (folderToggleDelucenaDev)
    const allCheckboxes = explorer.querySelectorAll('input[type="checkbox"]');
    
    allCheckboxes.forEach(checkbox => {
      // Verifica se o checkbox NÃO está dentro do explorer-bottom
      const isInExplorerBottom = checkbox.closest('.explorer-bottom');
      // Verifica se NÃO é o checkbox do toggle expand/collapse
      const isToggleCheckbox = checkbox.id === 'toggleExpandCollapse';
      
      if (!isInExplorerBottom && !isToggleCheckbox) {
        checkbox.checked = false;
      }
    });
  }

  /**
   * Configura a expansão automática do caminho quando um arquivo é clicado
   */
  function setupFileClickExpansion(explorer) {
    // IDs dos arquivos que devem expandir o caminho
    const fileIds = ['index', 'experience', 'skills', 'contact', 'readme'];
    
    // Listener para cliques nos labels do explorer
    fileIds.forEach(fileId => {
      // Busca o label do arquivo no explorer (desktop e mobile)
      const fileLabel = explorer.querySelector(`label[for="${fileId}"]`);
      
      if (fileLabel) {
        fileLabel.addEventListener('click', () => {
          expandPathToFile(fileLabel);
        });
      }
    });

    // Listener para mudanças nos radio buttons do header (quando arquivo é selecionado)
    const header = document.getElementById('header');
    if (header) {
      fileIds.forEach(fileId => {
        const radio = document.getElementById(fileId);
        if (radio) {
          radio.addEventListener('change', () => {
            if (radio.checked) {
              // Aguarda um pouco para garantir que o DOM foi atualizado
              setTimeout(() => {
                const fileLabel = explorer.querySelector(`label[for="${fileId}"]`);
                if (fileLabel) {
                  expandPathToFileAndScroll(fileLabel);
                }
              }, 50);
            }
          });
        }
      });
    }
  }

  /**
   * Expande todas as pastas no caminho até o arquivo
   */
  function expandPathToFile(fileLabel) {
    const checkboxesToExpand = [];
    const explorer = fileLabel.closest('.explorer');
    if (!explorer) return;

    let currentUl = fileLabel.closest('ul'); // <ul> que contém o arquivo
    
    // Sobe na árvore DOM encontrando todos os checkboxes de pastas ancestrais
    // A estrutura é: <li><label class="folder" for="...">...</label><input type="checkbox" id="..."><ul>...</ul></li>
    while (currentUl) {
      // Verifica se ainda está dentro do explorer
      if (!explorer.contains(currentUl)) {
        break;
      }

      // Verifica se está no explorer-bottom (não deve expandir)
      if (currentUl.closest('.explorer-bottom')) {
        break;
      }

      // O checkbox está antes do <ul> (irmão anterior)
      const checkbox = currentUl.previousElementSibling;
      
      if (checkbox && checkbox.type === 'checkbox') {
        // Verifica se não está no explorer-bottom
        const isInExplorerBottom = checkbox.closest('.explorer-bottom');
        if (!isInExplorerBottom) {
          checkboxesToExpand.push(checkbox);
        }
      }
      
      // Sobe para o próximo nível (<ul> pai)
      const parentLi = currentUl.parentElement;
      if (parentLi && parentLi.tagName === 'LI') {
        currentUl = parentLi.closest('ul');
      } else {
        // Se não há mais <ul> pai, para
        break;
      }
      
      // Para se não houver mais <ul>
      if (!currentUl) {
        break;
      }
    }
    
    // Marca todos os checkboxes encontrados como checked
    checkboxesToExpand.forEach(checkbox => {
      checkbox.checked = true;
    });
  }

  /**
   * Expande o caminho até o arquivo e faz scroll para ele
   */
  function expandPathToFileAndScroll(fileLabel) {
    const explorer = document.querySelector('.explorer');
    if (!explorer || !fileLabel) return;

    // Garante que o explorer esteja visível primeiro
    ensureExplorerVisible();

    // Expande o caminho
    expandPathToFile(fileLabel);

    // Aguarda a expansão ser renderizada e o explorer estar visível
    setTimeout(() => {
      // Encontra o container scrollável (pode ser o explorer ou seu primeiro filho)
      const scrollContainer = explorer.querySelector('> div:first-child') || explorer;
      
      if (!scrollContainer) return;

      // Verifica se o arquivo está visível
      const fileRect = fileLabel.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();
      
      // Se o arquivo não está visível, faz scroll
      if (fileRect.top < containerRect.top || fileRect.bottom > containerRect.bottom) {
        // Calcula a posição relativa do arquivo dentro do container
        const fileTop = fileLabel.offsetTop;
        const containerTop = scrollContainer.scrollTop;
        const containerHeight = scrollContainer.clientHeight;
        
        // Calcula a posição ideal (arquivo no topo com margem)
        const targetScroll = fileTop - 20; // 20px de margem no topo
        
        // Faz scroll suave até o arquivo
        scrollContainer.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  /**
   * Garante que o explorer esteja visível
   */
  function ensureExplorerVisible() {
    const menu = document.getElementById('menu');
    const explorerView = document.getElementById('explorerView');
    
    // Abre o menu se estiver fechado
    if (menu && !menu.checked) {
      menu.checked = true;
    }
    
    // Seleciona a view do explorer se não estiver selecionada
    if (explorerView && !explorerView.checked) {
      explorerView.checked = true;
    }
  }

  /**
   * Atualiza o ícone do botão toggle
   */
  function updateToggleIcon() {
    const toggleCheckbox = document.getElementById('toggleExpandCollapse');
    const toggleLabel = document.querySelector('.expand-collapse-toggle-btn');
    
    if (!toggleCheckbox || !toggleLabel) return;
    
    const expandIcon = toggleLabel.querySelector('.expand-icon');
    const collapseIcon = toggleLabel.querySelector('.collapse-icon');
    
    if (expandIcon && collapseIcon) {
      if (toggleCheckbox.checked) {
        // Modo expandido - mostra ícone de collapse
        expandIcon.style.display = 'none';
        collapseIcon.style.display = 'block';
        toggleLabel.title = 'Colapsar todas as pastas';
        toggleLabel.setAttribute('aria-label', 'Colapsar todas as pastas');
      } else {
        // Modo colapsado - mostra ícone de expand
        expandIcon.style.display = 'block';
        collapseIcon.style.display = 'none';
        toggleLabel.title = 'Expandir todas as pastas';
        toggleLabel.setAttribute('aria-label', 'Expandir todas as pastas');
      }
    }
  }

  // Inicializa quando o script é carregado
  initExplorerActions();
})();
